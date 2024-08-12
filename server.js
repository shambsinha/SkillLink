require('dotenv').config();
const express = require('express');
const app = express();
const mongodb = require('mongodb');
const client = mongodb.MongoClient;
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

let dbinstance;

// Middleware for serving static files
app.use(express.static('public'));

// Middleware for sessions
app.use(session({
  secret: 'your_secret_key', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

client.connect(process.env.mongourl)
  .then((database) => {
    console.log('Connected to MongoDB');
    dbinstance = database.db('SkillLink');
  })
  .catch((e) => {
    console.log(e);
  });

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Error configuring Nodemailer: ', error);
  } else {
    console.log('Nodemailer is ready to send emails');
  }
});

// Generate OTP
function generateOTP(length = 6) {
  return crypto.randomBytes(length).toString('hex').substring(0, length).toUpperCase();
}

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { message: '' });
});

app.get('/signup', (req, res) => {
  res.render('signup', { message: '' });
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  dbinstance.collection('customer').find({}).toArray().then(data => {
    res.render('dashboard', { message: 'Products:', product: data, user: req.session.user }); // Passing the user data from session
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/public'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.post('/signup', (req, res) => {
  let { email, username, pass } = req.body;
  dbinstance.collection('customer').find({ email: email }).toArray().then(data => {
    if (data.length > 0) {
      res.render('signup', { message: 'Email already exists' });
    } else {
      const otp = generateOTP();
      
      // Delete any existing OTP entries for this email
      dbinstance.collection('otps').deleteMany({ email: email }).then(() => {
        dbinstance.collection('customer').insertOne({ email: email, username: username, pass: pass, role: 'customer' }).then(() => {
          
          // Insert new OTP after deleting old ones
          dbinstance.collection('otps').insertOne({ email: email, otp: otp, timestamp: new Date() }).then(() => {
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: 'Your OTP Code',
              text: `Your OTP code is ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error('Error sending email: ', error);
                return res.status(500).send('Error sending email');
              }
              res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
            });
          }).catch(dbErr => {
            console.error('Database error: ', dbErr);
            res.status(500).send('Database error');
          });

        }).catch(dbErr => {
          console.error('Database error: ', dbErr);
          res.status(500).send('Database error');
        });
      });
    }
  }).catch(dbErr => {
    console.error('Database error: ', dbErr);
    res.status(500).send('Database error');
  });
});


app.post('/login', (req, res) => {
  let { username, pass } = req.body;
  dbinstance.collection('customer').find({ username: username, pass: pass }).toArray().then(data => {
    if (data.length > 0) {
      req.session.user = data[0]; // Store user data in session
      res.redirect('/dashboard');
    } else {
      res.send(`
        <script>
          alert('Wrong credentials');
          window.location.href = '/login';
        </script>
      `);
    }
  }).catch(dbErr => {
    console.error('Database error: ', dbErr);
    res.status(500).send('Database error');
  });
});

app.get('/verify-otp', (req, res) => {
  const email = req.query.email;
  res.render('verify-otp', { email: email, message: '' });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  dbinstance.collection('otps').findOne({ email: email }).then(data => {
    if (data && data.otp === otp) {
      dbinstance.collection('otps').deleteOne({ email: email });
      req.session.user = { email: email };
      res.redirect('/dashboard');
    } else {
      res.render('verify-otp', { email: email, message: 'Invalid OTP' });
    }
  }).catch(dbErr => {
    console.error('Database error: ', dbErr);
    res.status(500).send('Database error');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/login');
  });
});

app.listen(5050, (err) => {
  if (err) console.log(err);
  else console.log('Server running on port 5050');
});
