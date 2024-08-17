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
const { log } = require('console');
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

//Middleware for checking login
function checkLoggedIn(req, res, next) {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    next();
  }
}



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




// //tasker schedule
// app.get('/tasker-schedule/:id', (req, res) => {
//   let id = req.params.id;
//   dbinstance.collection('appointments').find({id}).toArray().then(data=>{
//     console.log(data);
//     res.render('tasker-schedule',{data})

//   }).catch(e=>{
//     console.log(e);
//   })
// });

//booking
app.get('/book-appointment/:id', (req, res) => {
  let id = req.params.id;
  console.log(id);
  res.render('bookingForms/book_appointment',{id:id})
});

app.post('/book-appointment', (req,res)=>{
  const { id, name,email,work, address, zip, state, phone } = req.body;
  console.log(req.body)
  dbinstance.collection('appointments').insertOne({id,name,email, work, address, zip, state, phone}).then(d=>{
    console.log(d);
  }).catch(e=>{
    console.log(e);
  })

  res.redirect('/dashboard');
})

// Handle booking form submission
app.post('/submit-booking', async (req, res) => {
  try {
    // Extract the zip and workType from the request body
    const { zip, workType } = req.body;

    // Perform the database query to find matching taskers
    const data = await dbinstance.collection('customer').find({
      zip: zip,
      workArea: workType,
      role: "tasker"
    }).toArray();

    // Log the retrieved data for debugging purposes
    console.log(data);

    // Render the available_tasker template with the retrieved data
    res.render('bookingForms/available_tasker', { data: data });
    
  } catch (error) {
    // Log and send the error if something goes wrong
    console.error('Error during booking submission:', error);
    res.status(500).send('An error occurred while submitting the booking.');
  }
});






// app.get('/show-bookings', async (req, res) => {
//   try { 
//     const userEmail = req.session.user.email;
//     const userId = req.session.user._id;    
//     // Ensure userEmail is valid
//     if (!userEmail) {
//       return res.status(400).send('User email not found in session');
//     }

//     // Fetch data from database
//     const data = await dbinstance.collection('appointments').find({ id: userId }).toArray();
//    console.log(data);
   
//     const adata = await dbinstance.collection('appointments').find({ email: userEmail }).toArray();

//     // Render the view with data
//     res.render('tasker-panel', { data });
//   } catch (e) {
//     console.error('Error fetching data:', e);
//     res.status(500).send('Error fetching data');
//   }
// });



// Start the server
app.listen(5050, (err) => {
  if (err) console.log(err);
  else console.log('Server running on port 5050');
});