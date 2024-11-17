import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import NavBar from "../Navbar/Navbar";
import "./Thankyou.css"; // Ensure you import your CSS file
import { useEffect } from "react";

const AfterBooking = () => {

    const navigate = useNavigate()

  const handleOrderClick = () =>[
    navigate('/orders')
  ]

  useEffect(()=>{
    setTimeout(()=>{
        navigate('/')
    },5000)
  },[])
    
  return (
    <div>
      <NavBar />
      <div className="after-booking">
        <div className="booking-main">
        <h2>Your Ticket Booking is Confirmed</h2>
        <p onClick={handleOrderClick}>Go to orders</p>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AfterBooking;
