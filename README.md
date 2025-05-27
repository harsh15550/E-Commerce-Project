MERN E-Commerce Platform
This is a full-featured MERN stack E-Commerce platform that supports three distinct roles: Admin, Seller, and Buyer. Sellers can manage their own products — including adding, editing, deleting, and
viewing — along with advanced features like search, filter, viewing total sales, reviews, pending orders, and updating order status (Pending, Cancelled, Shipped). They can also respond to customer 
messages in real-time. Buyers can browse product details, add items to favorites, chat with sellers, purchase products, and leave reviews. They can also filter by category or price, view their orders,
and edit their profile.

The Admin has full control over the platform, managing users, orders, and products. Admins can also grant seller permissions — without admin approval, a seller cannot sell products. Buyers cannot access 
seller dashboards, ensuring proper role-based access. This system ensures a scalable, secure, and interactive E-Commerce experience with real-time communication and role-specific dashboards.

===========================

Technologys:-
Frontend :- React.js , MUI
Backend :- Node.js , Express.js
Database :- Mongodb Atlas
Realtime Communication :- Socket IO
Payment :- Stripe 

===========================

⚙️ Setup Instructions
1. Clone the Repository
   git clone https://github.com/harsh15550/E-Commerce-Project.git
   cd E-Commerce-Project
   
2. Install Dependencies
   I. cd backend
      npm install
   II. cd Frontend
      npm install
   III, cd Admin
      npm install

3. Run Project
   I. Backend
      npx nodemon
   II. Frontend
      npm run dev
   III. Admin
      npm run dev

4. 🔐 Environment Variables
    CLOUDINARY_NAME = 'YOUR CLOUDINATY NAME'
    CLOUDINARY_API_KEY = 'YOUR CLOUDINARY API SECRET'
    CLOUDINARY_API_SECRET = 'YOUR CLOUDINARY API SECRET'
    PORT = 3000
    STRIPE_SECRET_KEY = 'YOUR_SECRET_KEY'
    STRIPE_WEBHOOK_SECRET = 'YOUR WEBHOOK SECRET'
    CLIENT_URL = 'YOUR FRONTEND URL'
    secretKey = 'YOUR SECRET KEY'
    NODE_ENV=development
    MONGO_URL='YOUR MONGODB URL'

       
