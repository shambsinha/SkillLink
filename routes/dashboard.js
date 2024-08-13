const express = require('express');
const router = express.Router();

// Dashboard route
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const db = req.app.locals.db;
  db.collection('customer').find({}).toArray().then(data => {
    res.render('dashboard', { message: 'Products:', product: data, user: req.session.user });
  });
});

module.exports = router;
