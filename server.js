// // require('dotenv').config();
// // const express = require('express');
// // const app = express();
// // const mongodb = require('mongodb');
// // const client = mongodb.MongoClient;
// // const multer = require('multer');
// // const path = require('path');
// // const session = require('express-session');
// // const nodemailer = require('nodemailer');
// // const crypto = require('crypto');


// // const bookingRoutes = require('./routes/booking.js');
// // // Middleware for serving static files
// // app.use(express.static('public'));
// // app.use('/image',express.static('image'));

// // app.use('/booking',bookingRoutes);


// // app.set('view engine', 'ejs');
// // app.use(express.urlencoded({ extended: false }));

// // let dbinstance;



// // // Middleware for sessions
// // app.use(session({
// //   secret: process.env.SESSION_SECRET || 'your_secret_key', // Use an environment variable for the session secret
// //   resave: false,
// //   saveUninitialized: true,
// //   cookie: { secure: false } // Set to true if using HTTPS
// // }));

// // // Connect to MongoDB
// // client.connect(process.env.mongourl)
// //   .then((database) => {
// //     console.log('Connected to MongoDB');
// //     dbinstance = database.db('SkillLink');
// //   })
// //   .catch((e) => {
// //     console.log('MongoDB Connection Error: ', e);
// //   });

// // // Configure Nodemailer
// // const transporter = nodemailer.createTransport({
// //   service: process.env.EMAIL_SERVICE,
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS
// //   }
// // });

// // // Verify Nodemailer configuration
// // transporter.verify((error, success) => {
// //   if (error) {
// //     console.log('Error configuring Nodemailer: ', error);
// //   } else {
// //     console.log('Nodemailer is ready to send emails');
// //   }
// // });

// // // Generate OTP
// // function generateOTP(length = 6) {
// //   return crypto.randomBytes(length).toString('hex').substring(0, length).toUpperCase();
// // }

// // // Routes
// // app.get('/', (req, res) => {
// //   res.redirect('/login');
// // });

// // app.get('/login', (req, res) => {
// //   res.render('login', { message: '' });
// // });

// <<<<<<< Updated upstream
// // app.get('/signup', (req, res) => {
// //   res.render('signup', { message: '' });
// // });

// // app.get('/dashboard', (req, res) => {
// //   if (!req.session.user) {
// //     return res.redirect('/login');
// //   }
// //   dbinstance.collection('customer').find({}).toArray().then(data => {
// //     res.render('dashboard', { message: 'Products:', product: data, user: req.session.user });
// //   });
// // });

// // // Multer configuration for file uploads (if needed)
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, path.join(__dirname, '/public'));
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, file.originalname);
// //   }
// // });

// // const upload = multer({ storage });

// // // Signup route
// // app.post('/signup', (req, res) => {
// //   const { email, username, password } = req.body;

// //   dbinstance.collection('customer').findOne({ email }).then(existingUser => {
// //     if (existingUser) {
// //       return res.render('signup', { message: 'Email already exists' });
// //     }

// //     const otp = generateOTP();

// //     // Remove any existing OTPs for the email
// //     dbinstance.collection('otps').deleteMany({ email }).then(() => {
// //       // Insert the new user
// //       dbinstance.collection('customer').insertOne({ email, username, pass: password, role: 'customer' }).then(() => {
// //         // Insert OTP for verification
// //         dbinstance.collection('otps').insertOne({ email, otp, timestamp: new Date() }).then(() => {
// //           // Send OTP email
// //           const mailOptions = {
// //             from: process.env.EMAIL_USER,
// //             to: email,
// //             subject: 'Your OTP Code',
// //             text: `Your OTP code is ${otp}`
// //           };

// //           transporter.sendMail(mailOptions, (error, info) => {
// //             if (error) {
// //               console.error('Error sending email: ', error);
// //               return res.status(500).send('Error sending email');
// //             }
// //             res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
// //           });
// //         }).catch(dbErr => {
// //           console.error('Database error: ', dbErr);
// //           res.status(500).send('Database error');
// //         });
// //       }).catch(dbErr => {
// //         console.error('Database error: ', dbErr);
// //         res.status(500).send('Database error');
// //       });
// //     });
// //   }).catch(dbErr => {
// //     console.error('Database error: ', dbErr);
// //     res.status(500).send('Database error');
// //   });
// // });

// // // Login route
// // app.post('/login', (req, res) => {
// //   const { username, password } = req.body;

// //   dbinstance.collection('customer').findOne({ username }).then(user => {
// //     if (user && user.pass === password) {
// //       req.session.user = user;
// //       res.redirect('/dashboard');
// //     } else {
// //       res.send(`
// //         <script>
// //           alert('Wrong credentials');
// //           window.location.href = '/login';
// //         </script>
// //       `);
// //     }
// //   }).catch(dbErr => {
// //     console.error('Database error: ', dbErr);
// //     res.status(500).send('Database error');
// //   });
// // });

// // // OTP verification route
// // app.get('/verify-otp', (req, res) => {
// //   const email = req.query.email;
// //   res.render('verify-otp', { email, message: '' });
// // });

// // app.post('/verify-otp', (req, res) => {
// //   const { email, otp } = req.body;
// //   dbinstance.collection('otps').findOne({ email }).then(data => {
// //     if (data && data.otp === otp) {
// //       dbinstance.collection('otps').deleteOne({ email });
// //       req.session.user = { email };
// //       res.redirect('/dashboard');
// //     } else {
// //       res.render('verify-otp', { email, message: 'Invalid OTP' });
// //     }
// //   }).catch(dbErr => {
// //     console.error('Database error: ', dbErr);
// //     res.status(500).send('Database error');
// //   });
// // });

// // // Logout route
// // app.get('/logout', (req, res) => {
// //   req.session.destroy((err) => {
// //     if (err) {
// //       console.log(err);
// //     }
// //     res.redirect('/login');
// //   });
// // });

// // // Start the server
// // app.listen(5050, (err) => {
// //   if (err) console.log(err);
// //   else console.log('Server running on port 5050');
// // });
// =======
// app.listen(5050, (err) => {
//   if (err) console.log(err);
//   else console.log('Server running on port 3000');
// });
// >>>>>>> Stashed changes
