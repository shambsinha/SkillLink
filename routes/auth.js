const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Middleware to check if user is logged in
function checkLoggedIn(req, res, next) {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    next();
  }
}

// Generate OTP
function generateOTP(length = 6) {
  return crypto.randomBytes(length).toString('hex').substring(0, length).toUpperCase();
}

// Root route ("/")
router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Login route
router.get('/login', checkLoggedIn, (req, res) => {
  res.render('login', { message: '' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = req.app.locals.db;

  db.collection('customer').findOne({ username })
    .then(user => {
      if (user && user.pass === password) {
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.send(`
          <script>
            alert('Wrong credentials');
            window.location.href = '/login';
          </script>
        `);
      }
    })
    .catch(dbErr => {
      console.error('Database error: ', dbErr);
      res.status(500).send('Database error');
    });
});

// Signup route
router.get('/signup', checkLoggedIn, (req, res) => {
  res.render('signup', { message: '' });
});

router.post('/signup', (req, res) => {
  const { email, username, password } = req.body;
  const db = req.app.locals.db;
  const transporter = req.app.locals.transporter;

  db.collection('otps').deleteMany({ email }).then(() => {
    const otp = generateOTP();

    // Store user details temporarily
    db.collection('pending_users').insertOne({ email, username, password, otp }).then(() => {
      
      // Send OTP email
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

// OTP verification route
router.get('/verify-otp', (req, res) => {
  const email = req.query.email;
  res.render('verify-otp', { email, message: '' });
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const db = req.app.locals.db;

  db.collection('pending_users').findOne({ email }).then(data => {
    if (data && data.otp === otp) {
      // Move user from pending_users to customer collection
      db.collection('customer').insertOne({
        email: data.email,
        username: data.username,
        pass: data.password,
        role: 'customer'
      }).then(() => {
        db.collection('pending_users').deleteOne({ email });
        req.session.user = { email: data.email };
        res.redirect('/dashboard');
      }).catch(dbErr => {
        console.error('Database error: ', dbErr);
        res.status(500).send('Database error');
      });

    } else {
      res.render('verify-otp', { email, message: 'Invalid OTP' });
    }
  }).catch(dbErr => {
    console.error('Database error: ', dbErr);
    res.status(500).send('Database error');
  });
});

// Add the dashboard route
router.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.render('dashboard', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;