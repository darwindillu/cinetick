
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Seats.css";
import baseUrl from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import PaymentPage from "../Payment/Payments";
import { io } from 'socket.io-client';

const socket = io(`${baseUrl}`);

const Seats = () => {
  const pricePerSeat = 150; 
  const location = useLocation();
  const { show, theatreName, Id,movieName,dateData } = location.state || {};
  
  const [seats, setSeats] = useState<any[]>([]); 
  const [bookedSeats, setBookedSeats] = useState<number[]>([]); 
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]); 
  const [selectedDate,setSelectedDate] = useState<any>()
  

  useEffect(() => {

    console.log(dateData,'This is props of selectedDate');

    if(dateData){
        setSelectedDate(JSON.stringify(dateData))
    }

        axios
          .get(`${baseUrl}seats/${show}/${theatreName}/${Id}`)
          .then((response) => {
            const seatData = response.data;
              console.log('filteredSeats', seatData);
              
        
              // Group seats into rows
              const seatsPerRow = 10; 
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
    
    
  }, []);

  useEffect(() => {
    console.log(socket, 'socket useEffect');
    
    socket.on('connect', () => {
      socket.emit('setUserId', { email: localStorage.getItem('userEmail') });
  
      // Handle booking confirmation
      socket.on('bookingConfirm', (response) => {
        console.log(response, 'This is booking after response');
  
        if (response.message === 'Booking Confirmed') {
          // Fetch the updated seat data
          axios
            .get(`${baseUrl}seats/${show}/${theatreName}/${Id}`)
            .then((response) => {
              const seatData = response.data;
              console.log('Updated seatData:', seatData);
  
              // Update the seats and bookedSeats state
              const seatsPerRow = 10;
              const groupedSeats = [];
              for (let i = 0; i < seatData.length; i += seatsPerRow) {
                groupedSeats.push(seatData.slice(i, i + seatsPerRow));
              }
  
              setSeats(groupedSeats);
  
              const booked = seatData
                .filter((seat:any) => seat.isBooked)
                .map((seat:any) => seat.seatNumber);
  
              setBookedSeats(booked);
            })
            .catch((error) => {
              console.error('Error fetching seat data after booking:', error);
            });
        }
      });
    });
  
    return () => {
      // Cleanup socket event listeners
      socket.off('bookingConfirm');
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
          <h3>Show Details</h3>
          <p>
            Theatre Name :  <strong>{theatreName}</strong>
          </p>
          <p>
            Show Time :<strong>{show} </strong>
          </p>
          <p>
          Movie Name: <strong> {movieName} </strong>
          </p>
          
          
        </div>
        <div className="details-box" style={{marginTop:-70}}>
          <h3>Seat Details</h3>
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
            selectedSeats.length ? (<PaymentPage data={data} seats={selectedSeats} selectedDate={selectedDate} socket={socket}/>)  : ('')
          }
          
        </div>
      </div>
    </div>
  );
  
};

export default Seats;
