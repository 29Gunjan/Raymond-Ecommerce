# Raymond E-Commerce

A premium men's fashion e-commerce platform built with React, Node.js, and PostgreSQL. Features a modern UI, Razorpay payment integration, and comprehensive admin dashboard.

![Raymond Store](https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=400&fit=crop)

## ✨ Features

### Customer Features
- 🛍️ **Product Browsing** - Browse suits, shirts, trousers, ethnic wear, and accessories
- 🔍 **Search & Filter** - Find products by category, price, size, and color
- 🛒 **Shopping Cart** - Add/remove items, update quantities
- ❤️ **Wishlist** - Save favorite products for later
- 💳 **Razorpay Payments** - Secure online payments (UPI, Cards, Net Banking)
- 💵 **Cash on Delivery** - Pay when you receive
- 📦 **Order Tracking** - Track order status in real-time
- ⭐ **Product Reviews** - Rate and review purchased products
- 👤 **User Profile** - Manage addresses, view order history
- 🔐 **Authentication** - Email/password and Google OAuth login

### Admin Features
- 📊 **Dashboard** - Sales analytics and statistics
- 📦 **Product Management** - Add, edit, delete products with variants
- 📋 **Order Management** - View and update order status
- 👥 **User Management** - View users, manage roles
- 🏷️ **Category Management** - Organize products by category

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router 6** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - API calls
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Razorpay** - Payment gateway
- **Nodemailer** - Email notifications

## 📁 Project Structure

```
raymond-ecommerce/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Seed data
│   ├── src/
│   │   ├── index.js         # Express app entry
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # API routes
│   │   └── utils/           # Helper functions
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth, Cart)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service
│   │   └── styles/          # Global styles
│   ├── index.html
│   └── package.json
├── docker-compose.dev.yml   # Development database
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop (for PostgreSQL)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/29Gunjan/Raymond-Ecommerce.git
   cd Raymond-Ecommerce
   ```

2. **Start PostgreSQL database**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file (see Environment Variables section)
   
   # Generate Prisma client and push schema
   npx prisma generate
   npx prisma db push
   
   # Seed database with sample data
   npm run prisma:seed
   
   # Start development server
   npm run dev
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## ⚙️ Environment Variables

Create `backend/.env` with:

```env
# Database
DATABASE_URL="postgresql://raymond:raymond123@localhost:5432/raymond_ecommerce?schema=public"

# Server
PORT=5000

# JWT
JWT_SECRET="your-super-secret-key"

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Raymond Store

# Razorpay (get from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=
```

## 👤 Test Accounts

| Role  | Email              | Password  |
|-------|-------------------|-----------|
| Admin | admin@raymond.com | admin123  |
| User  | user@example.com  | user123   |

## 💳 Test Payment (Razorpay)

Use these test credentials in Razorpay checkout:

| Field   | Value               |
|---------|---------------------|
| Card    | 4111 1111 1111 1111 |
| Expiry  | Any future date     |
| CVV     | Any 3 digits        |
| OTP     | 1234                |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:slug` | Get product by slug |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/item/:id` | Update cart item |
| DELETE | `/api/cart/item/:id` | Remove cart item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/:id` | Get order details |
| POST | `/api/orders` | Create order (COD) |
| POST | `/api/orders/track` | Track order |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payment/key` | Get Razorpay key |
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/products` | Get all products |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| GET | `/api/admin/orders` | Get all orders |
| PUT | `/api/admin/orders/:id/status` | Update order status |

## 🚢 Deployment

### Option 1: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway add --plugin postgresql
railway up
```

### Option 2: Vercel + Railway
- **Frontend**: Deploy to Vercel
- **Backend + DB**: Deploy to Railway

### Option 3: Docker
```bash
docker compose up -d
```

## 📸 Screenshots

### Home Page
![Home](https://via.placeholder.com/800x400?text=Home+Page)

### Product Listing
![Products](https://via.placeholder.com/800x400?text=Products+Page)

### Checkout with Razorpay
![Checkout](https://via.placeholder.com/800x400?text=Checkout+Page)

### Admin Dashboard
![Admin](https://via.placeholder.com/800x400?text=Admin+Dashboard)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Gunjan**
- GitHub: [@29Gunjan](https://github.com/29Gunjan)

---

⭐ Star this repository if you found it helpful!
