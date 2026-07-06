/*
# CASH MONEY — Core Schema

## Overview
Creates the full schema for the CASH MONEY investment platform: profiles,
wallets, deposits, withdrawals, investments, claims, referrals, transactions,
notifications, and admin-configurable settings.

## New Tables
1. `profiles` — extends auth.users with phone, name, role (user/admin), referral data.
2. `wallets` — per-user wallet balances (main, pending, referral, withdrawable).
3. `deposits` — manual bank transfer deposits with receipt + admin approval.
4. `withdrawals` — withdrawal requests with bank details + admin approval.
5. `investments` — user investments (plan, amount, daily, 120-day duration).
6. `claims` — daily earnings claims (once per 24h per investment).
7. `transactions` — unified ledger of all money movements.
8. `referrals` — referral relationships and bonus earnings.
9. `notifications` — user-facing notifications.
10. `settings` — key/value admin-configurable platform settings.

## Security
- RLS enabled on every table.
- Owner-scoped CRUD for user tables (auth.uid() = user_id).
- Admin role can read all via a helper check.
- Settings table readable by all authenticated users (config is shared).
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  referral_code text UNIQUE DEFAULT upper(substr(encode(gen_random_bytes(6),'hex'),1,8)),
  referred_by uuid REFERENCES profiles(id),
  avatar_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- WALLETS
CREATE TABLE IF NOT EXISTS wallets (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  balance numeric NOT NULL DEFAULT 0,
  pending numeric NOT NULL DEFAULT 0,
  referral_earnings numeric NOT NULL DEFAULT 0,
  today_earnings numeric NOT NULL DEFAULT 0,
  withdrawable numeric NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wallet" ON wallets;
CREATE POLICY "select_own_wallet" ON wallets FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wallet" ON wallets;
CREATE POLICY "insert_own_wallet" ON wallets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_wallet" ON wallets;
CREATE POLICY "update_own_wallet" ON wallets FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DEPOSITS
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reference text UNIQUE NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 5000),
  receipt_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_deposits" ON deposits;
CREATE POLICY "select_own_deposits" ON deposits FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "insert_own_deposits" ON deposits;
CREATE POLICY "insert_own_deposits" ON deposits FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_deposits" ON deposits;
CREATE POLICY "update_own_deposits" ON deposits FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- WITHDRAWALS
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reference text UNIQUE NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 1000),
  bank_name text NOT NULL,
  account_number text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_withdrawals" ON withdrawals;
CREATE POLICY "select_own_withdrawals" ON withdrawals FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "insert_own_withdrawals" ON withdrawals;
CREATE POLICY "insert_own_withdrawals" ON withdrawals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_withdrawals" ON withdrawals;
CREATE POLICY "update_own_withdrawals" ON withdrawals FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- INVESTMENTS
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  amount numeric NOT NULL,
  daily_rate numeric NOT NULL DEFAULT 10,
  duration_days int NOT NULL DEFAULT 120,
  days_elapsed int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_investments" ON investments;
CREATE POLICY "select_own_investments" ON investments FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "insert_own_investments" ON investments;
CREATE POLICY "insert_own_investments" ON investments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_investments" ON investments;
CREATE POLICY "update_own_investments" ON investments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- CLAIMS
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  investment_id uuid NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_claims" ON claims;
CREATE POLICY "select_own_claims" ON claims FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "insert_own_claims" ON claims;
CREATE POLICY "insert_own_claims" ON claims FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit','withdrawal','claim','referral','investment')),
  amount numeric NOT NULL,
  direction text NOT NULL CHECK (direction IN ('credit','debit')),
  reference text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_transactions" ON transactions;
CREATE POLICY "select_own_transactions" ON transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "insert_own_transactions" ON transactions;
CREATE POLICY "insert_own_transactions" ON transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- REFERRALS
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bonus_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_referrals" ON referrals;
CREATE POLICY "select_own_referrals" ON referrals FOR SELECT
  TO authenticated USING (auth.uid() = referrer_id OR auth.uid() = referred_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SETTINGS (admin-configurable, readable by all authenticated)
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_settings" ON settings;
CREATE POLICY "select_settings" ON settings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "update_settings" ON settings;
CREATE POLICY "update_settings" ON settings FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "insert_settings" ON settings;
CREATE POLICY "insert_settings" ON settings FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Seed default settings
INSERT INTO settings (key, value) VALUES
  ('daily_return', '10'),
  ('duration_days', '120'),
  ('min_deposit', '5000'),
  ('min_withdrawal', '1000'),
  ('withdraw_start', '09:00'),
  ('withdraw_end', '12:00'),
  ('referral_bonus', '10'),
  ('bank_name', 'Moniepoint'),
  ('account_name', 'Bukar Dauda'),
  ('account_number', '5005723997'),
  ('site_name', 'CASH MONEY'),
  ('tagline', 'Invest • Earn • Grow')
ON CONFLICT (key) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_user ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
