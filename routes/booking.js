const express = require('express');
const router = express.Router();
const path = require('path');



router.get('/electrician', (req, res) => {
    res.render('bookingForms/booking-form');
});

router.get('/plumber', (req, res) => {
    res.render('bookingForms/booking-form');
});

router.get('/painter', (req, res) => {
    res.render('bookingForms/booking-form');
});
router.get('/carpenter', (req, res) => {
    res.render('bookingForms/booking-form');
});
router.get('/mason', (req, res) => {
    res.render('bookingForms/booking-form');
});
router.get('/shifting', (req, res) => {
    res.render('bookingForms/booking-form');
});

router.get('/show-bookings', async (req, res) => {
    const dbinstance = req.app.locals.db;
    try { 
      const userEmail = req.session.user.email;
      // Ensure userEmail is valid
      if (!userEmail) {
        return res.status(400).send('User email not found in session');
      }
  
      // Fetch data from database
      const data = await dbinstance.collection('appointments').find({ email: userEmail }).toArray();
  
      // Render the view with data
      res.render('bookingForms/show-bookings', { data });
    } catch (e) {
      console.error('Error fetching data:', e);
      res.status(500).send('Error fetching data');
    }
  });

router.get('/', (req, res) => {
    res.send('dashboard');
})





module.exports = router;