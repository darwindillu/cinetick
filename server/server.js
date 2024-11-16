const express = require('express')
const Razorpay = require('razorpay');
require('dotenv').config()
const cors = require('cors')
const utils = require('./utils/mongodb')
const path = require('path')
const AdminRouter = require('./Routes/adminRouter')
const userRouter = require('./Routes/userRouter')
const app = express()
const {Server} = require('socket.io')
const http = require('http')

const Seat = require("./model/seatSchema");
const userCollection = require("./model/UserModel");
const ShowModel = require("./model/ShowModel");
const theatreCollection = require('./model/TheatreModel');
const bookingCollection = require('./model/BookingSchema');
const showCollection = require('./model/ShowModel');


// Replace with your Razorpay credentials
const razorpay = new Razorpay({
    key_id: 'rzp_test_g9bqvvA6stff0B',
    key_secret: 'r8bckrOt5GXI7G0NwvKILfCi',
});

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000', 
      methods: ['GET', 'POST'],
    },
  });

const corsOptions = {
    origin:'*',
    methods:['GET','POST','PUT','PATCH'],
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin',AdminRouter)
app.use('/api/user',userRouter)

let userSocketMap = {};

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
  
    socket.on('setUserId', ({email}) => {
        console.log(email);
        
        userSocketMap[email] = socket.id;
        // await userCollection.findByIdAndUpdate();
        console.log(userSocketMap,'This is user socket map');
    });

    socket.on('bookSeats', async({data,seats,response})=>{
        try {
        
            console.log(data,seats,response, 'This is data for booking');
        
            // Extracting individual fields from data
            const { email, movieId, theatreName } = data;
        
            // Fetch the showId and theatreId
            const theatreId = await theatreCollection.findOne({theatreName:theatreName},{_id:1});
            // if (!theatreId) {
            //   return res.status(404).json({ success: false, message: 'Theatre not found' });
            // }
            const showId = await showCollection.findOne({movieId:movieId,theatreId:theatreId},{_id:1});
            // if (!showId) {
            //   return res.status(404).json({ success: false, message: 'Show not found for the movie' });
            // }
        
      
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
            // if (!transactionId) {
            //   return res.status(400).json({ success: false, message: 'Invalid payment response' });
            // }
        
            // Create the booking document
            const newBooking = new bookingCollection({
              email,
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

            for (const email in userSocketMap) {
                const socketId = userSocketMap[email];
                console.log(socketId, 'This is socketId loop');
                io.to(socketId).emit('bookingConfirm', { message: 'Booking Confirmed' });
            }
        
            // Respond with the booking details
            // res.status(200).json({
            //   success: true,
            //   message: 'Booking successful!',
            //   booking: newBooking,
            // });
        
          } catch (error) {
            console.error(error);
            // res.status(500).json({
            //   success: false,
            //   message: 'Failed to book the ticket. Please try again later.',
            //   error: error.message,
            // });
          }
        
    })
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  
  


app.post('/payment', async (req, res) => {
    const { amount, currency, receipt } = req.body;
  
    try {
      const options = {
        amount: amount * 100, // Convert amount to paise
        currency: currency || 'INR',
        receipt: receipt || 'receipt#1',
      };
  
      const order = await razorpay.orders.create(options);
      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

// Route to get all available seats for a show
// app.get("/api/seats/:showId/:theatreId", async (req, res) => {
//     try {
//       const { showId, theatreId } = req.params;
//       const seats = await Seat.find({ showId, theatreId });
  
//       res.json(seats);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });
  
  // Route to book selected seats
//   app.post("/api/bookSeats", async (req, res) => {
//     const { userId, showId, theatreId, selectedSeats } = req.body;
  
//     if (!userId || !showId || !theatreId || !selectedSeats || selectedSeats.length === 0) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
  
//     try {
//       // Find the user
//       const user = await UserModal.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       // Check if all selected seats are available
//       const seats = await Seat.find({ showId, theatreId, seatNumber: { $in: selectedSeats } });
//       const unavailableSeats = seats.filter(seat => seat.isBooked);
  
//       if (unavailableSeats.length > 0) {
//         return res.status(400).json({
//           message: `Seats ${unavailableSeats.map(seat => seat.seatNumber).join(", ")} are already booked.`,
//         });
//       }
  
//       // Mark selected seats as booked
//       await Seat.updateMany(
//         { showId, theatreId, seatNumber: { $in: selectedSeats } },
//         { $set: { isBooked: true } }
//       );
  
//       // You can also save booking details in a separate booking collection (if needed)
  
//       res.status(200).json({ message: "Seats booked successfully" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });


//   app.get("/:showId/:theatreId", async (req, res) => {
//     const { showId, theatreId } = req.params;
  
//     try {
//       // Fetch the seats associated with the show and theatre, and populate show and theatre details
//       const seats = await Seat.find({ showId, theatreId })
//         .populate("showId", "showName showDate")  // Populate show details
//         .populate("theatreId", "theatreName location") // Populate theatre details
//         .exec();
  
//       if (!seats) {
//         return res.status(404).json({ message: "No seats found for this show and theatre" });
//       }
  
//       // Transform the seats into a grid or return them directly as needed
//       const seatGrid = [];
//       const seatsPerRow = 10; // Define seats per row
//       let row = [];
//       seats.forEach((seat, index) => {
//         row.push(seat);
//         if (row.length === seatsPerRow || index === seats.length - 1) {
//           seatGrid.push(row);
//           row = [];
//         }
//       });
  
//       res.json(seatGrid);
//     } catch (error) {
//       console.error("Error fetching seats:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   });

// app.get("/seats/:show/:theatreName/:id", async (req, res) => {
//     const { show, theatreName, id } = req.params;

//     console.log(show, theatreName, id, '===========');

//     try {
//         // Find the show and theatre objects by name
//         const showObj = await ShowModel.findOne({ movieId: id });
//         const theatreObj = await TheatreModal.findOne({ theatreName });

//         const show = await ShowModel.findOne({
//             movieId: id,
//             theatreId: theatreObj._id
//         });

//         console.log('show', show)

//         if (!showObj || !theatreObj) {
//             return res.status(404).json({ message: "Show or Theatre not found" });
//         }

//         console.log("Found Show:", showObj);
//         console.log("Found Theatre:", theatreObj);

//         // Log the IDs to ensure they are correct
//         console.log("showId:", showObj._id);
//         console.log("theatreId:", theatreObj._id);

//         // Fetch seats based on the showId and theatreId
//         const seats = await Seat.find({ showId: showObj._id, theatreId: theatreObj._id })
//             .populate("showId", "showName showDate")  // Populate show details
//             .populate("theatreId", "theatreName location")  // Populate theatre details
//             .exec();

//         console.log('seats', seats); // Log the seats to see the result

//         if (seats.length === 0) {
//             return res.status(404).json({ message: "No seats found for this show and theatre" });
//         }

//         // Transform the seats into a grid
//         const seatsPerRow = 10; // Define seats per row
//         const seatGrid = seats.reduce((acc, seat, index) => {
//             if (index % seatsPerRow === 0) acc.push([]);  // Start a new row
//             acc[acc.length - 1].push(seat);  // Add seat to the current row
//             return acc;
//         }, []);

//         console.log('seatGrid', seatGrid); // Log the grid result

//         res.json(seatGrid);
//     } catch (error) {
//         console.error("Error fetching seats:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

app.get('/seats/:show/:theatreName/:Id', async (req, res) => {
    try {
      const { show, theatreName, Id } = req.params;
  
  
      // Find the theatre ID
      const theatreId = await theatreCollection.findOne({ theatreName: theatreName }, { _id: 1 });
      if (!theatreId) {
        return res.status(404).json({ error: 'Theatre not found' });
      }
  
  
      // Find the show ID
      const showId = await ShowModel.findOne({ movieId: Id, theatreId:theatreId }, { _id: 1 });
      if (!showId) {
        return res.status(404).json({ error: 'Show not found' });
      }
  
  
      // Fetch all bookings for the show, theatre, and time
      const bookings = await bookingCollection.find({
        showId,
        theatreId,
        time: show, 
      });
      
  
      // Collect all booked seat numbers
      const bookedSeats = bookings.flatMap(booking => booking.seats.seatNumber);

      
  
      // Fetch all seats for the given show and theatre
      const allSeats = await Seat.find({ showId, theatreId }).sort({ seatNumber: 1 });
  
      // Add `isBooked` property to each seat and format the response
      const seatsWithAvailability = allSeats.map(seat => ({
        _id: seat._id,               // MongoDB ID of the seat
        theatreId: seat.theatreId,   // Theatre ID
        showId: seat.showId,         // Show ID
        seatNumber: seat.seatNumber, // Seat Number
        isBooked: bookedSeats.includes(seat.seatNumber), // Check if booked
      }));
  
      res.status(200).json(seatsWithAvailability);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching seat data' });
    }
  });
  

  

server.listen(process.env.PORT,(err)=>{
    if(err){
        console.log(err);
    
    }else{
        console.log(`Server running at ${process.env.PORT}`); 
    }
})