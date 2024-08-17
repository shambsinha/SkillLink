const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
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