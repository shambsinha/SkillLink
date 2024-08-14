const express = require('express');
const router = express.Router();

// OTP verification route
router.get('/verify', (req, res) => {
  const email = req.query.email;
  res.render('verify-otp', { email, message: '' });
});

router.post('/verify', (req, res) => {
  const { email, otp } = req.body;
  const db = req.app.locals.db;

  db.collection('otps').findOne({ email }).then(data => {
    if (data && data.otp === otp) {
      db.collection('otps').deleteOne({ email });
      req.session.user = { email };
      res.redirect('/dashboard');
    } else {
      res.render('verify-otp', { email, message: 'Invalid OTP' });
    }
  }).catch(dbErr => {
    console.error('Database error: ', dbErr);
    res.status(500).send('Database error');
  });
});

module.exports = router;
