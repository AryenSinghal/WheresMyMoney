import { doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';  // Adjust path based on your file structure

// Function to delete an expense by ID from Firestore
const deleteExpenseById = async (id) => {
  try {
    const expenseDocRef = doc(db, 'expenses', id); // 'expenses' is your Firestore collection
    await deleteDoc(expenseDocRef); // Delete the document
    console.log('Expense deleted successfully');
  } catch (error) {
    console.error('Error deleting expense: ', error);
  }
};

export { deleteExpenseById }; // Don't forget to export the function
