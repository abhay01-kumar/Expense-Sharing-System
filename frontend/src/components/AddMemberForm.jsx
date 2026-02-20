import { useState } from "react";

export default function AddMemberForm({ onAdd, busy }) {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Add Member</h3>
      <div className="row">
        <input
          type="text"
          placeholder="Member name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit" disabled={busy}>
          Add
        </button>
      </div>
    </form>
  );
}
