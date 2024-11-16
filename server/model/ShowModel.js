const mongoose = require('mongoose')

const showSchema = mongoose.Schema({
    movieId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MovieModal'
    },
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TheatreModel'  
    },
    showTimes : {
        type:[String]
    },
    startDate : {
        type:Date
    },
    endDate:{
        type:Date
    }
        
    
})

const showCollection = mongoose.model('ShowModel',showSchema)

module.exports = showCollection