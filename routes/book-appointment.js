const express = require('express');

const router = express.Router();



//booking
router.get('/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    res.render('bookingForms/book_appointment',{id:id})
  });
  
  router.post('/', (req,res)=>{
    const dbinstance = req.app.locals.db;

    const { id, name,email,work, address, zip, state, phone } = req.body;
    console.log(req.body)
    dbinstance.collection('appointments').insertOne({id,name,email, work, address, zip, state, phone}).then(d=>{
      console.log(d);
    }).catch(e=>{
      console.log(e);
    })
  
    res.redirect('/dashboard');
  })


module.exports = router;