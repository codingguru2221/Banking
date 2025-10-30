package com.bank.service;

import com.bank.model.Account;
import com.bank.model.Transaction;
import com.bank.repository.TransactionRepository;
import com.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private AccountService accountService;
    
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    public List<Transaction> getTransactionsForAccount(Long accountId) {
        return transactionRepository.findByFromAccountIdOrToAccountIdOrderByTimestampDesc(accountId, accountId);
    }
    
    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
    
    public boolean transferMoney(Long fromAccountId, Long toAccountId, BigDecimal amount, String description) {
        // Check if both accounts exist
        Account fromAccount = accountService.getAccountById(fromAccountId).orElse(null);
        Account toAccount = accountService.getAccountById(toAccountId).orElse(null);
        
        if (fromAccount == null || toAccount == null) {
            return false;
        }
        
        // Check if sender has sufficient balance
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            return false;
        }
        
        // Perform the transfer
        boolean withdrawalSuccess = accountService.withdraw(fromAccountId, amount);
        if (!withdrawalSuccess) {
            return false;
        }
        
        boolean depositSuccess = accountService.deposit(toAccountId, amount);
        if (!depositSuccess) {
            // Rollback withdrawal if deposit fails
            accountService.deposit(fromAccountId, amount);
            return false;
        }
        
        // Record the transaction
        Transaction transaction = new Transaction();
        transaction.setType(Transaction.TransactionType.TRANSFER);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setFromAccountId(fromAccountId);
        transaction.setToAccountId(toAccountId);
        transactionRepository.save(transaction);
        
        return true;
    }
}