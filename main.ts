#!/usr/bin/env node

import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";

console.log(chalk.yellowBright('\t\n                 Welcome to My Bank!             '));
console.log("-----------------------------------------------------------------\n");


// Customer class
class Customer {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    mobNumber: number;
    accNumber: number;

    constructor(fName: string, lName: string, age: number, gen: string, mob: number, acc: number) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gen;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}

// Interface bank account
interface BankAccount {
    accNumber: number;
    balance: number;
}

class Bank {
    customers: Customer[] = [];
    accounts: BankAccount[] = [];

    addCustomer(obj: Customer) {
        this.customers.push(obj);
    }

    addAccount(obj: BankAccount) {
        this.accounts.push(obj);
    }

    transaction(accObj: BankAccount) {
        let record = this.accounts.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.accounts = [...record, accObj];
    }
}

let myBank = new Bank();

// Customer creation
for (let i: number = 1; i <= 5; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.string.numeric());
    const cus = new Customer(fName, lName, 18 * i, "male", num, 2000 + i);
    myBank.addCustomer(cus);
    myBank.addAccount({ accNumber: cus.accNumber, balance: 500 * i });
}

// Bank functionality
async function bankService(bank: Bank) {
    let service = await inquirer.prompt({
        name: "select",
        type: "list",
        message: "Please Select the service you want",
        choices: ["View Balance", "Cash Withdraw", "Cash Deposit"]
    });

    switch (service.select) {
        case "View Balance":
            await viewBalance(bank);
            break;
        case "Cash Withdraw":
            await cashWithdraw(bank);
            break;
        case "Cash Deposit":
            await cashDeposit(bank);
            break;
    }
}

async function viewBalance(bank: Bank) {
    let res = await inquirer.prompt({
        name: "number",
        type: "input",
        message: "Please enter your account number:",
        validate: (input: string) => !isNaN(parseInt(input)) ? true : "Please enter a valid number"
    });

    let account = bank.accounts.find((acc) => acc.accNumber === parseInt(res.number));
    if (!account) {
        console.log(chalk.red.bold("Invalid Account Number"));
        return;
    }

    let customer = bank.customers.find((item) => item.accNumber === account!.accNumber);
    if (customer) {
        console.log(`Dear ${chalk.green.bold(customer.firstName)} ${chalk.green.bold(customer.lastName)}, Your Account Balance is ${chalk.bold.blueBright(`$${account.balance}`)}`);
    }
}

async function cashWithdraw(bank: Bank) {
    let res = await inquirer.prompt({
        name: "number",
        type: "input",
        message: "Please enter your account number:",
        validate: (input: string) => !isNaN(parseInt(input)) ? true : "Please enter a valid number"
    });

    let account = bank.accounts.find((acc) => acc.accNumber === parseInt(res.number));
    if (!account) {
        console.log(chalk.red.bold("Invalid Account Number"));
        return;
    }

    let ans = await inquirer.prompt({
        name: "amount",
        type: "input",
        message: "Please enter the amount to withdraw:",
        validate: (input: string) => !isNaN(parseInt(input)) ? true : "Please enter a valid number"
    });

    let amount = parseInt(ans.amount);
    if (amount > account.balance) {
        console.log(chalk.red.bold("Insufficient Balance"));
        return;
    }

    let newBalance = account.balance - amount;
    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
    console.log(chalk.green.bold(`Withdrawal Successful! New Balance: $${newBalance}`));
}

async function cashDeposit(bank: Bank) {
    let res = await inquirer.prompt({
        name: "number",
        type: "input",
        message: "Please enter your account number:",
        validate: (input: string) => !isNaN(parseInt(input)) ? true : "Please enter a valid number"
    });

    let account = bank.accounts.find((acc) => acc.accNumber === parseInt(res.number));
    if (!account) {
        console.log(chalk.red.bold("Invalid Account Number"));
        return;
    }

    let ans = await inquirer.prompt({
        name: "amount",
        type: "input",
        message: "Please enter the amount to deposit:",
        validate: (input: string) => !isNaN(parseInt(input)) ? true : "Please enter a valid number"
    });

    let amount = parseInt(ans.amount);
    let newBalance = account.balance + amount;
    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
    console.log(chalk.green.bold(`Deposit Successful! New Balance: $${newBalance}`));
}

bankService(myBank);
