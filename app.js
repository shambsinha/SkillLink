require('dotenv').config();
const express = require('express');
const app = express();
const mongodb = require('mongodb');
const client = mongodb.MongoClient;
const session = require('express-session');
const path = require('path');
const nodemailer = require('nodemailer');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const otpRoutes = require('./routes/otp');
const bookingRoutes = require('./routes/booking');
const taskerRoute = require('./routes/tasker');
const profileRoute = require('./routes/profile');
const taskerPanelRoute = require('./routes/tasker-panel');
// const { error } = require('console');

// Middleware for serving static files
app.use(express.static('public'));
app.use(express.static('routes'));
app.use('/image', express.static('image'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

let dbinstance;

// Middleware for sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Middleware to attach user to res.locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Connect to MongoDB
client.connect(process.env.mongourl)
  .then((database) => {
    console.log('Connected to MongoDB');
    dbinstance = database.db('SkillLink');
    app.locals.db = dbinstance; // Make dbinstance available in routes
  })
  .catch((e) => {
    console.log('MongoDB Connection Error: ', e);
  });

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify Nodemailer configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Error configuring Nodemailer: ', error);
  } else {
    console.log('Nodemailer is ready to send emails');
    app.locals.transporter = transporter; // Make transporter available in routes
  }
});

// Use routes
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/otp', otpRoutes);
app.use('/booking', bookingRoutes);
app.use('/tasker',taskerRoute);
app.use('/profile',profileRoute);
app.use('/tasker-panel',taskerPanelRoute);

// Booking
app.get('/submit-booking', (req, res) => {
  res.send('Booked')
});

// Handle booking form submission
app.post('/submit-booking', async (req, res) => {
  try {
    console.log(req.body)

      const { name, address, zip, state, phone, workType } = req.body;

      dbinstance.collection('bookingDetails').insertOne({
        name,
        workType,
        address,
        zip,
        state,
        phone,
        
      }).then((e)=>{
        console.log(e);
      }).catch((e)=>{
        console.log(e);
      })
  
dbinstance.collection('tasker').find({ zip: zip,workArea:workType }).toArray().then(data=>{
 
 console.log(data);
 
  res.render('bookingForms/available_tasker',{data:data})

}).catch((e)=>{
  console.log(e);
})





    await dbinstance.collection('bookingDetails').insertOne({
      name,
      workArea,
      address,
      zip,
      state,
      phone
    });

    const data = await dbinstance.collection('tasker').find({ zip: zip }).toArray();
    res.render('bookingForms/available_tasker', { data: data });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(5050, (err) => {
  if (err) console.log(err);
  else console.log('Server running on port 5050');
});