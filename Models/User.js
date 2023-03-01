const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxLength : 50,
        trim : true
    },
    email : {
        type : String,
        required : true,
        maxLength : 50,
        trim : true
    },
    password : {
        type : String,
        required : true,
    }
})

module.exports = mongoose.model('User', userSchema);