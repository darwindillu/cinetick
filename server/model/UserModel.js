const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    }
})

const UserCollection = mongoose.model('UserModal',UserSchema)

module.exports = UserCollection