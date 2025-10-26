package com.bank;
import java.sql.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Scanner;

class Bank_locker{

}
class Bank_accounts{
    private
    String Name ;
    int id ;
//    long accountNumber;
// JDBC Connection Details
    private static final String URL = "jdbc:mysql://localhost:3306/Bank";
    private static final String USER = "root";
    private static final String PASSWORD = "Codex@123";
    void OpenAccount(){

            Scanner input = new Scanner(System.in);

            System.out.print("Enter your name: ");
            String name = input.nextLine();

            System.out.print("Enter your initial deposit amount: ");
            double balance = input.nextDouble();

            System.out.print("Enter your email: ");
            input.nextLine(); // consume newline
            String email = input.nextLine();

            System.out.print("Enter your phone number: ");
            String phone = input.nextLine();

            // Save the data to the database
            try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {

                String sql = "INSERT INTO AccountInfo (name, balance, email, phone) VALUES (?, ?, ?, ?)";
                PreparedStatement statement = connection.prepareStatement(sql);

                statement.setString(1, name);
                statement.setDouble(2, balance);
                statement.setString(3, email);
                statement.setString(4, phone);

                int rowsInserted = statement.executeUpdate();

                if (rowsInserted > 0) {
                    System.out.println("✅ Account created successfully for " + name);
                } else {
                    System.out.println("⚠️ Failed to create account. Try again.");
                }

            } catch (SQLException e) {
                e.printStackTrace();
            }

            input.close();

    }
}
class CurrencySupport{

}

public class Main {
    public static void main(String[] args) {
        Bank_accounts BC = new Bank_accounts();
        BC.OpenAccount();
    }
}
