const express = require('express');
const router = express.Router();


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


// Handle booking form submission
router.post('/submit', async (req, res) => {
  const dbinstance = req.app.locals.db;
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





module.exports = router;