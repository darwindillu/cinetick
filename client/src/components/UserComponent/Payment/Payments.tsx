import React, { useState } from "react";
import axios from "axios";
import baseUrl from "../../../utils/Url";
import { Socket } from "socket.io-client";

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
    socket:Socket
  }

const PaymentPage: React.FC<PaymentPageProps> = ({data,seats,socket}:any) => {


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(data,seats,'This is data props');

  const handlePayment = async () => {
    setIsLoading(true);
    try {

        const totalSeats = seats.length
        const totalAmount = totalSeats * 150 
      // Create a payment order
      const response = await axios.post(`${baseUrl}payment`, {
        amount: totalAmount, // Amount in INR
        currency: "INR",
        receipt: "order_receipt_1", // Optional receipt identifier
      });

      const orderId = response.data.order.id;

      console.log('orderId', orderId)

      // Razorpay payment options
      const options: RazorpayOptions = {
        key: "rzp_test_g9bqvvA6stff0B", // Replace with your Razorpay key
        amount: 50000, // Amount in paise (500 INR)
        currency: "INR",
        name: "Test Company",
        description: "Test Transaction",
        order_id: orderId, // Order ID from backend
        handler: (response) => {
          console.log("Payment success:", response);
        //   axios.post(`${baseUrl}api/user/payment`,{data,seats,response})
        //   .then((response)=>{
        //     console.log(response.data,'This is after response booking ticket');
            
        //   })
        //   .catch((error)=>{
        //     console.log(error,'This is error ');
            
        //   })

          socket.emit('bookSeats',({data,seats,response}))

        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
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
      {isLoading && <p>Loading payment details...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handlePayment} disabled={isLoading}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
