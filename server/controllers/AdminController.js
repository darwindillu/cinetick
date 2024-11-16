const jwt = require('jsonwebtoken')
const theatreCollection = require('../model/TheatreModel')
const movieCollection = require('../model/MovieModel')
const showCollection = require('../model/ShowModel')
const Seat = require('../model/seatSchema')


// Admin Login
const AdminLogin = (req, res) => {
  try {
    const { email } = req.body
    const adminEmail = process.env.EMAIL
    
    console.log(adminEmail, 'This is admin Email');
    console.log(email, 'This is user email');
    
    if (email !== adminEmail) {
      return res.status(201).json({ message: 'Email Id is not matching' })
    } else {
      const otpCode = process.env.OTP
      console.log(otpCode, 'This is the otp');
      
      res.status(200).json({ message: `OTP sent to ${email}`, otp: otpCode })
    }
  } catch (error) {
    console.log(error);
  }
}

// Admin Verify OTP
const AdminVerifyOtp = (req, res) => {
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

// // Add Theatre
// const AddTheatres = async (req, res) => {
//   const data = req.body
//   console.log(data, 'This is data');

//   if (req.file) {
//     data.imageUrl = req.file.path; 
//   }

//   if (data.screens && Array.isArray(data.screens)) {
//     data.screens = data.screens.map(screen => ({
//       screenNumber: screen.screenNumber,
//       screenType: screen.screenType,
//       capacity: screen.capacity
//     }));
//   } else {
//     data.screens = [];
//   }

//   try {
//     await theatreCollection.create(data)
//     res.status(200).json('Theatre Added Successfully')
//   } catch (error) {
//     console.log(error);
//     res.status(500).json('Error while adding theatre')
//   }
// }

const AddTheatres = async (req, res) => {
    const data = req.body;
    console.log(data, 'This is data');
  
    // Handle image file upload
    if (req.file) {
      data.imageUrl = req.file.path; 
    }
  
    // Handle screens array if provided
    if (data.screens && Array.isArray(data.screens)) {
      data.screens = data.screens.map(screen => ({
        screenNumber: screen.screenNumber,
        screenType: screen.screenType,
        capacity: screen.capacity
      }));
    } else {
      data.screens = [];
    }
  
    try {
      // Create new theatre in the database
      const newTheatre = await theatreCollection.create(data);
      
      // Generate seats for the new theatre
      const seats = generateSeats(newTheatre._id, newTheatre.totalSeats);
  
      // Save the seats
      await Seat.insertMany(seats);
  
      res.status(200).json('Theatre and Seats Added Successfully');
    } catch (error) {
      console.log(error);
      res.status(500).json('Error while adding theatre');
    }
  };
  
  // Function to generate seats based on the totalSeats provided
  function generateSeats(theatreId, totalSeats) {
    const seats = [];
    
    // Assuming you have some seat layout (e.g., 10 rows, 20 seats per row)
    const rows = 10;  // Modify based on your requirements
    const seatsPerRow = Math.ceil(totalSeats / rows);  // Ensure total seats are distributed across rows
  
    let seatNumber = 1;
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= seatsPerRow; col++) {
        if (seatNumber <= totalSeats) {
          const seat = {
            theatreId,
            seatNumber: `Row-${row} Seat-${col}`, // e.g., "Row-1 Seat-1"
            isBooked: false,
            bookedBy: null,
            bookingDate: null
          };
          seats.push(seat);
          seatNumber++;
        }
      }
    }
    
    return seats;
  }

// Add Movie
const AddMovies = async (req, res) => {
  const data = req.body
  console.log(data, 'This is add movies data')

  if (req.file) {
    data.imageUrl = req.file.path;
  }

  if (data.genre && !Array.isArray(data.genre)) {
    data.genre = data.genre.split(',').map(g => g.trim());
  }
  if (data.languages && !Array.isArray(data.languages)) {
    data.languages = data.languages.split(',').map(lang => lang.trim());
  }

  try {
    await movieCollection.create(data)
    res.status(200).json('Movie added successfully')
  } catch (error) {
    console.log(error);
    res.status(500).json('Error while adding movie')
  }
}

// const AddShows = async(req,res) =>{

//     try {
        
//         const data = req.body
//         console.log(data,'This is data for adding shows');

//         const movieId = await movieCollection.findOne({movieName:data.movieName},{_id:1})
//         console.log(movieId,'This is movie Id');

//         const theatres = await theatreCollection.find({})

//         console.log(theatres,'This is theatre Id');
        
//         let theatreId = [];
//         let theatreNames = []
//         theatres.map((theatre)=>{
//             theatreId.push(theatre._id)
//             theatreNames.push(theatre.theatreName)
//         })

//         const dataToSubmit = {
//             movieId:movieId,
//             theatreId:theatreId,
//             startDate:data.startDate,
//             endDate:data.endDate,
//             showTimes:data.showTimes,
//             theatreNames : theatreNames
//         }

//         await showCollection.create(dataToSubmit)

//         res.status(200).json({message:'Show Added Successfully'})
        

//     } catch (error) {
//         console.log(error);
        
//     }
// }

const AddShows = async (req, res) => {
    try {
      const data = req.body;
      console.log(data, 'This is data for adding shows');
  
      // Find the movie ID by name
      const movie = await movieCollection.findOne({ movieName: data.movieName }, { _id: 1 });
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      // Find the theatre ID by name
      const theatre = await theatreCollection.findOne({ theatreName: data.theatreName }, { _id: 1 });
      if (!theatre) {
        return res.status(404).json({ message: 'Theatre not found' });
      }
  
      // Prepare the data to be inserted for the show
      const dataToSubmit = {
        movieId: movie._id,
        theatreId: theatre._id,
        startDate: data.startDate,
        endDate: data.endDate,
        showTimes: data.showTimes, // Assumes this is an array of show times
      };
  
      // Create the show
      const newShow = await showCollection.create(dataToSubmit);
  
      // Prepare seats for each show time
      const totalSeats = 200; // Total seats per show time
      const seatsPerRow = 10; // Seats per row
      let seatData = []; // Initialize seat data array outside the loop
  
        let seatNumbers = [];
        let row = 'A';
        let seatIndex = 1;
  
        for (let i = 0; i < totalSeats; i++) {
          const seatNumber = `${row}${seatIndex}`; // e.g., A1, A2, ..., J10
          seatNumbers.push(seatNumber);
  
          seatIndex++;
          if (seatIndex > seatsPerRow) {
            seatIndex = 1;
            row = String.fromCharCode(row.charCodeAt(0) + 1); // Move to next row (A -> B -> C)
          }
        }
  
        // Add seats for the current show time to the seat data array
        seatData = seatData.concat(
          seatNumbers.map((seatNumber) => ({
            theatreId: theatre._id,
            showId: newShow._id,
            seatNumber,
          }))
        );
      
  
      // Insert all the seats into the database
      await Seat.insertMany(seatData);
  
      // Send response back
      res.status(200).json({ message: 'Show and Seats Added Successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding show and seats' });
    }
  };
  
  
  

module.exports = { AdminLogin, AdminVerifyOtp, AddTheatres, AddMovies, AddShows }
