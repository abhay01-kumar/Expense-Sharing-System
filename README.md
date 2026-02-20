# Minor Project #2 - Expense Sharing System

## Step-by-step setup
1. Open two terminals.
2. Backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`
3. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
4. Open `http://localhost:5173` in the browser.

## API Endpoints
- `POST /members` `{ "name": "Alice" }`
- `GET /members`
- `POST /expenses` `{ "paidBy": "Alice", "amount": 120, "description": "Dinner" }`
- `GET /expenses`
- `GET /debts`
- `GET /transactions`

## Notes
- Data is stored in `backend/data/db.json` using the file system.
- Debts are recalculated on every request to `/debts`.
