const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  
    if (!req.session.user) {
        return res.redirect('/login');
      }
      req.app.locals.db.collection('customer').find({}).toArray().then(data => {
        res.render('profile', { message: 'Products:', product: data, user: req.session.user });
      });
})

module.exports = router;