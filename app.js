//external imports
const express = require('express') ;
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const path = require('path');
const moment = require("moment");
const http = require("http");




//internal imports
const usersRouter  = require('./router/usersRouter');
const loginRouter  = require('./router/loginRouter');
const inboxRouter  = require('./router/inboxRouter');
const { notFoundHandler, errorHandler } = require('./middlewares/common/errorHandler');
const decorateHtmlResponse = require('./middlewares/common/decorateHtmlResponse');
const { default: mongoose } = require('mongoose');


//availabling all .env variables
dotenv.config()

//creating the main server
const app = express()

const server = http.createServer(app);

// socket creation
const io = require("socket.io")(server);
global.io = io;

app.locals.moment = moment;

//DATABASE connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
        .then(()=>console.log('Database connection successfull'))
        .catch((err)=>console.log(err.message))



//request parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser(process.env.COOKIE_SECRET));


//set engines

app.set('view engine', 'ejs')

//set static folder
app.use(express.static(path.resolve(__dirname+'/public')))







//set routes
app.use('/', loginRouter )
app.use('/inbox' , inboxRouter  )
app.use('/users' , usersRouter )
            






//router error handler
app.use( notFoundHandler )

//default error handler of express

app.use(errorHandler)


// ruunning the server
server.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})
