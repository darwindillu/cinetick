const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

const UserCollection = mongoose.model('UserModal',UserSchema)

module.exports = UserCollection