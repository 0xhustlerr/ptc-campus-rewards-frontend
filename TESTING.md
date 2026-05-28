# Frontend API integration — test notes

Prerequisites:

- Backend running at `http://localhost:8000` with seeded users
- `frontend/.env.local` copied from `.env.local.example`

## Automated checks

```bash
cd frontend
npm run build
```

## Manual test checklist

### Login

- [ ] **Success**: Valid email/password redirects to role dashboard (`/student/wallet`, `/staff/rewards`, etc.)
- [ ] **Failure**: Invalid credentials show a clear message (no stack trace)

### Student wallet

- [ ] Wallet balance loads from `GET /wallets/me` and `GET /students/me`
- [ ] Transactions list matches ledger data
- [ ] Rewards catalog loads from `GET /rewards/catalog`

### QR session

- [ ] QR card loads token from `POST /wallets/me/qr-session` (not raw student ID)
- [ ] Countdown decreases; expired state shows “QR expired — refresh to redeem.”
- [ ] **Refresh QR** fetches a new session

### Staff issue reward

- [ ] Student search uses `GET /staff/students`
- [ ] Submit calls `POST /staff/issue-reward` with `idempotency_key`
- [ ] Double-click does not double-issue (button disabled while submitting)
- [ ] Validation errors surface in the form

### Vendor redemption

- [ ] Paste QR token → `POST /vendor/scan` shows student name and balance
- [ ] Redeem calls `POST /vendor/redeem`; receipt shows previous balance, amount, new balance
- [ ] Insufficient balance shows a friendly error (no raw API dump)

### Admin

- [ ] Overview metrics from `GET /admin/reports/overview`
- [ ] Reports page charts from earned-by-rule, redeemed-by-category, token-velocity, top-students
- [ ] Audit logs load from `GET /admin/audit-logs`

### Route protection

- [ ] Unauthenticated visit to `/student/wallet` → `/login`
- [ ] Student cannot access `/admin` → `/unauthorized`
