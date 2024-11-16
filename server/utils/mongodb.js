const mongoose = require('mongoose')

const mongoUri = process.env.MONGOOSE_URI

mongoose.connect(mongoUri)
.then(()=>{
    console.log('connected to mongoDB');
})
.catch((err)=>{
    console.log(err);
})

module.exports