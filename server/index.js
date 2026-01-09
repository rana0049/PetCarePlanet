const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const listingRoutes = require('./routes/listingRoutes');
const messageRoutes = require('./routes/messageRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to Database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Restrict to client origin
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/market', listingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

