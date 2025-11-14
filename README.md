# Library Management System (Simple)

A minimal full‑stack app with role‑based login (admin/user), maintenance, transactions, and reports.

- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Frontend: React + Vite

## Quick start (Windows PowerShell)

1. Backend

```powershell
# 1) Install deps
cd backend; npm install

# 2) Copy env
Copy-Item .env.example .env -Force
# Update .env if needed (MongoDB URI / port)

# 3) Start API
npm run dev
```

2. Seed the default admin in another terminal (once):

Use an HTTP client (Postman/Thunder/VS Code REST) to POST:
- URL: http://localhost:4000/api/auth/seed-admin

Admin credentials created:
- Email: admin@lib.local
- Password: admin

3. Frontend

```powershell
cd ..\frontend; npm install
Copy-Item .env.example .env -Force
npm run dev
```

Then open the printed local URL. Log in as admin or create users from Maintenance > User Management.

## Roles
- Admin: Maintenance, Reports, Transactions
- User: Reports, Transactions

## Notes on validations
- "Check availability" requires a query; search results table includes a radio button per row.
- Issue: book name auto-populates from serial; issue date >= today; return date <= +15 days; remarks optional.
- Return: populates fine on confirm; then complete in Pay Fine (Fine Paid checkbox required when fine > 0).
- Membership: Add requires all fields; Update supports extend/cancel; default choices already selected in UI.
- Add/Update Book: requires all fields; default type is Book.
- User Management: default mode is New, Name is mandatory; checkboxes map to Active/Admin.

## API overview
- POST /api/auth/login
- POST /api/auth/seed-admin
- POST /api/users (admin)
- GET /api/books?q=...
- POST /api/books (admin) { mode: 'add'|'update', ... }
- POST /api/transactions/issue
- POST /api/transactions/return
- POST /api/transactions/pay-fine
- POST /api/memberships (admin)
- PUT /api/memberships/:id (admin)
- GET /api/reports/books|movies|memberships|active-issues|overdue-returns

This is a starter implementation intended to be easy to read and extend.
