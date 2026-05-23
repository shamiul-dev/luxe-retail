# Luxe Retail

Luxe Retail is a modern, high-performance e-commerce platform built to deliver a premium shopping experience. It features a stunning customer-facing storefront and a comprehensive administrative dashboard for store management.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## ✨ Key Features

### Customer Storefront
- **Dynamic Product Catalog**: Browse products with advanced filtering (category, price, brand) and real-time search functionality.
- **Shopping Cart & Wishlist**: Persistent cart and wishlist management utilizing React Context and database synchronization.
- **Secure Checkout**: Seamless checkout flow handling shipping addresses and simulated payment processing.
- **User Accounts**: Customers can track order status, view their purchase history, and manage their profile and security settings securely.
- **Customer Care Hub**: Dedicated pages for Shipping Information, Returns & Exchanges, Privacy, Terms of Service, and Cookies.

### Admin Dashboard
- **Analytics Overview**: High-level metrics for total sales, active orders, revenue, and recent customer activity.
- **Order Management**: Comprehensive order tracking allowing administrators to view detailed order receipts, monitor shipping addresses, and dynamically update fulfillment statuses (Pending, Processing, Shipped, Delivered, Cancelled).
- **Product & Category Management**: Tools to view, edit, and update the catalog and its associated metadata.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd luxe-retail
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your database and authentication secrets:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/luxe_retail"
   BETTER_AUTH_SECRET="your-super-secret-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. Run Database Migrations:
   ```bash
   npm run db:push
   # OR
   npx drizzle-kit push
   ```

5. Start the Development Server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `/app`: Next.js App Router configuration (handles both `/(store)` and `/(admin)` routing groups).
- `/components`: Reusable UI components divided into layout, shop, admin, and generic UI elements.
- `/context`: React Context providers for global state management (Cart, Wishlist).
- `/db`: Database configuration, Drizzle schemas, and connection utilities.
- `/lib`: Helper functions, constants, auth configuration, and database queries.
- `/types`: TypeScript interfaces and type definitions.

## 📝 License

This project is licensed under the MIT License.


PS: Still in Development