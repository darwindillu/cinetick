const mongoose = require('mongoose');

const seatSchema = mongoose.Schema({
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TheatreModal',
    required: true
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShowModel',
    required: true
  },
  seatNumber: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
