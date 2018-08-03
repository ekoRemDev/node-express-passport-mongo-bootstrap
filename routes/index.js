// Todo 15-1 index.js

const express = require('express');
const router = express.Router();

// Get HomePage
router.get('/',(req,res)=>{
    res.render('index');
});

module.exports = router;
