from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
import firebase_admin
from firebase_admin import credentials, firestore
import os
import google.generativeai as genai
from PIL import Image
import io
import json
from dotenv import load_dotenv
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from email_fetcher.fetching import get_receipt_emails
import datetime

load_dotenv()

app = Flask(__name__)

# Correct CORS setup
CORS(app, origins="*", supports_credentials=True)

# Initialize Firebase
cred = credentials.Certificate('flaskPrivateKey.json')  # Update the path

firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()

# Configure Gemini API key
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')  # Get from environment variable
genai.configure(api_key=GOOGLE_API_KEY)

# Your in-memory expenses list (this can be removed once data is stored in Firestore)
expenses = []
next_id = 1

CATEGORIES = ['Groceries', 'Dining', 'Transportation', 'Housing', 'Personal Care', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Travel/Vacation', 'Business', 'Other']

@app.route('/')
def home():
    return "<h1>Welcome to WheresMyMoney Backend!</h1>", 200

@app.route('/expenses', methods=['GET'])
def get_expenses():
    # Query Firestore for expenses (or use in-memory list for now)
    expenses_ref = db.collection('expenses').stream()  # Query Firestore for all expenses
    expenses_data = [expense.to_dict() for expense in expenses_ref]
    return jsonify(expenses_data)

@app.route('/expenses', methods=['POST'])
def add_expense():
    global next_id
    data = request.get_json()

    if not data or 'merchName' not in data or 'Amount' not in data:
        return jsonify({"error": "Missing name or amount field."}), 400

    new_expense = {
        "merchName": data['merchName'],
        "Amount": data['Amount'],
        "category": data.get('category', 'Uncategorized'),
        #"date": data.get('date', 'Unknown'),
        "createdAt": firestore.SERVER_TIMESTAMP  # Add Firebase timestamp here
    }

    # Add to Firestore
    doc_ref = db.collection('expenses').document()  # Auto-generated ID for each document
    doc_ref.set(new_expense)

    # Update in-memory list (optional, can be removed if Firestore is the sole source of data)
    new_expense["id"] = next_id
    expenses.append(new_expense)
    next_id += 1

    return jsonify({"message": "Expense added successfully!"}), 201

@app.route('/process-receipt', methods=['POST'])
def process_receipt():
    try:
        # Check if image was sent
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        image_file = request.files['image']
        
        # Open image with PIL
        image = Image.open(image_file)
        
        # Convert image to bytes for Gemini
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format=image.format or 'PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Create prompt
        prompt = f"""Analyze this receipt image and extract the following information:
        1. Merchant name (store or business name)
        2. Total amount (the final amount paid)
        3. Categorize the purchase into one of these categories: {', '.join(CATEGORIES)}
        
        Respond ONLY with a JSON object in this exact format:
        {{
            "merchant_name": "extracted merchant name",
            "amount": numeric_value,
            "category": "category from the list"
        }}
        
        Do not include any other text or explanation."""
        
        # Generate response from Gemini
        response = model.generate_content([
            prompt,
            {
                "mime_type": f"image/{image.format.lower() if image.format else 'png'}",
                "data": img_byte_arr
            }
        ])
        
        # Parse the response
        try:
            import json
            # Clean the response text in case it contains markdown code blocks
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text.split('```json')[1]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            extracted_data = json.loads(response_text.strip())
            
            # Validate data
            merchant_name = extracted_data.get('merchant_name', '')
            amount = float(extracted_data.get('amount', 0))
            category = extracted_data.get('category', 'Miscellaneous')
            
            # Ensure category is valid
            if category not in CATEGORIES:
                category = 'Other'
            
            # Save to Firebase
            new_expense = {
                "merchName": merchant_name,
                "Amount": amount,
                "category": category,
                "createdAt": firestore.SERVER_TIMESTAMP,
                "imageUrl": None  # You could add image storage functionality here
            }
            
            doc_ref = db.collection('expenses').document()
            doc_ref.set(new_expense)
            
            return jsonify({
                "message": "Receipt processed successfully",
                "data": {
                    "merchant_name": merchant_name,
                    "amount": amount,
                    "category": category,
                    "id": doc_ref.id
                }
            }), 201
            
        except Exception as parse_error:
            print(f"Error parsing Gemini response: {parse_error}")
            print(f"Raw response: {response.text}")
            return jsonify({"error": "Failed to parse receipt data"}), 500
        
    except Exception as e:
        print(f"Error processing receipt: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/process-email-receipts', methods=['POST'])
def process_email_receipts():
    try:
        # Fetch receipt emails
        email_receipts = get_receipt_emails()
        
        if not email_receipts:
            return jsonify({"message": "No receipt emails found"}), 200
        
        processed_receipts = []
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        for email in email_receipts:
            # Combine email subject and body for analysis
            email_content = f"""
Subject: {email['subject']}
From: {email['from']}
Date: {email['date']}
Body: {email['body'] or email['html_body']}
"""
            
            # Create prompt for Gemini
            prompt = f"""Analyze this email receipt and extract the following information:
            1. Merchant name (store or business name)
            2. Total amount (the final amount paid)
            3. Categorize the purchase into one of these categories: {', '.join(CATEGORIES)}
            
            Email content:
            {email_content}
            
            Respond ONLY with a JSON object in this exact format:
            {{
                "merchant_name": "extracted merchant name",
                "amount": numeric_value,
                "category": "category from the list"
            }}
            
            Do not include any other text or explanation."""
            
            try:
                # Generate response from Gemini
                response = model.generate_content(prompt)
                
                # Clean and parse response
                response_text = response.text.strip()
                if response_text.startswith('```json'):
                    response_text = response_text.split('```json')[1]
                if response_text.startswith('```'):
                    response_text = response_text[3:]
                if response_text.endswith('```'):
                    response_text = response_text[:-3]
                
                extracted_data = json.loads(response_text.strip())
                
                # Validate data
                merchant_name = extracted_data.get('merchant_name', '')
                amount = float(extracted_data.get('amount', 0))
                category = extracted_data.get('category', 'Miscellaneous')
                
                # Ensure category is valid
                if category not in CATEGORIES:
                    category = 'Miscellaneous'
                
                # Save to Firebase
                new_expense = {
                    "merchName": merchant_name,
                    "Amount": amount,
                    "category": category,
                    "createdAt": firestore.SERVER_TIMESTAMP,
                    "source": "email",
                    "emailSubject": email['subject'],
                    "emailDate": email['date']
                }
                
                doc_ref = db.collection('expenses').document()
                doc_ref.set(new_expense)
                
                processed_receipts.append({
                    "merchant_name": merchant_name,
                    "amount": amount,
                    "category": category,
                    "id": doc_ref.id,
                    "email_subject": email['subject']
                })
                
            except Exception as parse_error:
                print(f"Error parsing email receipt: {parse_error}")
                continue
        
        return jsonify({
            "message": f"Processed {len(processed_receipts)} email receipts",
            "data": processed_receipts
        }), 201
        
    except Exception as e:
        print(f"Error processing email receipts: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/fetch-email-receipts', methods=['GET'])
def fetch_email_receipts():
    try:
        email_receipts = get_receipt_emails()
        return jsonify({
            "message": f"Found {len(email_receipts)} receipt emails",
            "receipts": [{"subject": email['subject'], "from": email['from'], "date": email['date']} for email in email_receipts]
        }), 200
    except Exception as e:
        print(f"Error fetching email receipts: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        conversation_history = data.get('history', [])
        
        if not user_message:
            return jsonify({"error": "Message is required"}), 400
        
        # Get user's financial data from Firestore
        expenses_ref = db.collection('expenses').stream()
        expenses_data = [expense.to_dict() for expense in expenses_ref]
        
        # Calculate financial insights
        total_spent = sum(float(expense.get('Amount', 0)) for expense in expenses_data)
        
        # Get spending by category
        category_spending = {}
        for expense in expenses_data:
            category = expense.get('category', 'Uncategorized')
            amount = float(expense.get('Amount', 0))
            category_spending[category] = category_spending.get(category, 0) + amount
        
        # Sort categories by spending
        sorted_categories = sorted(category_spending.items(), key=lambda x: x[1], reverse=True)
        
        # Calculate monthly stats
        current_month_expenses = []
        current_month = datetime.datetime.now().month
        current_year = datetime.datetime.now().year
        
        for expense in expenses_data:
            if 'createdAt' in expense and expense['createdAt']:
                expense_date = expense['createdAt'].date()
                if expense_date.month == current_month and expense_date.year == current_year:
                    current_month_expenses.append(expense)
        
        monthly_spent = sum(float(expense.get('Amount', 0)) for expense in current_month_expenses)
        
        # Calculate average transaction
        avg_transaction = total_spent / len(expenses_data) if expenses_data else 0
        
        # Analyze spending by merchant for specific advice
        merchant_spending = {}
        for expense in expenses_data:
            merchant = expense.get('merchName', 'Unknown')
            amount = float(expense.get('Amount', 0))
            category = expense.get('category', 'Uncategorized')
            
            if merchant not in merchant_spending:
                merchant_spending[merchant] = {
                    'total': 0,
                    'count': 0,
                    'category': category,
                    'transactions': []
                }
            
            merchant_spending[merchant]['total'] += amount
            merchant_spending[merchant]['count'] += 1
            merchant_spending[merchant]['transactions'].append({
                'amount': amount,
                'date': expense.get('createdAt'),
                'category': category
            })
        
        # Sort merchants by total spending
        sorted_merchants = sorted(
            merchant_spending.items(), 
            key=lambda x: x[1]['total'], 
            reverse=True
        )
        
        # Identify recurring expenses
        recurring_expenses = []
        for merchant, data in merchant_spending.items():
            if data['count'] >= 3:  # Consider recurring if visited 3+ times
                recurring_expenses.append({
                    'merchant': merchant,
                    'frequency': data['count'],
                    'avg_amount': data['total'] / data['count'],
                    'total_spent': data['total'],
                    'category': data['category']
                })
        
        # Get budget from the message context (default to 1000)
        monthly_budget = 1000
        budget_remaining = monthly_budget - monthly_spent
        budget_percentage = (monthly_spent / monthly_budget) * 100 if monthly_budget > 0 else 0
        
        # Create conversation context
        conversation_context = "\n".join([
            f"{msg['sender'].capitalize()}: {msg['text']}" 
            for msg in conversation_history[-5:]
        ])
        
        # Create detailed financial context
        financial_context = f"""
        User's Financial Overview:
        - Total amount spent: ${total_spent:.2f}
        - Monthly spending (current month): ${monthly_spent:.2f}
        - Monthly budget: ${monthly_budget}
        - Budget remaining: ${budget_remaining:.2f}
        - Budget usage percentage: {budget_percentage:.1f}%
        - Average transaction size: ${avg_transaction:.2f}
        - Number of transactions: {len(expenses_data)}
        
        Spending by category (top 3):
        {chr(10).join([f"- {cat}: ${amount:.2f}" for cat, amount in sorted_categories[:3]])}
        
        Top merchants by spending:
        {chr(10).join([f"- {merch}: ${data['total']:.2f} ({data['count']} visits, category: {data['category']})" for merch, data in sorted_merchants[:5]])}
        
        Recurring expenses:
        {chr(10).join([f"- {item['merchant']}: {item['frequency']} times, avg ${item['avg_amount']:.2f} per visit" for item in recurring_expenses[:5]])}
        
        Recent transactions (last 5):
        {chr(10).join([f"- {exp.get('merchName', 'Unknown')}: ${exp.get('Amount', 0)} ({exp.get('category', 'Uncategorized')})" for exp in expenses_data[-5:]])}
        """
        
        # Create prompt for Gemini
        prompt = f"""
        You are a helpful financial assistant chatbot named FinBot. Based on the user's financial data below, their conversation history, and current question, provide personalized, specific advice.
        
        Your goal is to give specific, actionable advice including:
        1. Suggesting cheaper alternatives to specific products/services they currently use
        2. Identifying where they can save money based on their actual merchants/brands
        3. Recommending specific changes to their spending habits
        4. Pointing out recurring expenses that could be reduced or eliminated
        5. Suggesting specific budget-friendly alternatives based on their spending category
        
        For example:
        - If they spend a lot at Starbucks, suggest making coffee at home or cheaper coffee shops
        - If they frequently use Uber, suggest public transit or carpooling alternatives
        - If they shop at premium grocery stores, suggest discount alternatives
        - If they have recurring subscriptions, suggest reviewing if they're all needed
        
        CONVERSATION HISTORY:
        {conversation_context}
        
        FINANCIAL DATA:
        {financial_context}
        
        CURRENT USER QUESTION: {user_message}
        
        Provide specific, actionable advice mentioning actual merchants and alternatives. Keep your response to 2-3 sentences maximum.
        """
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate response
        response = model.generate_content(prompt)
        bot_response = response.text.strip()
        
        return jsonify({
            "response": bot_response,
            "financial_summary": {
                "total_spent": total_spent,
                "monthly_spent": monthly_spent,
                "monthly_budget": monthly_budget,
                "budget_remaining": budget_remaining,
                "budget_percentage": budget_percentage,
                "avg_transaction": avg_transaction,
                "top_categories": sorted_categories[:3] if sorted_categories else [],
                "top_merchants": [(merch, data['total']) for merch, data in sorted_merchants[:3]],
                "recurring_expenses": recurring_expenses[:3]
            }
        }), 200
        
    except Exception as e:
        print(f"Error in chatbot: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)