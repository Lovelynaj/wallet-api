import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting the transactions", error);
    res.status(500).json({ Message: "Internal Server Error" });
  }
}

export async function createTransaction(req, res) {
  //A user will want to post a transaction using amount, title, user_id and category
  // so lets create such table
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ Message: "All fields are required" });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `;
    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ Message: "Internal Server Error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }

    const result = await sql`
        DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting the transaction", error);
    res.status(500).json({ Message: "Internal Server Error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    //This means, we have a total sum of amount and if it does not exist then, we will have 0 as seen in the sql Query below.
    //this will be called "balance" from the transactions table where user_id is matching our endpoint "/:uerId"
    const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as balance FROM transactions 
        WHERE user_id = ${userId}
        `;

    //income + expense - amount > 0 = income but if it is an expense then amount < 0; Thats what we applied below
    const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as income FROM transactions 
        WHERE user_id = ${userId} AND amount > 0
        `;

    const expensesResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions 
        WHERE user_id = ${userId} AND amount < 0
        `;
    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    res.status(500).json({ Message: "Internal Server Error" });
  }
}
