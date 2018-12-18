//Dependencies
const express = require('express');
const router = express.Router();

//Add user controller
const user = require('../Controllers/user');

router.post('/post',user.post); //Use with parameters
router.get('/view?:phone', user.get); //Use with query
router.put('/update', user.put); //Use with parameters
router.delete('/delete?:phone', user.delete); //Use with query

module.exports = router;
