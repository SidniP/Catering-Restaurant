const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Create admin user if it doesn't exist
const createAdminUser = async () => {
    try {
        const adminUser = await User.findOne({ email: 'admin@admin.com' });
        if (!adminUser) {
            // Create admin user using the User model's pre-save hook for password hashing
            const user = await User.create({
                name: 'Admin',
                email: 'admin@admin.com',
                password: 'admin123',
                role: 'admin',
                phone: '+1234567890'
            });
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

createAdminUser();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5051;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
