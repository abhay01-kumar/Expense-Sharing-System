import { useEffect, useState } from "react";
import {
  addExpense,
  addMember,
  deleteMember,
  fetchDebts,
  fetchMembers,
  fetchTransactions
} from "./api.js";
import AddExpenseForm from "./components/AddExpenseForm.jsx";
import AddMemberForm from "./components/AddMemberForm.jsx";
import DebtsList from "./components/DebtsList.jsx";
import TransactionsList from "./components/TransactionsList.jsx";

export default function App() {
  const [members, setMembers] = useState([]);
  const [debts, setDebts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadAll = async () => {
    const [membersData, debtsData, transactionsData] = await Promise.all([
      fetchMembers(),
      fetchDebts(),
      fetchTransactions()
    ]);
    setMembers(membersData);
    setDebts(debtsData);
    setTransactions(transactionsData);
  };

  useEffect(() => {
    loadAll().catch((error) => setMessage(error.message));
  }, []);

  const handleAddMember = async (name) => {
    try {
      setBusy(true);
      setMessage("");
      await addMember(name);
      await loadAll();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleAddExpense = async (payload) => {
    try {
      setBusy(true);
      setMessage("");
      await addExpense(payload);
      await loadAll();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteMember = async (memberId, memberName) => {
    const confirmed = window.confirm(`Delete ${memberName}? This also removes their expenses.`);
    if (!confirmed) return;
    try {
      setBusy(true);
      setMessage("");
      await deleteMember(memberId);
      await loadAll();
      if (filter === memberName) setFilter("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <h1>Expense Sharing System</h1>
        <p>Track shared expenses and see who owes whom.</p>
      </header>

      {message ? <div className="alert">{message}</div> : null}

      <section className="grid">
        <AddMemberForm onAdd={handleAddMember} busy={busy} />
        <AddExpenseForm members={members} onAdd={handleAddExpense} busy={busy} />
      </section>

      <section className="card">
        <h3>Members</h3>
        {members.length === 0 ? (
          <p className="muted">Add members to get started.</p>
        ) : (
          <ul className="list">
            {members.map((member) => (
              <li key={member.id} className="member-item">
                <span>{member.name}</span>
                <button
                  type="button"
                  className="danger"
                  onClick={() => handleDeleteMember(member.id, member.name)}
                  disabled={busy}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h3>Filter Debts</h3>
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="">All members</option>
          {members.map((member) => (
            <option key={member.id} value={member.name}>
              {member.name}
            </option>
          ))}
        </select>
      </section>

      <section className="grid">
        <DebtsList debts={debts} filter={filter} />
        <TransactionsList transactions={transactions} />
      </section>
    </div>
  );
}
