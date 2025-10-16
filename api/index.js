import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import Expense from './models/expense.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Use environment variables
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ Connect to MongoDB using dotenv value
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// ✅ Your routes
app.post("/expenses", async (req, res) => {
  try {
    const { type, account, category, amount, date, note, day } = req.body;

    const newExpense = new Expense({
      type,
      account,
      category,
      amount,
      date,
      note,
      day,
    });

    await newExpense.save();
    res.status(201).json({
      message: "Expense created successfully",
      expense: newExpense,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const { date } = req.query;
    const expenses = await Expense.find({ date });
    res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting expenses" });
  }
});

app.get("/allExpenses", async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting all expenses" });
  }
});
