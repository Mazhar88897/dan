# KYC (Stripe Identity) Setup

## Flow

1. **Frontend** (`/kyc`) → POST `/api/kyc/start` → gets `clientSecret` → opens Stripe Identity UI.
2. **API** `/api/kyc/start` → creates Stripe Verification Session (document + **selfie/face match**) → returns `clientSecret`.
3. **Webhook** Stripe sends `identity.verification_session.verified` to `/api/stripe/webhook` → Next.js calls your Express `/update-kyc`.
4. **Express** `/update-kyc` → updates user KYC status in your DB.

**Verification checks:** The session uses **document** + **require_matching_selfie**. Stripe collects the ID document and a live selfie, then compares the face to the ID photo. If they don’t match (wrong person), verification fails with `selfie_face_mismatch`. `require_live_capture` forces camera capture for the document (no file upload) to reduce fraud.

## Next.js env (e.g. `my-app/.env.local`)

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
EXPRESS_UPDATE_KYC_URL=http://localhost:4000/update-kyc
```

## Stripe Dashboard

- **Identity**: Enable Identity and complete setup.
- **Webhooks**: Add endpoint `https://your-domain.com/api/stripe/webhook`, event `identity.verification_session.verified`. Use the signing secret as `STRIPE_WEBHOOK_SECRET`.

## Express server (optional)

A minimal Express server is in `../server/`. Run it and set `EXPRESS_UPDATE_KYC_URL` to its `/update-kyc` URL:

```bash
cd server && npm install && node update-kyc.js
```

Replace the TODO in `server/update-kyc.js` with your DB update (e.g. Sequelize `users.update({ kycStatus }, { where: { id: userId } })`).

---

## How to test KYC

### 1. Env checklist

In `my-app/.env.local` (or `.env`):

- `STRIPE_SECRET_KEY=sk_test_...`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...` (must have `NEXT_PUBLIC_` for the KYC page)
- `STRIPE_WEBHOOK_SECRET=whsec_...` (only needed when testing the webhook; see step 4)

Restart the dev server after changing env.

### 2. Enable Stripe Identity (test mode)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → ensure you’re in **Test mode** (toggle top-right).
2. Go to **Identity** (or search “Identity” in the dashboard).
3. Complete Stripe’s Identity setup (form/activation). In test mode you can use test data.

### 3. Run the app and open the KYC page

```bash
cd my-app
npm run dev
```

1. Open **http://localhost:3000/kyc**.
2. Click **“Start verification”**.
3. The Stripe Identity modal should open (document upload flow).
4. Use Stripe’s **test documents**:
   - In the Identity modal, Stripe often shows a “Use test document” or similar option in test mode, or use any sample ID image they provide for testing.
   - You can also upload a test image (e.g. a clear photo of any ID-sized document) and complete the flow; in test mode Stripe may accept it or show expected test behavior.

If the modal doesn’t open, check the browser console and Network tab (e.g. errors from `/api/kyc/start` or missing `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).

### 4. Test the webhook (optional)

Stripe can’t reach `http://localhost:3000` from the internet. To test the webhook locally:

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Log in and forward webhooks to your app:

   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. The CLI prints a **webhook signing secret** (e.g. `whsec_...`). Put it in `.env.local` as `STRIPE_WEBHOOK_SECRET` and restart the dev server.
4. Run through the KYC flow again; after verification, the CLI will forward `identity.verification_session.verified` to your app. Check your Next.js logs and (if running) the Express `/update-kyc` server.

### 5. Test end-to-end with Express (optional)

1. Start the Express server: `cd server && npm install && node update-kyc.js`.
2. In `my-app/.env.local` set `EXPRESS_UPDATE_KYC_URL=http://localhost:4000/update-kyc`.
3. Complete the KYC flow; when the webhook fires, Next.js will call Express. Check the Express terminal for the `[update-kyc]` log.
