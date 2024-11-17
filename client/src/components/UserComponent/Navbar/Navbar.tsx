import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../../utils/Url';

const NavBar = () => {
  const email = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  const [showMoviesModal, setShowMoviesModal] = useState(false);
  const [showTheatresModal, setShowTheatresModal] = useState(false);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleMovieClick = (id:string) =>{
    navigate(`/movie?id=${id}`)
  }

  const handleTheatreClick = (id:string) =>{
    navigate(`/theatre?id=${id}`)
  }

  const handleOrder = ()=>{
    navigate('/orders')
  }

  useEffect(() => {
    const fetchMoviesAndTheatre = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/user/get-movies-theatres`);
        console.log(response, 'This is navbar response');

        if (Array.isArray(response.data.movies)) {
          setMovies(response.data.movies);
        }

        if (Array.isArray(response.data.theatres)) {
          setTheatres(response.data.theatres);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMoviesAndTheatre();
  }, []);

  const handleHomeClick = ()=>{
    navigate('/')
  }

  return (
    <div className="navbar">
      <div className="logo">
        <img
          src="/logo.jpeg"
          alt="Logo"
          style={{ width: 100, height: 80, marginLeft: 50, objectFit: 'contain' }}
        />
      </div>

      <div className="nav-links">
        <p onClick={handleHomeClick}>Home</p>

        {/* Movies Modal */}
        <div
          className="nav-item"
          onMouseEnter={() => setShowMoviesModal(true)}
          onMouseLeave={() => setShowMoviesModal(false)}
        >
          <p>Movies</p>
          {showMoviesModal && (
            <div className="hover-modal">
              <div className="modal-title"><h2 style={{padding:10}}>Now Playing in Trivandrum</h2></div>
                {movies.map((movie:any, index) => (
              <div className="modal-card" onClick={()=>handleMovieClick(movie._id)}>
                  <div className="movie" key={index}>
                    <img
                      src={`${baseUrl}${movie.imageUrl}`}
                      alt={movie.movieName}
                      className="movie-images"
                    />
                    <div className="movie-info">
                      <div className="movie-title">{movie.movieName}</div>
                      <div className="movie-languages">
                        {movie.languages.join(', ')}
                      </div>
                    </div>
                  </div>
              </div>
                ))}
            </div>
          )}
        </div>

        {/* Theatres Modal */}
        <div
          className="nav-item"
          onMouseEnter={() => setShowTheatresModal(true)}
          onMouseLeave={() => setShowTheatresModal(false)}
        >
          <p >Theatres</p>
          {showTheatresModal && (
            <div className="hover-modal">
              <div className="modal-title"><h2 style={{padding:10}}>Theatres in Trivandrum</h2></div>
                {theatres.map((theatre:any, index) => (
              <div className="modal-card" onClick={()=>handleTheatreClick(theatre._id)}>
                  <div className="theatre" key={index}>
                    <img
                      src={`${baseUrl}${theatre.imageUrl}`}
                      alt={theatre.theatreName}
                      className="theatre-image"
                    />
                    <div className="theatre-info">
                      <div className="theatre-title">{theatre.theatreName}</div>
                      <div className="theatre-location">
                        {theatre.location.toUpperCase()}, {theatre.city}
                      </div>
                    </div>
                  </div>
              </div>
                ))}
            </div>
          )}
        </div>

        <p onClick={handleOrder}>Orders</p>
      </div>

      <div className="user-info">
        <button className="user-button">
          {email ? <span>Hi, {email}</span> : <span onClick={handleLogin}>Login</span>}
          <i className="user-icon"></i>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
