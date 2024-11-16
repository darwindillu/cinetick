const mongoose = require('mongoose')

const theatreSchema = mongoose.Schema({
    theatreName :{
        type:String
    },
    location :{
        type:String
    },
    mobile : {
        type:Number
    },
    totalSeats :{
        type : Number
    },
    imageUrl : {
        type:String
    },
    state : {
        type:String
    },
    city : {
        type:String
    },
    createdAt : {
        type:Date,
        default : Date.now()
    }
})

const theatreCollection = mongoose.model('TheatreModal',theatreSchema)

module.exports = theatreCollection;