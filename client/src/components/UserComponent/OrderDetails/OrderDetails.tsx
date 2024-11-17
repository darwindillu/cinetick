import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import NavBar from "../Navbar/Navbar";
import './OrderDetails.css'
import axios from "axios";
import baseUrl from "../../../utils/Url";

const OrderDetails = () => {
  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');

    const fetchOrders = async () => {
      try {
        const response = await axios.post(`${baseUrl}api/user/orders`, { email });
        console.log(response, 'This is order response');
        
        if (Array.isArray(response.data.orders)) {
          setOrderData(response.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="order-header">
        <h2>My Bookings</h2>
      </div>
      <div className="orders-container">
        {orderData.map((order: any, index: any) => (
          <div key={order._id} className="order-card">
            <div className="order-row">
              <img 
                src={`${baseUrl}${order.movieImageUrl}`} 
                alt={order.movieName} 
                className="order-poster" 
              />
              <div className="order-details">
                <h3>Movie Name: {order.movieName}</h3>
                <p>Booking Date : {order.bookingDay},{order.bookingDate} {order.bookingMonth}</p>
                <p>Seat Numbers : {order.seatNumber}</p>

                <div className="order-status">
                  <span className="status-icon">✅</span>
                  <span className="status-text">Booking {order.bookingStatus}</span>
                </div>
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:50}}>

      <Footer />
      </div>
    </div>
  );
};

export default OrderDetails;
