import { useState, useEffect } from 'react';
import { accountApi, transactionApi } from './services/api';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data when component mounts
  useEffect(() => {
    loadAccounts();
  }, []);

  // Load accounts from backend
  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountApi.getAllAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load accounts');
      console.error('Error loading accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load transactions from backend
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionApi.getAllTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Navigation function
  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'transactions') {
      loadTransactions();
    }
  };

  // Render different views based on currentView state
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView navigateTo={navigateTo} accounts={accounts} transactions={transactions} />;
      case 'accounts':
        return <AccountsView navigateTo={navigateTo} accounts={accounts} setAccounts={setAccounts} loadAccounts={loadAccounts} />;
      case 'transactions':
        return <TransactionsView navigateTo={navigateTo} transactions={transactions} setTransactions={setTransactions} />;
      case 'transfer':
        return <TransferView navigateTo={navigateTo} accounts={accounts} loadAccounts={loadAccounts} />;
      default:
        return <DashboardView navigateTo={navigateTo} accounts={accounts} transactions={transactions} />;
    }
  };

  return (
    <div className="app">
      <Header navigateTo={navigateTo} />
      <main className="main-content">
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Loading...</div>}
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}

// Header Component
function Header({ navigateTo }) {
  return (
    <header className="header">
      <div className="logo">
        <h1>Banking Application</h1>
      </div>
      <nav className="navigation">
        <button onClick={() => navigateTo('dashboard')}>Dashboard</button>
        <button onClick={() => navigateTo('accounts')}>Accounts</button>
        <button onClick={() => navigateTo('transactions')}>Transactions</button>
        <button onClick={() => navigateTo('transfer')}>Transfer Money</button>
      </nav>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 Banking Application. All rights reserved.</p>
    </footer>
  );
}

// Dashboard View
function DashboardView({ navigateTo, accounts, transactions }) {
  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Accounts</h3>
          <p className="summary-value">{accounts.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Balance</h3>
          <p className="summary-value">${totalBalance.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Recent Transactions</h3>
          <p className="summary-value">{transactions.length}</p>
        </div>
      </div>
      <div className="quick-actions">
        <button onClick={() => navigateTo('accounts')}>View Accounts</button>
        <button onClick={() => navigateTo('transfer')}>Transfer Money</button>
      </div>
    </div>
  );
}

// Accounts View
function AccountsView({ navigateTo, accounts, loadAccounts }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    balance: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const accountData = {
        ...newAccount,
        balance: parseFloat(newAccount.balance) || 0
      };
      
      await accountApi.createAccount(accountData);
      setNewAccount({ name: '', email: '', phoneNumber: '', balance: '' });
      setShowCreateForm(false);
      loadAccounts(); // Refresh the accounts list
    } catch (err) {
      console.error('Error creating account:', err);
      alert('Failed to create account');
    }
  };

  return (
    <div className="accounts">
      <div className="accounts-header">
        <h2>Accounts</h2>
        <button onClick={() => setShowCreateForm(true)}>Create Account</button>
      </div>
      
      {showCreateForm && (
        <div className="account-form">
          <h3>Create New Account</h3>
          <form onSubmit={handleCreateAccount}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newAccount.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newAccount.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={newAccount.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Initial Balance:</label>
              <input
                type="number"
                name="balance"
                value={newAccount.balance}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">Create Account</button>
              <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      <div className="accounts-list">
        {accounts.length === 0 ? (
          <p>No accounts found. Create your first account!</p>
        ) : (
          accounts.map(account => (
            <div key={account.id} className="account-card">
              <h3>{account.name}</h3>
              <p>Email: {account.email}</p>
              <p>Phone: {account.phoneNumber}</p>
              <p>Balance: ${parseFloat(account.balance).toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Transactions View
function TransactionsView({ navigateTo, transactions, setTransactions }) {
  return (
    <div className="transactions">
      <h2>Transactions</h2>
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map(transaction => (
            <div key={transaction.id} className="transaction-card">
              <h3>{transaction.type}</h3>
              <p>Amount: ${parseFloat(transaction.amount).toFixed(2)}</p>
              <p>Description: {transaction.description}</p>
              <p>Date: {new Date(transaction.timestamp).toLocaleString()}</p>
              {transaction.fromAccountId && <p>From Account: {transaction.fromAccountId}</p>}
              {transaction.toAccountId && <p>To Account: {transaction.toAccountId}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Transfer View
function TransferView({ navigateTo, accounts, loadAccounts }) {
  const [transferData, setTransferData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const { fromAccountId, toAccountId, amount, description } = transferData;
      
      if (fromAccountId === toAccountId) {
        alert('Cannot transfer to the same account');
        return;
      }
      
      await transactionApi.transferMoney(
        parseInt(fromAccountId),
        parseInt(toAccountId),
        parseFloat(amount),
        description
      );
      
      alert('Transfer successful!');
      // Reset form
      setTransferData({
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        description: ''
      });
      loadAccounts(); // Refresh accounts to show updated balances
    } catch (err) {
      console.error('Error transferring money:', err);
      alert('Failed to transfer money');
    }
  };

  return (
    <div className="transfer">
      <h2>Transfer Money</h2>
      <form onSubmit={handleTransfer}>
        <div className="form-group">
          <label>From Account:</label>
          <select
            name="fromAccountId"
            value={transferData.fromAccountId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} - ${parseFloat(account.balance).toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>To Account:</label>
          <select
            name="toAccountId"
            value={transferData.toAccountId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} - ${parseFloat(account.balance).toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={transferData.amount}
            onChange={handleInputChange}
            required
            min="0.01"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={transferData.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Transfer Money</button>
        </div>
      </form>
    </div>
  );
}

export default App;