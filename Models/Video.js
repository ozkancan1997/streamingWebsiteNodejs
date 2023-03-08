const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({ name : {
    type : String,
    required : true,
    maxLength : 50,
    trim : true
}, desc : {
    type : String,
    required : true,
    maxLength : 500,
    trim : true
}, uploader : {
    type: String,
    required : true,
    maxLength : 50,
    trim : true
}, views : {
    type : Number,
    default : 0,
},
});

module.exports = mongoose.model('Video' , videoSchema)