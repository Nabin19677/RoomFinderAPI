const router = require('express').Router();

//Home controllers
var userCtrl = require('../Controllers/user');

//Routing
router.get('/profile', userCtrl.profile);
router.put('/editInfo', userCtrl.editInfo);
router.put('/changePassword', userCtrl.changePassword);
router.put('/sendNotifications',userCtrl.sendNotifications);
router.get('/notifications',userCtrl.getNotifications);
router.put('/viewNotification',userCtrl.viewNotification);
router.put('/notifiedNotification',userCtrl.notifiedNotification);
router.get('/getPersonalInfo',userCtrl.getPersonalInfo);
router.put('/updatePersonalInfo',userCtrl.updatePersonalInfo);


//Export
module.exports = router;