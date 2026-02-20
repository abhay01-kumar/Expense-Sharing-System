function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateDebts(members, expenses) {
  if (!members.length) {
    return [];
  }

  const balances = new Map();
  for (const member of members) {
    balances.set(member.name, 0);
  }

  for (const expense of expenses) {
    const split = expense.amount / members.length;
    for (const member of members) {
      const current = balances.get(member.name) ?? 0;
      balances.set(member.name, round2(current - split));
    }
    const payerBalance = balances.get(expense.paidBy) ?? 0;
    balances.set(expense.paidBy, round2(payerBalance + expense.amount));
  }

  const creditors = [];
  const debtors = [];

  for (const [name, balance] of balances.entries()) {
    if (balance > 0) creditors.push({ name, amount: balance });
    if (balance < 0) debtors.push({ name, amount: -balance });
  }

  const debts = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    debts.push({
      from: debtor.name,
      to: creditor.name,
      amount: round2(amount)
    });

    debtor.amount = round2(debtor.amount - amount);
    creditor.amount = round2(creditor.amount - amount);

    if (debtor.amount === 0) i += 1;
    if (creditor.amount === 0) j += 1;
  }

  return debts;
}
