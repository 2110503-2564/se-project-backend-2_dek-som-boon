const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Load env vars
dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://antony-massage.vercel.app/'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use(limiter);
app.use(hpp());
app.use(cookieParser());

const massageShops = require('./routes/massage-shops');
const auth = require('./routes/auth');
const reservations = require('./routes/reservations');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

app.use('/api/v1/massage-shops', massageShops);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log('Server running in', process.env.NODE_ENV, 'mode on port', PORT)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
