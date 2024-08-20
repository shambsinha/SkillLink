const express = require('express');
const router = express.Router();


router.get('/electrician', (req, res) => {
  if(!req.session.user){
    res.send(`<script>alert('You have to login first!'); window.location.href='/login';</script>`);
  }else
    res.render('bookingForms/booking-form');
});

router.get('/plumber', (req, res) => {
  if(!req.session.user){
    res.send(`<script>alert('You have to login first!'); window.location.href='/login';</script>`);
  }else
    res.render('bookingForms/booking-form');
});

router.get('/painter', (req, res) => {
  if(!req.session.user){
    res.send(`<script>alert('You have to login first!'); window.location.href='/login';</script>`);
  }else
    res.render('bookingForms/booking-form');
});
router.get('/carpenter', (req, res) => {
  if(!req.session.user){
    res.send(`<script>alert('You have to login first!'); window.location.href='/login';</script>`);
  }else
    res.render('bookingForms/booking-form');
});
router.get('/mason', (req, res) => {
  if(!req.session.user){
    res.send(`<script>alert('You have to login first!'); window.location.href='/login';</script>`);
  }else
    res.render('bookingForms/booking-form');
});
router.get('/shifting', (req, res) => {
  if(!req.session.user){
    res.send(`<script>alert('You have to login first!'); window.location.href='/login';</script>`);
  }else
    res.render('bookingForms/booking-form');
});


router.get('/', async (req, res) => {
    const dbinstance = req.app.locals.db;
    if(!req.session.user){
      res.send(`<script>alert('You have to login first!'); window.location.href='/login';</script>`);
    }else{
    try { 
      const userEmail = req.session.user.email;
      // Fetch data from database
      const data = await dbinstance.collection('appointments').find({ email: userEmail }).toArray();
  
      // Render the view with data
      res.render('bookingForms/show-bookings', { data });
    } catch (e) {
      console.error('Error fetching data:', e);
      res.status(500).send('Error fetching data');
    }
  }
  });


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


router.get('/book-appointment/:id', (req, res) => {
  let id = req.params.id;
  console.log(id);
  res.render('bookingForms/book_appointment',{id:id})
});

router.post('/book-appointment', (req,res)=>{
  const dbinstance = req.app.locals.db;

  const { id, name,email,work, address, zip, state, phone } = req.body;
  console.log(req.body)
  dbinstance.collection('appointments').insertOne({id,name,email, work, address, zip, state, phone,status:"pending"}).then(d=>{
    console.log(d);
  }).catch(e=>{
    console.log(e);
  })

  res.redirect('/dashboard');
})



module.exports = router;