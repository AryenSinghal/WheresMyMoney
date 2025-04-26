from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore

app = Flask(__name__)

# Correct CORS setup
CORS(app, origins="*", supports_credentials=True)

expenses = []
next_id = 1

@app.route('/')
def home():
    return "<h1>Welcome to WheresMyMoney Backend!</h1>", 200

@app.route('/expenses', methods=['GET'])
def get_expenses():
    return jsonify(expenses)

@app.route('/expenses', methods=['POST'])
def add_expense():
    global next_id
    data = request.get_json()

    if not data or 'name' not in data or 'amount' not in data:
        return jsonify({"error": "Missing name or amount field."}), 400

    new_expense = {
        "id": next_id,
        "name": data['name'],
        "amount": data['amount'],
        "category": data.get('category', 'Uncategorized'),
        "date": data.get('date', 'Unknown')
    }
    expenses.append(new_expense)
    next_id += 1

    return jsonify({"message": "Expense added successfully!"}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5001)
