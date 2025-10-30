package com.bank.controller;

import com.bank.model.Transaction;
import com.bank.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend to connect
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }
    
    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getTransactionsForAccount(@PathVariable Long accountId) {
        try {
            List<Transaction> transactions = transactionService.getTransactionsForAccount(accountId);
            return new ResponseEntity<>(transactions, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving transactions: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/transfer")
    public ResponseEntity<String> transferMoney(
            @RequestParam Long fromAccountId,
            @RequestParam Long toAccountId,
            @RequestParam BigDecimal amount,
            @RequestParam String description) {
        
        // Validate input parameters
        if (fromAccountId == null || toAccountId == null) {
            return new ResponseEntity<>("Account IDs are required", HttpStatus.BAD_REQUEST);
        }
        
        if (fromAccountId.equals(toAccountId)) {
            return new ResponseEntity<>("Cannot transfer to the same account", HttpStatus.BAD_REQUEST);
        }
        
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return new ResponseEntity<>("Amount must be positive", HttpStatus.BAD_REQUEST);
        }
        
        boolean success = transactionService.transferMoney(fromAccountId, toAccountId, amount, description);
        if (success) {
            return new ResponseEntity<>("Transfer successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Transfer failed. Check account details and balance.", HttpStatus.BAD_REQUEST);
        }
    }
}