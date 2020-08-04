//Dependencies
const express=require('express');
const {v4:uuidV4}=require('uuid');



const app=express();
const server=require('http').Server(app)
const io=require('socket.io')(server)


app.set('view engine','ejs')
app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.render('index');
    //res.redirect(`/${uuidV4()}`)
})
app.get('/r',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})


io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        console.log(roomId,userId);
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)

        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit('user-disconnected',userId)
        })
    })
})
//PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`)
})
