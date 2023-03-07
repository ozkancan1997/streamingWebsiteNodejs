const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
const upload = require('express-fileupload')
const path = require('path')
const flash = require('express-flash')
const session = require('express-session');
const passport = require('passport');
const errorHandler = require('./middlewares/errorHandler');

if(process.env.NODE_ENV !== 'production') require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : false}))
app.use(express.json());
app.use(upload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(flash())
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false
}))
app.use(passport.initialize())
app.use(passport.session())



//app.get(/api/v1/videos) list all videos
//app.post(/api/v1/videos) upload a video
//app.get(/api/v1/videos/:id) watch a video
//app.patch(/api/v1/videos/:id) update a video
//app.delete(/api/v1/videos/:id) delete a video
//All in one
app.use('/', tasks);
app.use((req, res)=>{
    console.log(req.url)
    res.status(404).render(path.join(__dirname,'views', 'notfound.ejs'), {url: req.url})
})
app.use(errorHandler); 

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(port, console.log(`Server is listenin on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
}

start();