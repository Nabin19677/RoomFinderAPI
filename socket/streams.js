module.exports = (io) => {
    io.on('connection', socket => {
        console.log('User connected');
        socket.on('sentMessage',(data)=>{
            io.emit('sentMessageSaved',{});    
        });

        socket.on('roomAdded',(data) => {
            io.emit('roomAddedNotification',{});
        });
    });
};