const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const {xss}=require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Library API',
        version: '1.0.0',
        description: 'A simple Express DekSomBoonMassage API',
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',  // This sets up the "Authorize" button for JWT
        },
      },
      servers: [
        {
          url: 'https://antony-massage-backend-production.up.railway.app/api/v1'
        },
        {
            url: 'http://localhost:5000/api/v1'
        }
      ],

    },
    apis: ['./routes/*.js'],
  };
  
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


const massageShops = require('./routes/massage-shops');
const auth = require('./routes/auth');
const reservations = require('./routes/reservations');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const therapist = require('./routes/therapists');
app.use(express.json());

app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

const limiter=rateLimit({
    windowsMs:10*60*1000,
    max: 100
});
app.use(limiter);
app.use(hpp());
app.use(cors());
app.use(cookieParser());

app.use('/api/v1/massage-shops', massageShops);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/therapists', therapist);
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in', process.env.NODE_ENV, 'mode on port', PORT));


process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})

