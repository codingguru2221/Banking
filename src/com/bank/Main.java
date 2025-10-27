package com.bank;
import java.sql.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Scanner;

class Bank_locker{

}
class Bank_accounts{

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
    void ViewAccount() {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter account holder name to search: ");
        String name = input.nextLine();

        // Database logic
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            String sql = "SELECT * FROM AccountInfo WHERE name = ?";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, name);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                System.out.println("\n✅ Account Details Found:");
                System.out.println("----------------------------");
//                System.out.println("Account ID: " + resultSet.getInt("id"));
                System.out.println("Name: " + resultSet.getString("name"));
                System.out.println("Balance: ₹" + resultSet.getDouble("balance"));
                System.out.println("Email: " + resultSet.getString("email"));
                System.out.println("Phone: " + resultSet.getString("phone"));
                System.out.println("----------------------------\n");
            } else {
                System.out.println("⚠️ No account found with name: " + name);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}

class CurrencySupport{

}

public class Main {
    public static void main(String[] args) {
        Bank_accounts BC = new Bank_accounts();
        Scanner MainInput = new Scanner(System.in);
        System.out.println("Welcome to the bank");
        System.out.println("1 for opening account\n2 for View account info.");
        System.out.print("Enter Your Choice : ");

        int Choice = MainInput.nextInt();

        switch (Choice){
            case 1:
                BC.OpenAccount();
            case 2:
                BC.ViewAccount();
        }


    }
}
