import React, { useState } from "react";
import axios from "axios";
import baseUrl from "../../../utils/Url";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface PaymentPageProps {
    data: {
      email: string | null;
      movieId: string;
      theatreName: string;
    };
    seats: number[]; // Array of selected seat numbers
    socket:Socket,
    selectedDate:any
  }

const PaymentPage: React.FC<PaymentPageProps> = ({data,seats,socket,selectedDate}:any) => {


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  console.log(data,seats,'This is data props');

  const handlePayment = async () => {
    setIsLoading(true);
    try {

      // The server prices the order and returns the public Razorpay key
      const response = await axios.post(`${baseUrl}payment`, {
        seatCount: seats.length,
      });

      const { order, keyId } = response.data;

      // Razorpay payment options
      const options: RazorpayOptions = {
        key: keyId,
        amount: order.amount, // Amount in paise, set by the server
        currency: order.currency,
        name: "CineTick",
        description: `${seats.length} ticket(s)`,
        order_id: order.id, // Order ID from backend
        handler: (response) => {
          console.log("Payment success:", response);
        //   axios.post(`${baseUrl}api/user/payment`,{data,seats,response})
        //   .then((response)=>{
        //     console.log(response.data,'This is after response booking ticket');
            
        //   })
        //   .catch((error)=>{
        //     console.log(error,'This is error ');
            
        //   })

          // The server verifies the payment before saving the booking
          socket.once('bookingSuccess', () => {
            socket.off('bookingFailed');
            navigate('/success');
          });
          socket.once('bookingFailed', (result: { message: string }) => {
            socket.off('bookingSuccess');
            setError(result.message);
          });
          socket.emit('bookSeats',({data,seats,response,selectedDate}))
        },
        prefill: {
          name: "",
          email: data.email || "",
          contact: "",
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error creating payment order:", err);
      setError("Failed to create payment order. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button style={{backgroundColor:'white',color:'black',marginLeft:120}} onClick={handlePayment} disabled={isLoading}>
        Pay Now
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};

export default PaymentPage;
