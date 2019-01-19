const router = require('express').Router();

//Chat controller
const chatCtrl = require('../Controllers/chat');

//Routes
router.post('/newChat',chatCtrl.newChatMessage);
router.get('/conversations',chatCtrl.getConversations);
router.get('/conversation/:conversationId',chatCtrl.getConversation); //on going message route
router.post('/sendReply',chatCtrl.sendReply);
//Exports
module.exports = router;