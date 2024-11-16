import React, { useEffect, useState } from 'react';
import './Home.css';
import NavBar from '../components/UserComponent/Navbar/Navbar';
import axios from 'axios';
import baseUrl from '../utils/Url';
import { useNavigate } from 'react-router-dom';
import PaymentComponent from '../components/UserComponent/Payment/Payments';

function App() {

  const [movies,setMovies] = useState<any[]>([])
  const [theatres,setTheatres] = useState<any[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/user/get-movies`);
        console.log(response.data.data, 'This is movies data');
        if(Array.isArray(response.data.data)){

          setMovies(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
  
    fetchMovies();

    const fetchTheatres = async() =>{
      try {
        
        const response = await axios.get(`${baseUrl}api/user/get-theatres`)
        console.log(response.data.data,'This is theatre data');

        if(Array.isArray(response.data.data)){
          setTheatres(response.data.data)
        }
        
      } catch (error) {
        console.log(error);
        
      }
    }

    fetchTheatres()
  }, []);

  const handleClickMovies = (id:string) =>{
    console.log(id,'This is specific movie id');
    
    navigate(`/movie?id=${id}`)
  }

  const handleSpecificTheatre = (id:string) =>{
    navigate(`/theatre?id=${id}`)
  }


  return (
    <div>
      {/* Hero Section */}
      <NavBar />
      <header className="hero">
        <div className="hero-overlay">
          <h1>Book Your Movie Experience</h1>
          <p>Find shows, choose seats, and book movies in Trivandrum.</p>
          <div className="search-bar">
            <input type="date" />
            <input type="text" placeholder="Search movie title" />
            <button>Search</button>
          </div>
        </div>
      </header>

      {/* Now Showing Section */}
      <section className="now-showing">
      <h2>Now Showing in Trivandrum</h2>
      <div className="movie-grid">
        {
          movies.map((movie) => (
            
            <div className="movie-card" key={movie._id} onClick={()=>handleClickMovies(movie._id)}>
              <img style={{height:200,objectFit:'fill'}} src={`${baseUrl}${movie.imageUrl.replace(/\\/g, '/')}`} alt={movie.movieName} />
              <h3>{movie.movieName}</h3>
              <p>{movie.genre} | Rating: {movie.rating}</p>
              <button>Book Now</button>
            </div>
          ))
        }
      </div>
    </section>

      {/* Featured Theaters Section */}
      <section className="featured-theaters">
        <h2>Featured Theaters in Trivandrum</h2>
        <div className="theater-carousel">
          {
            theatres.map((theatre)=>(

          <div className="theater-card" onClick={()=>handleSpecificTheatre(theatre._id)}>
            <img style={{objectFit:'fill',height:150,marginTop:20}} src={`${baseUrl}${theatre.imageUrl.replace(/\/,/)}`} alt="Theater 1" />
            <h3 style={{padding:60, width:400}}>{theatre.theatreName}</h3>
            <h6 style={{padding:70}}>Contact Info : {theatre.mobile}</h6>
            <p style={{padding:70}}>{`${theatre.state} , ${theatre.city} , ${theatre.location}`}</p>
          </div>
            ))
          }
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
        <div className="quick-links">
  <a href="/home">Home</a>
  <a href="/movies">Movies</a>
  <a href="/theaters">Theaters</a>
  <a href="/offers">Offers</a>
  <a href="/contact">Contact Us</a>
</div>
<div className="social-icons">
  <a href="https://facebook.com">Facebook</a>
  <a href="https://twitter.com">Twitter</a>
  <a href="https://instagram.com">Instagram</a>
</div>

          <p>&copy; 2024 Cinema Ticket Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
