const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
let range, videoPath, videoSize, chunkSize, start, end, readStream, contentLength;


app.use('/video', (req, res, next)=>{
    range = req.headers.range;
    if(!range) range='0';
    videoPath = path.join(__dirname,'example.mp4');
    videoSize = fs.statSync(videoPath).size;
    chunkSize = 1000;
    start = Number(range.replace(/\D/g, ""));
    end = Math.min(start + chunkSize, videoSize-1);
    readStream = fs.createReadStream(videoPath, {start, end});
    contentLength = end - start + 1;
    next();
})

app.get('/', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname,'index.html'))
})



app.get('/video', (req, res)=>{
    res.writeHead(206,{
        "Content-Range" : `bytes ${start} - ${end}/${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4"

    })
    readStream.pipe(res);

})


app.listen(3000);