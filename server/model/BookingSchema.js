const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    email: { type:String}, 
    showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true }, 
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true }, 
    seatNumber:[String],
    time: { type: String, required: true },
    bookingDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    bookingStatus: { type: String, enum: ['Completed', 'Cancelled', 'Pending'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    transactionId: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    movieName:{type:String},
    movieImageUrl:{type:String},
    movieCertificate:{type:String},
    movieDuration:{type:String},
    theatreName:{type:String},
    theatreLocation : {type:String},
    theatreCity:{type:String},
    theatreMobile:{type:String},
    bookingDay : {type:String},
    bookingDate: {type:String},
    bookingMonth : {type:String},
  });

  const bookingCollection = mongoose.model('BookingModel',bookingSchema)

  module.exports = bookingCollection