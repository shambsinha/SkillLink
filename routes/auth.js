const express = require('express');
const router = express.Router();

// Middleware to check if user is logged in
function checkLoggedIn(req, res, next) {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    next();
  }
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

  if (req.session.user) {
    res.send(`
      <script>
        alert('Already logged in');
        window.location.href = '/dashboard';
      </script>
    `);
  } else {
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
  }
});

// Signup route
router.get('/signup', checkLoggedIn, (req, res) => {
  res.render('signup', { message: '' });
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