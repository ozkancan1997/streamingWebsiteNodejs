const express = require('express');
const app = express();
const port = 3000;
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
const upload = require('express-fileupload')
const path = require('path')
require('dotenv').config();


app.use(express.json());
app.use(upload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));




//app.get(/api/v1/videos) list all videos
//app.post(/api/v1/videos) upload a video
//app.get(/api/v1/videos/:id) watch a video
//app.patch(/api/v1/videos/:id) update a video
//app.delete(/api/v1/videos/:id) delete a video
//All in one
app.use('/api/v1/videos', tasks); 

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(port, console.log(`Server is listenin on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
}

start();