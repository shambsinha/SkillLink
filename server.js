require('dotenv').config();
const express = require('express');
const app = express();
const mongodb = require('mongodb');
const client = mongodb.MongoClient;
const multer = require('multer');
const path = require('path');
const session = require('express-session');

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
    dbinstance = database.db('sectionE');
  })
  .catch((e) => {
    console.log(e);
  });

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
      dbinstance.collection('customer').insertOne({ email: email, username: username, pass: pass, role: 'customer' }).then(data => {
        res.redirect('/login');
      });
    }
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
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/login');
  });
});

app.listen(9999, (err) => {
  if (err) console.log(err);
  else console.log('Server running on port 3000');
});
