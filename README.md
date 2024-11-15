# Car Management Application

A full-featured backend API built with Node.js, Express, MongoDB, and Mongoose for managing car collections. This application includes user authentication, car data management, and email-based OTP verification.

### Deployment
- **Application**: [https://mycarmanagement.netlify.app/](https://mycarmanagement.netlify.app/) (Since the backend is deployed on a free server, it may take some time while interacting with the backend).
- **Back End**: [https://car-management-backend-vquj.onrender.com](https://car-management-backend-vquj.onrender.com)
- **Front End GitHub Link**: [https://github.com/Venkat5452/Car-Management-FrontEnd](https://github.com/Venkat5452/Car-Management-FrontEnd)
- **Documentation** : [Download PDF](./Car-Management-Application.pdf)

## Features

- **User Authentication**: Register, log in, and reset passwords securely using hashed passwords and OTP-based verification.
- **Car Collection Management**: Add, view, update, and delete car entries.
- **OTP Email Verification**: Send OTPs for registration and password reset via email.
- **Image Limiting**: Limit the number of images per car entry to 10.

## Setup

### Prerequisites

- Node.js
- MongoDB
- A Gmail account (for sending OTP emails)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/car-management-app.git
   cd car-management-app
2. Install Dependencies:
   ```bash
   npm install
3. Set up environment variables: Create a .env file in the root directory and add:
   ```bash
   MYURL=your_mongodb_connection_string
   EMAIL=your_email_address
   PASSWORD=your_email_password
4. Start the server:
   ```bash
   node server.js

### The server will run on http://localhost:9040.

## Endpoints

### User Routes
- **POST** `/login`: Logs in a user with an email and password.
- **POST** `/signup`: Registers a new user with name, email, password, and OTP.
- **POST** `/verify-otp`: Verifies OTP during password reset.
- **POST** `/updatepassword`: Updates the user's password after OTP verification.
- **POST** `/makemail`: Sends OTP for registration.
- **POST** `/send-otp`: Sends OTP for password reset.

### Car Routes
- **POST** `/addcar`: Adds a new car entry with details like title, description, tags, and images.
- **GET** `/getallcars`: Retrieves all car entries.
- **GET** `/api/car/:id`: Retrieves details of a specific car by its ID.
- **DELETE** `/deletecar/:id`: Deletes a car entry by its ID.
- **PUT** `/update-car/:id`: Updates a car's details by its ID.

### Dependencies
- **Express**: Framework for building the server and handling routes.
- **Cors**: Allows handling cross-origin requests.
- **Mongoose**: Manages MongoDB connection and data models.
- **Nodemailer**: Used for sending OTP emails to users.
- **bcrypt**: Hashes passwords for secure storage.

 
