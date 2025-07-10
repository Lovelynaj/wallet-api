import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSummaryByUserId);

router.post("/", createTransaction);

export default router;
