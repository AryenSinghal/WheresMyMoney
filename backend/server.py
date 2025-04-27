from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)

# Correct CORS setup
CORS(app, origins="*", supports_credentials=True)

# Initialize Firebase
cred = credentials.Certificate('flaskPrivateKey.json')  # Update the path
firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()

# Your in-memory expenses list (this can be removed once data is stored in Firestore)
expenses = []
next_id = 1

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

if __name__ == '__main__':
    app.run(debug=True, port=5001)
