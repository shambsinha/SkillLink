const express = require('express');
const router = express.Router();
const path = require('path');



router.get('/electrician', (req,res)=>{
    res.render('bookingForms/electrician');
});


router.get('/',(req,res)=>{
    res.send('some');
})

module.exports = router;