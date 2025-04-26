const API_URL = "http://localhost:5001";

export async function getExpenses() {
  const response = await fetch(`${API_URL}/expenses`);
  return response.json();
}

export async function addExpense(expense) {
  const response = await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  return response.json();
}
