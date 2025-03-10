# Catering Restaurant Management System

A full-stack web application for managing catering events, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication (Admin, Staff, and Regular Users)
- Event Management
  - Create new events
  - View event details
  - Update event status
  - Filter events by status
- Staff Portal
  - View all events
  - Confirm/cancel events
  - Mark events as completed
- Responsive Design
- Form Validation
- Secure Password Handling
- JWT Authentication

## Tech Stack

### Frontend
- React.js
- React Router
- Bootstrap
- Axios for API calls
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SidniP/Catering-Restaurant.git
cd Catering-Restaurant
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5051
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:5173`

## Default Admin Account

- Email: admin@admin.com
- Password: admin123

## API Endpoints

### Authentication
- POST /api/users - Register new user
- POST /api/users/login - Login user
- GET /api/users/profile - Get user profile

### Events
- GET /api/events - Get all events (staff only)
- POST /api/events - Create new event
- PUT /api/events/:id - Update event status (staff only)
- GET /api/events/:id - Get event details

## Project Structure

```
Catering-Restaurant/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Author

- **Sidni Pazaj** - [SidniP](https://github.com/SidniP)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 