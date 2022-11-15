const express = require ('express')
const userRouter = require('./Routes/user.route')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieSession = require('cookie-session')
const { json } = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const URI = process.env.MONGOLINK
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}))
app.use(json({limit: '100mb'}))
app.use(cors(
    {
        origin: '*',
        methods: 'GET, POST, PUT, DELETE',
        credentials: true
    }
))
mongoose.connect(URI, (err)=>{
    if(err){
        console.log(`Mongoose not connect`);
    }
    else{
        console.log(`Mongoose connected`);
    }
})


const PORT = process.env.PORT
app.use('/', userRouter)
// app.use('/admin')

app.listen(PORT, ()=>{
    console.log(`App is listening on port: ${PORT}`);
})