# server.py

from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory "database"
expenses = []

@app.route('/')
def home():
    return "<h1>Welcome to WheresMyMoney Backend!</h1>", 200

@app.route('/expenses', methods=['GET'])
def get_expenses():
    return jsonify(expenses)

@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    if not data or 'name' not in data or 'amount' not in data:
        return jsonify({"error": "Missing name or amount field."}), 400

    expenses.append({
        "name": data['name'],
        "amount": data['amount']
    })
    return jsonify({"message": "Expense added successfully!"}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)

