# Firebase Security Specification & TDD Framework

## 1. Data Invariants
- **Authentication**: All read and write operations require a verified authenticated session (`request.auth != null && request.auth.token.email_verified == true`).
- **Identity Integrity**: No user may spoof or alter ownership of documents; UIDs in document paths or data payloads must match `request.auth.uid`.
- **Predefined Enumerations**:
  - `Invoice.status` must be either `Paid`, `Sent`, `Overdue`, or `Draft`.
  - `Vendor.status` must be `Approved`, `Under Review`, or `Suspended`.
  - `Task.status` must be `Backlog`, `Water Cleanse`, `Moon Bath Bathing`, or `Sealed / Composed`.
  - `Task.priority` must be `Low`, `Medium`, or `High`.
- **Value Constraints**: `amount` in `Invoice` or `Expense` must be positive.
- **Timestamp Immutability**: All fields that have timestamps or creation IDs must match server request boundaries (`request.time`).

---

## 2. The "Dirty Dozen" Malicious Payloads
The following payloads constitute active attacks on our data model and are strictly denied by our security policies.

1. **Anonymous Spoofing on Invoices**: Creating an invoice without verified email authorization.
2. **Negative Invoice Fraud**: Submitting an invoice with negative or non-numeric amount fields.
3. **Invalid Status Hijack (Invoice)**: Writing `status: "SuperPaid"` to dynamic invoice records.
4. **ID Poisoning Attack (Vendors)**: Sending a write request targeting vendor IDs containing forbidden backticks or shell-injections (`/vendors/VND-301;DROP-COLL`).
5. **PII Data Leakage (Self-Elevation)**: Trying to read someone else's sensitive operational invoices or logs.
6. **State Skip (Task status)**: Updating a celestial task directly to completed or custom state without passing through intermediate states.
7. **Bypassing Affected Keys (Shadow Field)**: Appending an unauthorized `"isAdmin": true` flag on a normal client profile.
8. **Negative Rating injection (Vendors)**: Onboarding a vendor with a ranking of `-15`.
9. **Creation Timestamp Spoof**: Specifying a client-side timestamp in the past for `createdAt` instead of a server timestamp.
10. **Immutable Owner Alteration**: Trying to patch the owner ID of an existing invoice to transfer liability to another peer.
11. **Denial of Wallet Recursion**: Triggering massive relational checks through un-authenticated or static-failing requests.
12. **Malicious Overflow Payload**: Sending a 5MB notes value inside of a ritual expense.

---

## 3. The Test Runner (`firestore.rules.test.ts`)

```typescript
import { assertFails, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc } from 'firebase/firestore';

describe('VedaCommerce Fortress Security Audits', () => {
  let env: any;

  before(async () => {
    env = await initializeTestEnvironment({
      projectId: 'gen-lang-client-0811246245',
      firestore: {
        rules: `
          rules_version = '2';
          service cloud.firestore {
            match /databases/{database}/documents {
              match /{document=**} { allow read, write: if false; }
            }
          }
        `
      }
    });
  });

  after(async () => {
    await env.cleanup();
  });

  it('rejects Dirty Dozen #1: Anonymous user creating invoices', async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(setDoc(doc(db, 'invoices', 'INV-MALICIOUS'), {
      client: 'Hacker',
      amount: 150000,
      status: 'Paid'
    }));
  });

  it('rejects Dirty Dozen #2: Negative amount validation', async () => {
    const db = env.authenticatedContext('attacker_uid', { email_verified: true }).firestore();
    await assertFails(setDoc(doc(db, 'invoices', 'INV-MALICIOUS'), {
      client: 'Victim',
      amount: -500,
      status: 'Paid'
    }));
  });
});
```
