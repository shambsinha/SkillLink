const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Generate OTP
function generateOTP(length = 6) {
  return crypto.randomBytes(length).toString('hex').substring(0, length).toUpperCase();
}

// Login route
router.get('/login', (req, res) => {
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
router.get('/signup', (req, res) => {
  res.render('signup', { message: '' });
});

router.post('/signup', (req, res) => {
  const { email, username, password } = req.body;
  const db = req.app.locals.db;
  const transporter = req.app.locals.transporter;

  db.collection('customer').findOne({ email }).then(existingUser => {
    if (existingUser) {
      return res.render('signup', { message: 'Email already exists' });
    }

    const otp = generateOTP();

    // Remove any existing OTPs for the email
    db.collection('otps').deleteMany({ email }).then(() => {
      // Insert the new user
      db.collection('customer').insertOne({ email, username, pass: password, role: 'customer' }).then(() => {
        // Insert OTP for verification
        db.collection('otps').insertOne({ email, otp, timestamp: new Date() }).then(() => {
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
            res.redirect(`/otp/verify?email=${encodeURIComponent(email)}`);
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
  }).catch(dbErr => {
    console.error('Database error: ', dbErr);
    res.status(500).send('Database error');
  });
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
