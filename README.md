# Astrology-Website

A professional full-stack application featuring a public-facing astrology services website and a robust, private business operations Content Management System (CMS).

## 🚀 Overview

The **Astrology-Website** is a dual-purpose platform:

1.  **Public Services Site:** An engaging, user-centric interface for clients to explore astrological insights, purchase crystal alignment packages, and access personalized services.
2.  **Business Operations CMS:** A highly secure, internal dashboard for staff to manage invoices, vendors, expenses, tasks, products, and website content, all while maintaining a real-time audit log.

---

## 🛠️ Technical Stack

### **Frontend**
*   **Framework:** [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
*   **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
*   **Icons:** [Lucide React](https://lucide.dev/)

### **Backend**
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express](https://expressjs.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Security:** [Helmet](https://helmetjs.github.io/), [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit), Custom CSRF protection, JWT-based authentication.
*   **Payments:** [Razorpay](https://razorpay.com/) integration with HMAC webhook verification.

### **Data & Infrastructure**
*   **Database:** Hybrid Facade Pattern:
    *   **Production:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
    *   **Development/Fallback:** Local JSON flat-file clusters.
*   **Testing:** [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

---

## ⚙️ Setup & Installation

### **Prerequisites**
*   Node.js (LTS recommended)
*   npm

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd Astrology-Website
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Configuration**

Create a `.env` file in the `server/` directory and a `.env.local` file in the `src/` directory.

#### **Backend (`server/.env`)**
```env
NODE_ENV=development
PORT=3001
ADMIN_EMAIL=your-admin@email.com
JWT_SECRET=your-ultra-secure-jwt-secret
COOKIE_SECRET=your-ultra-secure-cookie-secret

# Razorpay (Required for production)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Firebase (Required for production)
# Ensure your service account is correctly configured in your environment
```

#### **Frontend (`src/.env.local`)**
```env
VITE_API_URL=http://localhost:3001
# Add other Firebase configuration variables as needed
```

### **4. Running the Application**

To run both the backend and frontend in development mode:

**Start the Backend:**
```bash
# From the project root
cd server
npm run dev # (or use node app.js depending on your setup)
```

**Start the Frontend:**
```bash
# From the project root
npm run dev
```

---

## 📡 API Specification (Summary)

The backend provides a RESTful API with two main access levels:

### **Public Endpoints**
*   `GET /api/csrf-token` - Fetches CSRF token for state-changing requests.
*   `GET /api/products` - Lists all available products.
*   `GET /api/website/content` - Retrieves public website content.

### **Staff Endpoints (Requires JWT Authentication)**
*   **Auth:** `POST /api/auth/google-login`
*   **Invoices:** `GET`, `POST`, `PUT`, `DELETE` on `/api/invoices` (including batch operations).
*   **Vendors:** `GET`, `POST`, `PUT`, `DELETE` on `/api/vendors`.
*   **Expenses:** `GET`, `POST`, `PUT`, `DELETE` on `/api/expenses`.
*   **Tasks:** `GET`, `POST`, `PUT`, `DELETE` on `/api/tasks`.
*   **Astro Content:** `GET`, `POST`, `PUT`, `DELETE` on `/api/astro-content`.
*   **Website Management:** `GET`, `POST`, `PUT`, `DELETE` on `/api/website/...` and `/api/products`.
*   **Payments:** `POST /api/payments/razorpay/order` and the Razorpay webhook endpoint.
*   **Audit:** `GET /api/logs` and `GET /api/email-records`.

---

## 🧪 Testing & Quality Assurance

### **Running Tests**
```bash
npm test
```

### **Linting & Type-Checking**
```bash
npm run lint
npm run typecheck
```

## 🛡️ Security Best Practices
*   All state-changing requests require a valid CSRF token.
*   Sensitive endpoints are protected by rate limiting.
*   JWT is used for secure staff session management.
*   Razorpay webhooks are verified using HMAC signatures to prevent tampering.
