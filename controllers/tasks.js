const Video = require('../Models/Video');
const User = require('../Models/User');
const fs = require('fs');
const path = require('path');
const passport = require('passport')
const bcrypt = require('bcrypt')
const initializePassport = require('../passportconfig');
const asyncWrapper = require("../middlewares/asyncWrapper");
let video_name;
let video_temp;

initializePassport(passport,
    async (email) =>{
        return await User.findOne({email})
    }, async (id) =>{
        return  await User.findOne({_id : id})
});

path.resolve();

const checkAuth = (req,res,next)=>{
    if(req.isAuthenticated()){
        next()
    }else{
        res.redirect('/user/login')
    }
}

const checkNotAuth = (req, res, next)=>{
    if(!req.isAuthenticated()){
        next()
    }else{
        res.redirect('/videos')
    }
}

const getIndex = (req, res) =>{
    res.status(200).render(path.join(__dirname,'..','views','index.ejs'), { name: req.user.name, id: req.user._id})
}

const queryVideos = asyncWrapper( async (req, res)=>{
    let allVideos;
    let pattern = `.*${req.params.query}.*`;
    if(req.params.query=='*'){allVideos = await Video.find({});}
    else{allVideos = await Video.find({$or : [{ name : {$regex:pattern, $options:'ig'}}, { uploader : {$regex:pattern, $options:'ig'} }]})}
    res.status(200).json({allVideos});
})

const userVideos = asyncWrapper( async (req, res)=>{
    let userVideos;
    userVideos = await Video.find({ uploader : req.params.id})
    const uploader = await User.findOne({_id : req.params.id})
    res.status(200).json({userVideos, uploader: uploader.name});
})

const registerVideo = asyncWrapper( async (req, res, next)=>{
    video_temp = req.body;
    console.log(video_temp)
    return;
})

const uploadVideo = asyncWrapper( async (req, res)=>{

    const video = await Video.create(video_temp);
    console.log(video)
    video_name=video._id+'.mp4';
    let file;
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
        
    file = req.files.uploaded;
    file.mv(path.join(__dirname,'..','videos',video_name), (err)=>{
        if (err)
        return res.status(500).send(err);
    });

    res.status(201).redirect('/user/'+req.user._id);

})


const bringVideo = asyncWrapper( async (req, res)=>{
    const videoID = req.params.id;
    const video = await Video.findOneAndUpdate({_id : videoID}, {$inc:{views : 1}},{new : true});
    const uploader = await User.findOne({_id : video.uploader})
    if(!video){
        res.status(404).json({message : "No such video"});
        return;
    }

    res.status(200).render(path.join(__dirname,'..','views','stream.ejs'),{ name : video.name, desc : video.desc, uploader : uploader.name, views : video.views})   
})

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
    //console.log("video")
}

const updateVideo = asyncWrapper( async (req, res)=>{

    console.log(req.url)
    const video = await Video.findOneAndUpdate({_id : req.params.id}, req.body, {new: true ,runValidators: true})
    console.log(video)
    res.status(200).send({message:'OK'});

})

const deleteVideo = asyncWrapper( async (req, res)=>{
    const videoID = req.params.id;

    const deletedVideo = await Video.findOneAndDelete({_id : videoID});
    if(!deletedVideo){
        res.status(404).json({ message : "No such video"});
        return;
    }
    fs.unlink(path.join(__dirname, '..', 'videos', videoID+'.mp4'), (err)=>{
        if(err) console.log(err);
        else console.log("Deleted")
    })
    res.status(200).json({ deletedVideo });

})

const getLoginPage = async (req, res)=>{
    res.status(200).render(path.join(__dirname,'..','views','login.ejs'))
}

const login = async (req,res,next) =>{
    //console.log(req.body)
    passport.authenticate('local', {
    successRedirect : '/videos',
    failureRedirect : '/user/login',
    failureFlash : true
})(req,res,next)
}

const getRegisterPage = async (req, res) =>{
    res.status(200).render(path.join(__dirname,'..','views','register.ejs'))
}

const register = asyncWrapper( async (req, res) =>{

    const hashedPass = await bcrypt.hash(req.body.pass, 10);
    await User.create({
        name : req.body.name,
        email : req.body.email,
        password : hashedPass
    });
    res.status(201).redirect('/user/login')

})

const logout = (req, res)=>{
    req.logOut((err)=>{
        if(err) return console.log(err);
        res.redirect('/user/login')
    });
    
    
}

const getUserVideos = (req, res)=>{
    console.log(req.user)
    res.status(200).render(path.join(__dirname,'..','views','uservideos.ejs'),{ id : req.user._id })
}


module.exports = {
    getIndex,
    checkAuth,
    checkNotAuth,
    queryVideos,
    userVideos,
    uploadVideo,
    registerVideo,
    bringVideo,
    streamVideo,
    updateVideo,
    deleteVideo,
    getLoginPage,
    login,
    getRegisterPage,
    register,
    logout,
    getUserVideos
}