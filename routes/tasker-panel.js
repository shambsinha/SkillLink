const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
    res.render('/tasker-panel');
})

module.exports = router;