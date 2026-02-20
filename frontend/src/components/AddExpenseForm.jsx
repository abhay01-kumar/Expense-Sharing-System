import { useState } from "react";

export default function AddExpenseForm({ members, onAdd, busy }) {
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!paidBy || !amount) return;
    onAdd({ paidBy, amount: Number(amount), description });
    setAmount("");
    setDescription("");
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Add Expense</h3>
      <div className="row">
        <select value={paidBy} onChange={(event) => setPaidBy(event.target.value)}>
          <option value="">Paid By</option>
          {members.map((member) => (
            <option key={member.id} value={member.name}>
              {member.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <button type="submit" disabled={busy || members.length === 0}>
        Add Expense
      </button>
    </form>
  );
}
