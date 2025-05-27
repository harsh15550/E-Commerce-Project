# MERN E-Commerce Platform

This is a full-featured MERN stack E-Commerce platform that supports three distinct roles: Admin, Seller, and Buyer. Sellers can manage their own products — including adding, editing, deleting, and
viewing — along with advanced features like search, filter, viewing total sales, reviews, pending orders, and updating order status (Pending, Cancelled, Shipped). They can also respond to customer 
messages in real-time. Buyers can browse product details, add items to favorites, chat with sellers, purchase products, and leave reviews. They can also filter by category or price, view their orders,
and edit their profile.

The Admin has full control over the platform, managing users, orders, and products. Admins can also grant seller permissions — without admin approval, a seller cannot sell products. Buyers cannot access 
seller dashboards, ensuring proper role-based access. This system ensures a scalable, secure, and interactive E-Commerce experience with real-time communication and role-specific dashboards.

===========================

## Technologies
- **Frontend:** React.js, MUI  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Realtime Communication:** Socket.IO  
- **Payment:** Stripe


===========================

⚙️ Setup Instructions
# 1. Clone the Repository
   git clone https://github.com/harsh15550/E-Commerce-Project.git
   cd E-Commerce-Project
   
## 📦 Install Dependencies
- `cd backend` → `npm install`  
- `cd frontend` → `npm install`  
- `cd admin` → `npm install`  

---

## 🚀 Run the Project
- **Backend:**  
  `cd backend` → `npx nodemon`
- **Frontend:**  
  `cd frontend` → `npm run dev`
- **Admin:**  
  `cd admin` → `npm run dev`

---

## 🔐 Environment Variables (`.env` in backend folder)

```env
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLIENT_URL=your_frontend_url
secretKey=your_jwt_secret_key
NODE_ENV=development
MONGO_URL=your_mongodb_url
```

# 5 📁 Folder Structure
   E-Commerce-Project/
   │
   ├── backend/        # Express backend, API routes, DB models
   ├── frontend/       # Main customer-facing frontend
   ├── admin/          # Admin dashboard
   └── README.md

       
