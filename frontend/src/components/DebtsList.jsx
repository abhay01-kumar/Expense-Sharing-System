export default function DebtsList({ debts, filter }) {
  const filtered = filter
    ? debts.filter((debt) => debt.from === filter || debt.to === filter)
    : debts;

  return (
    <div className="card">
      <h3>Debts</h3>
      {filtered.length === 0 ? (
        <p className="muted">No debts yet.</p>
      ) : (
        <ul className="list">
          {filtered.map((debt, index) => (
            <li key={`${debt.from}-${debt.to}-${index}`}>
              <span className="owes">{debt.from}</span> owes{" "}
              <span className="receives">{debt.to}</span>
              <span className="amount">₹{debt.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
