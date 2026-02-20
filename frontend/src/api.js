const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function handle(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Request failed");
  }
  return res.json();
}

export async function fetchMembers() {
  return handle(await fetch(`${API_BASE}/members`));
}

export async function addMember(name) {
  return handle(
    await fetch(`${API_BASE}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
  );
}

export async function deleteMember(id) {
  return handle(
    await fetch(`${API_BASE}/members/${id}`, {
      method: "DELETE"
    })
  );
}

export async function fetchExpenses() {
  return handle(await fetch(`${API_BASE}/expenses`));
}

export async function addExpense(payload) {
  return handle(
    await fetch(`${API_BASE}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
  );
}

export async function fetchDebts() {
  return handle(await fetch(`${API_BASE}/debts`));
}

export async function fetchTransactions() {
  return handle(await fetch(`${API_BASE}/transactions`));
}
