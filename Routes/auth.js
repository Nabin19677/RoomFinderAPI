const router = require('express').Router();

//Authentication controller
const auth = require('../Controllers/auth');

//Routes
router.post('/register',auth.register); //Use with body
router.post('/login',auth.login); //Use with body

//Export
module.exports = router;
