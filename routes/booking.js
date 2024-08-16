const express = require('express');
const router = express.Router();
const path = require('path');



router.get('/electrician', (req,res)=>{
    res.render('bookingForms/booking-form');
});

router.get('/plumber', (req,res)=>{
    res.render('bookingForms/booking-form');
});

router.get('/painter', (req,res)=>{
    res.render('bookingForms/booking-form');
});


router.get('/',(req,res)=>{
    res.send('dashboard');
})



module.exports = router;


// const express = require('express');
// const router = express.Router();

// // Example booking route (implement as needed)
// router.get('/', (req, res) => {
//   res.send('Booking Home');
// });

// // Add other booking-related routes here

// module.exports = router;
