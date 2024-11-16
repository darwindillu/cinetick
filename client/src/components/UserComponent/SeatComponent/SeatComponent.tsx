
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Seats.css";
import baseUrl from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import PaymentPage from "../Payment/Payments";
import { io } from 'socket.io-client';

const socket = io(`${baseUrl}`);

const Seats = () => {
  const pricePerSeat = 150; // Price per seat
  const location = useLocation();
  const { show, theatreName, Id } = location.state || {};
  console.log(4545,show, theatreName, Id );
  

  // States
  const [seats, setSeats] = useState<any[]>([]); // To store seat data fetched from the backend
  const [bookedSeats, setBookedSeats] = useState<number[]>([]); // Booked seats
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]); // Selected seats

//   // Fetch seat data from the backend
//   useEffect(() => {
//     // Replace with your API endpoint that returns seat data
//     axios
//       .get(`${baseUrl}seats/${show}/${theatreName}/${Id}`)
//       .then((response) => {
//         const seatData = response.data; // Assuming the response returns seat data in a suitable structure
//         console.log('seatData',seatData)
//         setSeats(seatData);
//       })
//       .catch((error) => {
//         console.error("Error fetching seat data:", error);
//       });
//   }, [show, theatreName]);

  useEffect(() => {

    
    axios
      .get(`${baseUrl}seats/${show}/${theatreName}/${Id}`)
      .then((response) => {
        const seatData = response.data;
        console.log('seatData:', seatData);  // Log the response data for debugging
        // const transformedSeatData = seatData.map((row:any) => {
        //     if (!Array.isArray(row)) {
        //       return []; // Return an empty array if the row is not an array
        //     }
        //     return row; // Otherwise, return the row as-is
        //   });
        // const filteredSeats = seatData.filter(
        //     (seat: any) => seat.movieId === Id
        //   );

          console.log('filteredSeats', seatData);
          
    
          // Group seats into rows
          const seatsPerRow = 10; // Define the number of seats in a row
          const groupedSeats = [];
          for (let i = 0; i < seatData.length; i += seatsPerRow) {
            groupedSeats.push(seatData.slice(i, i + seatsPerRow));
          }
    
          setSeats(groupedSeats);
    
          // Pre-select booked seats
          const booked = seatData
            .filter((seat: any) => seat.isBooked)
            .map((seat: any) => seat.seatNumber);
          setBookedSeats(booked);
      })
      .catch((error) => {
        console.error("Error fetching seat data:", error);
      });
  }, [show, theatreName]);

  useEffect(() => {

    console.log(socket,'socket useEffect');
    
    socket.on('connect', () => {
        // Emit user ID to server

        socket.emit('setUserId', { email: localStorage.getItem('userEmail') });
        // Set socket ID in the Redux store

        socket.on('bookingConfirm',(response)=>{
            console.log(response,'This is booking after response');
            
            if(response.message === 'Booking Confirmed'){
                axios
                .get(`${baseUrl}seats/${show}/${theatreName}/${Id}`)
                .then((response) => {
                  const seatData = response.data;
                  console.log('seatData:', seatData);  // Log the response data for debugging
                  // const transformedSeatData = seatData.map((row:any) => {
                  //     if (!Array.isArray(row)) {
                  //       return []; // Return an empty array if the row is not an array
                  //     }
                  //     return row; // Otherwise, return the row as-is
                  //   });
                  // const filteredSeats = seatData.filter(
                  //     (seat: any) => seat.movieId === Id
                  //   );
          
                    console.log('filteredSeats', seatData);
                    
              
                    // Group seats into rows
                    const seatsPerRow = 10; // Define the number of seats in a row
                    const groupedSeats = [];
                    for (let i = 0; i < seatData.length; i += seatsPerRow) {
                      groupedSeats.push(seatData.slice(i, i + seatsPerRow));
                    }
              
                    setSeats(groupedSeats);
              
                    // Pre-select booked seats
                    const booked = seatData
                      .filter((seat: any) => seat.isBooked)
                      .map((seat: any) => seat.seatNumber);
                    setBookedSeats(booked);
                })
                .catch((error) => {
                  console.error("Error fetching seat data:", error);
                });
            }
        })
      });

    
  
    return () => {
      socket.off('seatBooked');
    };
  }, []);
  
  
  

  // Toggle seat selection
  const toggleSeatSelection = (seatNumber: number | null) => {
    if (!seatNumber) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats((prev) => prev.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats((prev) => [...prev, seatNumber]);
    }
  };

  // Book selected seats
  const bookSeats = () => {
    setBookedSeats((prev) => [...prev, ...selectedSeats]);
    setSelectedSeats([]);
    alert("Seats successfully booked!");
  };

  const data = {
    email:localStorage.getItem('userEmail'),
    movieId:Id,
    theatreName:theatreName,
    show: show
  }

  // Calculate total amount
  const totalAmount = selectedSeats.length * pricePerSeat;

  return (
    <div className="seats-container">
      <div className="left-section">
        <div className="screen">Screen</div>
        <div className="seating-grid">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((seat: any, colIndex: any) => (
                <div
                  key={seat._id}
                  className={`seat ${
                    bookedSeats.includes(seat.seatNumber)
                      ? "booked"
                      : selectedSeats.includes(seat.seatNumber)
                      ? "selected"
                      : "available"
                  }`}
                  onClick={() =>
                    !bookedSeats.includes(seat.seatNumber) &&
                    toggleSeatSelection(seat.seatNumber)
                  }
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="right-section">
        <div className="details-box">
          <h3>Selected Seats</h3>
          <p>
            <strong>Seats: </strong>
            {selectedSeats.join(", ")}
          </p>
          <p>
            <strong>Total Seats: </strong>
            {selectedSeats.length}
          </p>
          <p>
          <strong>Total Amount: </strong>₹{totalAmount}
          </p>
          {
            selectedSeats.length && <PaymentPage data={data} seats={selectedSeats} socket={socket}/>
          }
          
        </div>
      </div>
    </div>
  );
  
};

export default Seats;
