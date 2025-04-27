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

load_dotenv()

app = Flask(__name__)

# Correct CORS setup
CORS(app, origins="*", supports_credentials=True)

# Initialize Firebase
cred = credentials.Certificate('/Users/siwenshao/Documents/LAHacks/flaskPrivateKey.json')  # Update the path

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

if __name__ == '__main__':
    app.run(debug=True, port=5001)