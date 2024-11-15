# Car Management Application

A full-featured backend API built with Node.js, Express, MongoDB, and Mongoose for managing car collections. This application includes user authentication, car data management, and email-based OTP verification.

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

 
