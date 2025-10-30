// API service for banking application
const API_BASE_URL = 'http://localhost:8081/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Account API functions
export const accountApi = {
  // Get all accounts
  getAllAccounts: () => apiCall('/accounts'),
  
  // Get account by ID
  getAccountById: (id) => apiCall(`/accounts/${id}`),
  
  // Create a new account
  createAccount: (accountData) => 
    apiCall('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    }),
  
  // Update an account
  updateAccount: (id, accountData) => 
    apiCall(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    }),
  
  // Delete an account
  deleteAccount: (id) => 
    apiCall(`/accounts/${id}`, {
      method: 'DELETE',
    }),
  
  // Deposit money to an account
  deposit: (id, amount) => 
    apiCall(`/accounts/${id}/deposit?amount=${amount}`, {
      method: 'POST',
    }),
  
  // Withdraw money from an account
  withdraw: (id, amount) => 
    apiCall(`/accounts/${id}/withdraw?amount=${amount}`, {
      method: 'POST',
    }),
};

// Transaction API functions
export const transactionApi = {
  // Get all transactions
  getAllTransactions: () => apiCall('/transactions'),
  
  // Get transactions for an account
  getTransactionsForAccount: (accountId) => 
    apiCall(`/transactions/account/${accountId}`),
  
  // Transfer money between accounts
  transferMoney: (fromAccountId, toAccountId, amount, description) => 
    apiCall(`/transactions/transfer?fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&amount=${amount}&description=${description}`, {
      method: 'POST',
    }),
};