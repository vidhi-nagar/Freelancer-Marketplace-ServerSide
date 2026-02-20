# Freelancer Market – Server Side

This is the backend (server side) of the Freelancer Market web application.  
It handles authentication, APIs, database operations, and business logic.

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- dotenv

## 📂 Project Structure

server/
├── controllers/
├── routes/
├── models/
├── utils/
├── middleware/
├── config/
└── index.js

## ⚙️ Installation & Setup

1. Clone the repository:

   git clone https://github.com/vidhi-nagar/Freelancer-Marketplace-ServerSide.git

2. Navigate to the folder:

   cd Freelancer-Marketplace-ServerSide

3. Install dependencies:

   npm install

4. Create a `.env` file in root and add:

   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key

5. Start the server:

   npm run dev
   or
   node index.js

Server will run on:
http://localhost:5000

## 🔐 Features

- User Authentication (Register / Login)
- JWT Based Authorization
- Protected Routes
- Project & Freelancer APIs
- MongoDB Database Integration

## 🌍 Environment Variables

Make sure `.env` file is NOT pushed to GitHub.

## 👩‍💻 Author

Vidhi  
Aspiring MERN Stack Developer
