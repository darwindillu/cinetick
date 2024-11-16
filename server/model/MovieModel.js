const mongoose = require('mongoose')

const movieSchema = mongoose.Schema ({
    movieName :{
        type:String
    },
    genre :{
        type:[String]
    },
    duration :{
        type:String
    },
    releaseDate : {
        type:Date
    },
    director :{
        type:String
    },
    cast : {
        type:[String]
    },
    description :{
        type:String
    },
    trailerLinks : {
        type:String
    },
    rating : {
        type:Number
    },
    createdAt : {
        type:Date,
        default : Date.now()
    },
    updatedAt : {
        type:String,
        default : Date.now()
    },
    imageUrl : {
        type:String
    },
    languages:{
        type:[String]
    },
    visualEffect : {
        type:String
    },
    isNewRelease : {
        type:Boolean,
        default: true
    },
    certificateType : {
        type:String
    }
})

const movieCollection = mongoose.model('MovieModel',movieSchema)

module.exports = movieCollection