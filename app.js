const express = require('express');
const app = express();
const port = 3000;
const tasks = require('./routes/tasks');


app.use(express.json());

//routes 
app.get('/hello', (req,res)=>{
    res.send("Streaming App");
});

app.use('/api/v1/videos', tasks); //app.get(/api/v1/videos) list all videos


app.use//app.post(/api/v1/videos) upload a video
//app.get(/api/v1/videos/:id) watch a video
//app.patch(/api/v1/videos/:id) update a video
//app.delete(/api/v1/videos/:id) delete a video

app.listen(port, console.log(`Server is listenin on port ${port}...`));