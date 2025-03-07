# 🏕️ Summer Sports School Camp - Backen

This is the backend API for the University Management System built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**. This API supports various operations for managing academic semesters, departments, course grades, and more.

---

## **Table of Contents**

- [Installation](#installation)
  
---

## **Installation**

To get started with the project locally, follow these steps:

### **1. Clone the repository**

```bash
git clone https://github.com/Md-Rijwan-Jannat/summer-sports-school-server.git
cd summer-sports-school-server
```

### **2. Install dependencies**
Ensure you have Node.js and Yarn installed, then run:

```bash
yarn install
```

### **3. Set up the environment variables**
Create a .env file at the root of the project and configure the following variables:

```bash

# Database
MONGODB_URI=<your_mongodb_uri>

# Server
PORT=5000

# JWT Secret
JWT_SECRET=<your_jwt_secret>

# Other settings
NODE_ENV=development
```
4. Run the server
```bash
yarn start
```
The API server will be up and running at http://localhost:5000.
