import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import { readDB, writeDB } from "./utils/storage.js";
import { calculateDebts } from "./utils/calc.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/members", async (req, res) => {
  const db = await readDB();
  res.json(db.members);
});

app.delete("/members/:id", async (req, res) => {
  const { id } = req.params;
  const db = await readDB();
  const member = db.members.find((item) => item.id === id);
  if (!member) {
    return res.status(404).json({ error: "Member not found." });
  }

  db.members = db.members.filter((item) => item.id !== id);
  db.expenses = db.expenses.filter((expense) => expense.paidBy !== member.name);
  await writeDB(db);
  res.json({ deleted: true });
});

app.post("/members", async (req, res) => {
  const { name } = req.body || {};
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Name is required." });
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return res.status(400).json({ error: "Name is required." });
  }

  const db = await readDB();
  const exists = db.members.some((member) => member.name.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: "Member already exists." });
  }

  const newMember = { id: nanoid(), name: trimmed };
  db.members.push(newMember);
  await writeDB(db);
  res.status(201).json(newMember);
});

app.get("/expenses", async (req, res) => {
  const db = await readDB();
  res.json(db.expenses);
});

app.post("/expenses", async (req, res) => {
  const { paidBy, amount, description } = req.body || {};
  if (!paidBy || typeof paidBy !== "string") {
    return res.status(400).json({ error: "Paid By is required." });
  }
  const numericAmount = Number(amount);
  if (!numericAmount || numericAmount <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number." });
  }

  const db = await readDB();
  const payerExists = db.members.some((member) => member.name === paidBy);
  if (!payerExists) {
    return res.status(400).json({ error: "Paid By must be a valid member." });
  }

  if (db.members.length === 0) {
    return res.status(400).json({ error: "Add members before expenses." });
  }

  const expense = {
    id: nanoid(),
    paidBy,
    amount: Number(numericAmount.toFixed(2)),
    description: typeof description === "string" ? description.trim() : "",
    createdAt: new Date().toISOString()
  };

  db.expenses.push(expense);
  await writeDB(db);
  res.status(201).json(expense);
});

app.get("/debts", async (req, res) => {
  const db = await readDB();
  const debts = calculateDebts(db.members, db.expenses);
  res.json(debts);
});

app.get("/transactions", async (req, res) => {
  const db = await readDB();
  res.json(db.expenses);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
