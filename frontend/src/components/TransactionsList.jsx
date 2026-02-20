export default function TransactionsList({ transactions }) {
  return (
    <div className="card">
      <h3>Transactions</h3>
      {transactions.length === 0 ? (
        <p className="muted">No transactions yet.</p>
      ) : (
        <ul className="list">
          {transactions.map((tx) => (
            <li key={tx.id}>
              <div className="tx-main">
                <strong>{tx.paidBy}</strong> paid ₹{tx.amount.toFixed(2)}
              </div>
              <div className="muted">
                {tx.description || "No description"} • {new Date(tx.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
