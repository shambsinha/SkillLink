const express = require('express');
const Router = express.Router();


Router.get('/',(req,res)=>{
  if(!req.session.user){
    res.send(`<script>alert('You have to login first!'); window.location.href='/login';</script>`);
  }
  else if (req.session.user && req.session.user.role === 'tasker') {
    res.send(`<script>alert('You are already a tasker!'); window.location.href='/tasker-panel';</script>`);
  } else {
    // Handle other roles or cases
    res.render('enroll_tasker',{message:'',user:req.session.user});
  }

  
})

//create=tasker

Router.post('/submit-tasker', async (req, res) => {
    try {
      console.log(req.body)
        const { username, workArea, address, phone, email, fees, zip } = req.body;
        const dbinstance = req.app.locals.db;
        
        dbinstance.collection('tasker').insertOne({
            username, 
            workArea,
            address, 
            phone, 
            email, 
            fees, 
            zip
        }).then((e)=>{
          console.log(e);
        }).catch((e)=>{
          console.log(e);
        })
        
        dbinstance.collection('customer').updateOne(
          { email: req.session.user.email },  // Find the customer by email
          { $set: { role: 'tasker' } }         // Update the role to 'tasker'
      )
      req.session.user.role = 'tasker';
        res.send(`
          <script>
              alert('You are now a tasker!');
              window.location.href = '/tasker-panel';
          </script>
      `);
  
    }catch(e){
        console.log(e);
    };
})




module.exports = Router;