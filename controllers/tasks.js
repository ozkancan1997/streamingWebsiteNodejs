const Video = require('../Models/Video');
const User = require('../Models/User');
const fs = require('fs');
const path = require('path');
const passport = require('passport')
const localStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const initializePassport = require('../passportconfig');

initializePassport(passport, (email) =>{
    return User.findOne({email})
});

path.resolve();

const getIndex = (req, res) =>{
    res.status(200).render(path.join(__dirname,'..','views','index.ejs'))
}

const getAllVideos = async (req, res)=>{
    let allVideos;
    try {
        if(req.params.query=='*'){allVideos = await Video.find({});}
        else{allVideos = await Video.find({ name : req.params.query})}
        console.log(req.params.query)
        res.status(200).json({allVideos});
    } catch (error) {
        res.status(500).json({message : error});
    }
}

const registerVideo = async (req, res)=>{
    try {
        const video = await Video.create(req.body);
        res.status(201).json({video});
    } catch (error) {
        res.status(500).json({message : error});
    }
}

const uploadVideo = (req, res)=>{
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.uploaded;
    uploadPath = __dirname+'/../videos/' + sampleFile.name;
    
    // console.log(req.files);

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
  
      res.send('File uploaded!');
    });

}

const bringVideo = async (req, res)=>{
    console.log("bring")
    const videoID = req.params.id;
    try {
        const video = await Video.findOne({_id : videoID});
        if(!video){
            res.status(404).json({message : "No such video"});
            return;
        }
        console.log("ulaşıldı")
        res.status(200).render(path.join(__dirname,'..','views','stream.ejs'))
    } catch (error) {
        res.status(500).json({ message : error});
    }    
}

const streamVideo = async (req, res)=>{
    let range, videoPath, videoSize, chunkSize, start, end, readStream, contentLength;
    range = req.headers.range;
    if(!range) range='0';
    videoPath = path.join(__dirname,'..', 'videos',req.params.id+'.mp4');
    videoSize = fs.statSync(videoPath).size;
    chunkSize = 1000000;
    start = Number(range.replace(/\D/g, ""));
    end = Math.min(start + chunkSize, videoSize-1);
    readStream = fs.createReadStream(videoPath, {start, end});
    contentLength = end - start + 1;
    res.writeHead(206,{
        "Content-Range" : `bytes ${start} - ${end}/${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4"

    })
    readStream.pipe(res);
    console.log("video")
}

const updateVideo = (req, res)=>{
    res.json({id : req.params.id, desc : req.body.desc});
}

const deleteVideo = async (req, res)=>{
    const videoID = req.params.id;
    try {
        const deletedVideo = await Video.findOneAndDelete({_id : videoID});
        if(!deletedVideo){
            res.status(404).json({ message : "No such video"});
            return;
        }
        res.status(200).json({ deletedVideo });
    } catch (error) {
        res.status(500).json({ message : error});
    }
}

const getLoginPage = async (req, res)=>{
    res.status(200).render(path.join(__dirname,'..','views','login.ejs'))
}

const login = async (req,res,next) =>{
    console.log(req.body)
    passport.authenticate('local', {
    successRedirect : '/api/v1/videos',
    failureRedirect : '/api/v1/user/login',
    failureFlash : true
})(req,res,next)
}

const getRegisterPage = async (req, res) =>{
    res.status(200).render(path.join(__dirname,'..','views','register.ejs'))
}

const register = async (req, res) =>{
    try {
        const hashedPass = await bcrypt.hash(req.body.pass, 10);
        const newUser = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashedPass
        });
        console.log(newUser);
        res.status(201).redirect('/api/v1/user/login')
    } catch (error) {
        res.status(500).send(error)
        
    }
}


module.exports = {
    getIndex,
    getAllVideos,
    registerVideo,
    uploadVideo,
    bringVideo,
    streamVideo,
    updateVideo,
    deleteVideo,
    getLoginPage,
    login,
    getRegisterPage,
    register
}