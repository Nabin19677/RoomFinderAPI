const router = require('express').Router();

//Room Controller
const rooms = require('../Controllers/rooms');


//Routes
router.post('/addRoom', rooms.addRoom); // img upload worked on content type application/json type
router.get('/getRoomsByOwner/:ownerPhone', rooms.getRoomsByOwner);
router.get('/getRoomsPosts', rooms.getRoomsPosts);
router.get('/getRoomsByOwnerId/:ownerPhoneId', rooms.getRoomsByOwnerId);
router.get('/getRoomForHome', rooms.getRoomForHome);
router.post('/search', rooms.search);
router.delete('/delete/:id',rooms.deleteRoom)

router.post('/testing', (req,res) => {
    console.log("WHAT DID I GOT???");
    console.log(req.body)
    res.sendStatus(200);
})
//Exports
module.exports = router;