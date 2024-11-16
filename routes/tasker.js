const express = require('express');
const router = express.Router();


router.get('/',(req,res)=>{
  if(!req.session.user){
    res.send(`<script>alert('You have to login first!'); window.location.href='/login';</script>`);
  }
  else if (req.session.user && req.session.user.role === 'tasker') {
    res.send(`<script>alert('You are already a tasker!'); window.location.href='/tasker/panel';</script>`);
  } else {
    // Handle other roles or cases
    res.render('enroll_tasker',{message:'',user:req.session.user});
  }

  
})

//create=tasker

router.post('/submit-tasker', async (req, res) => {
    try {
      console.log(req.body)
        const { username, workArea, address, phone, email, fees, zip } = req.body;
        const dbinstance = req.app.locals.db;
        
        dbinstance.collection('customer').updateOne(
          { email: req.session.user.email },  // Find the document by email
          { 
              $set: { 
                  address,
                  workArea,                 
                  zip,                      
                  role: 'tasker',          
                  phone,
                  fees
              } 
          }
      ).then((e) => {
          console.log('Document updated:', e);
      }).catch((e) => {
          console.log('Error updating document:', e);
      });

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

router.get('/panel', async (req, res) => {
  const dbinstance = req.app.locals.db;
  try { 
    const userEmail = req.session.user.email;
    const userId = req.session.user._id;   
    console.log(userEmail);
     
    // Ensure userEmail is valid
    if (!userEmail) {
      return res.status(400).send('User email not found in session');
    }

    // Fetch data from database
    const data = await dbinstance.collection('appointments').find({ id: userId }).toArray();
   console.log(data)

    // Render the view with data
    res.render('tasker-panel', { data });
  } catch (e) {
    console.error('Error fetching data:', e);
    res.status(500).send('Error fetching data');
  }
});


module.exports = router;