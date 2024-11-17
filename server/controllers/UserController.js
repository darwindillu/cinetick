const bookingCollection = require("../model/BookingSchema");
const movieCollection = require("../model/MovieModel");
const Seat = require("../model/seatSchema");
const showCollection = require("../model/ShowModel");
const theatreCollection = require("../model/TheatreModel");
const UserCollection = require("../model/UserModel");
const jwt = require('jsonwebtoken')

const UserLogin = async(req, res) => {
    try {
      const { email } = req.body
      
      console.log(email, 'This is user email');

      const existingEmail = await UserCollection.findOne({email:email})

      if(existingEmail){
        res.status(201).json({message:'Email Already Existed'})
      }
      
      
        const otpCode = process.env.OTP
        console.log(otpCode, 'This is the otp');
        
        res.status(200).json({ message: `OTP sent to ${email}`, otp: otpCode })
      
    } catch (error) {
      console.log(error);
    }
  }
  
  // Admin Verify OTP
  const UserVerifyOtp = (req, res) => {
    try {
      const { otp, email } = req.body
      const existingOtp = process.env.OTP
  
      console.log(otp, 'This is otp verify');
      console.log(existingOtp, 'This is existing otp');
      
      if (otp !== existingOtp) {
        return res.status(201).json({ message: 'Incorrect OTP' })
      } else {
        const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY })
        const refreshToken = jwt.sign({ email }, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRY })
        
        return res.status(200).json({ message: 'OTP verified successfully', AccessToken: accessToken, RefreshToken: refreshToken })
      }
    } catch (error) {
      console.log(error);
    }
  }

const getMovies = async(req,res) =>{

    try {
        const movies = await movieCollection.find({})

        res.status(200).json({data:movies})
    } catch (error) {
        console.log(error);
        
    }
}

const getTheatres = async(req,res) =>{

    try {
        
        const theatres = await theatreCollection.find({})

        res.status(200).json({data:theatres})
    } catch (error) {
        console.log(error);
        
    }
}

const getSpecificTheatre = async(req,res) =>{

    try {
        
        const {theatreId} = req.body

        console.log(theatreId,'This is theatreId');

        const theatre = await theatreCollection.findOne({_id:theatreId})

        res.status(200).json({data:theatre})
        
    } catch (error) {
        console.log(error);
        
    }
}

const getSpecificMovie = async(req,res) =>{

    try {
        
        const {movieId} = req.body

        console.log(movieId,'This is movieId');

        const movie = await movieCollection.findOne({_id:movieId})

        res.status(200).json({data:movie})
        
    } catch (error) {
        console.log(error);
        
    }
}

const getShowTimes = async (req, res) => {
    try {
        const { Id: movieId } = req.body; // Extract movieId from request body
        console.log({ movieId }, 'This is movieId');

        const movieName = await movieCollection.findOne({_id:movieId},{movieName:1})

        // Fetch all show times for the given movie ID
        const showTimes = await showCollection.find({ movieId });
        console.log(showTimes, 'this is shows');

        if (!showTimes || showTimes.length === 0) {
            return res.status(404).json({ message: 'Show times not found' });
        }

        // Create a list of theatreIds from showTimes
        const theatreIds = showTimes.map(show => show.theatreId);

        // Fetch theatre names for the collected theatreIds
        const theatres = await theatreCollection.find(
            { _id: { $in: theatreIds } },
            { theatreName: 1 }
        );
        console.log(theatres, 'This is theatreNames');

        // Map theatreId to theatreName for easier access
        const theatreMap = theatres.reduce((map, theatre) => {
            map[theatre._id.toString()] = theatre.theatreName;
            return map;
        }, {});

        // Create the final result with showTimes and corresponding theatre names
        const result = showTimes.map(show => ({
            showTimes: show.showTimes[0].split(','),
            theatreName: theatreMap[show.theatreId.toString()] || 'Unknown Theatre',
            startDate: show.startDate,
            endDate: show.endDate,
        }));

        console.log(result, 'This is the final result');
        res.status(200).json({ showTimes: result, movieName:movieName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const bookTicket = async (req, res) => {
    try {
      const { data, seats, response } = req.body;
      if (!data || !seats || !response) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request: Missing required fields',
        });
      }
  
      console.log(data,seats,response, 'This is data for booking');
  
      // Extracting individual fields from data
      const { userId, movieId, theatreName } = data;
  
      // Fetch the showId and theatreId
      const theatreId = await theatreCollection.findOne({theatreName:theatreName},{_id:1});
      if (!theatreId) {
        return res.status(404).json({ success: false, message: 'Theatre not found' });
      }
      const showId = await showCollection.findOne({movieId:movieId,theatreId:theatreId},{_id:1});
      if (!showId) {
        return res.status(404).json({ success: false, message: 'Show not found for the movie' });
      }
  

      if(showId && theatreId){
        console.log(showId,theatreId,'This is idsssss');
        
      }
  
      const seatDetails = {
          seatNumber:seats,
      }
  
      // Calculate the total amount
      const totalAmount = seats.length * 150;
  
      // Ensure the transactionId is valid
      const transactionId = response.razorpay_payment_id;
      if (!transactionId) {
        return res.status(400).json({ success: false, message: 'Invalid payment response' });
      }
  
      // Create the booking document
      const newBooking = new bookingCollection({
        userId,
        showId,
        theatreId,
        seats: seatDetails,
        totalAmount,
        transactionId,
        bookingStatus: 'Completed', 
        paymentStatus: 'Paid', 
        time:data.show

      });
  
      // Save the booking
      await newBooking.save();
  
      // Respond with the booking details
      res.status(200).json({
        success: true,
        message: 'Booking successful!',
        booking: newBooking,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to book the ticket. Please try again later.',
        error: error.message,
      });
    }
  };
  

  const GetMoviesAndTheatre = async(req,res) =>{

    try {
        
        const movies = await movieCollection.find({})

        const theatres = await theatreCollection.find({})

        if(movies && theatres){
            res.status(200).json({movies:movies,theatres:theatres})
        }
    } catch (error) {
        console.log(error);
        
    }
  }

  const searchedMovies = async(req,res) =>{

    try {
        
        const data = req.body
        console.log(data,'This is searchedText');

        const movies = await movieCollection.find({
            movieName: { $regex: data.debouncedText, $options: "i" } // Case-insensitive regex search
          });

          console.log(movies,'This is movies after search');

          if(movies.length > 0){
            res.status(200).json({searchedMovies:movies})
          }else{
            res.status(404).json({message:'No movies found for the result'})
          }
          
        
    } catch (error) {
        console.log(error);
        
    }
  }

  const getSpecificTheaterMovies = async(req,res) =>{

    try {
        
        const {theatreId} = req.body
        console.log(theatreId,'This is specific theatre Id');
          
        const movieId = await showCollection.find({theatreId:theatreId},{movieId:1})
        console.log(movieId,'This is movie Id');

        const movieIds = movieId.map((movie)=> movie.movieId)

        const movies = await movieCollection.find({_id:{$in:movieIds}})

        console.log(movies, 'this is movies');

        res.status(200).json({movies:movies})
        
        
    } catch (error) {
        console.log(error);
        
    }
  }

  const fetchOrders = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email, 'This is orders email');

        const bookingData = await bookingCollection.find({ email: email });

        

        res.status(200).json({ orders: bookingData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error occurred' });
    }
};


module.exports = {getMovies,getTheatres,getSpecificTheatre,getSpecificMovie,getShowTimes,bookTicket,UserLogin,UserVerifyOtp,GetMoviesAndTheatre,searchedMovies,getSpecificTheaterMovies,fetchOrders}