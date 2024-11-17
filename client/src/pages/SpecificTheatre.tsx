import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import baseUrl from "../utils/Url";
import NavBar from "../components/UserComponent/Navbar/Navbar";
import TheatreInfo from "../components/UserComponent/TheatreInfo/TheatreInfo";
import Footer from "../components/UserComponent/Footer/Footer";

const SpecificTheatres = () => {
  const [theatres, setTheatres] = useState<any>({});
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const theatreId = queryParams.get("id");

    if (theatreId) {
      const fetchTheatre = async () => {
        try {
          const response = await axios.post(`${baseUrl}api/user/get-specific-theatre`, { theatreId });
          console.log(response, "This is response");
          setTheatres(response.data.data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchTheatre();
    }
  }, [location.search]);

  // Render loading message or actual content if theatres data exists
  if (!theatres || Object.keys(theatres).length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
        <div>
            <NavBar />
        </div>
      {/* <h2>{theatres.theatreName}</h2>
      <p>Contact: {theatres.mobile}</p>
      <p>Location: {theatres.state}, {theatres.city}, {theatres.location}</p> */}
      <img
        style={{ objectFit: 'fill', width: "100%", height: "350px",marginTop:1 }}
        src={`${baseUrl}${theatres.imageUrl.replace(/\\/g, "/")}`}
        alt={theatres.theatreName}
      />

      <div>
        <h2 style={{marginLeft:170,padding:50}}>{theatres.theatreName.toUpperCase()} , {theatres.location.toUpperCase()} , {theatres.city} , {theatres.state}</h2>
        <h6 style={{marginLeft:217,marginTop:-30}}><strong>Contact Info :</strong>{theatres.mobile}</h6>
      </div>

      <div style={{marginTop:100, width:'60%',marginLeft:250}}>
        <h4 style={{padding:10,fontWeight:'bold'}}>Movies Playing in this theatre</h4>
        <TheatreInfo theatreId = {theatres._id} />
      </div>
      <div style={{marginTop:50}}>
        <Footer />
      </div>
    </div>
  );
};

export default SpecificTheatres;
