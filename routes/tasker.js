const express = require('express');
const Router = express.Router();


Router.get('/',(req,res)=>{
     res.render('enroll_tasker',{message:''});
})

//create=tasker

Router.post('/submit-tasker', async (req, res) => {
    try {
      console.log(req.body)
        const { username, address, phone, email, fees, zip } = req.body;
        const dbinstance = req.app.locals.db;

        dbinstance.collection('tasker').insertOne({
            username, 
            address, 
            rating,
            phone, 
            email, 
            fees, 
            zip
        }).then((e)=>{
          console.log(e);
        }).catch((e)=>{
          console.log(e);
        })
    
   
   
    res.send('Success')
  
    }catch(e){
        console.log(e);
    };
})




module.exports = Router;