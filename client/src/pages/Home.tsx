import React, { useEffect, useState } from 'react';
import './Home.css';
import NavBar from '../components/UserComponent/Navbar/Navbar';
import axios from 'axios';
import baseUrl from '../utils/Url';
import { useNavigate } from 'react-router-dom';
import PaymentComponent from '../components/UserComponent/Payment/Payments';
import Footer from '../components/UserComponent/Footer/Footer';

function App() {
  const [movies, setMovies] = useState<any[]>([]);
  const [theatres, setTheatres] = useState<any[]>([]);
  const [searchedText, setSearchedText] = useState<string>('');
  const [debouncedText, setDebouncedText] = useState<string>('');
  const [searchedMovies, setSearchedMovies] = useState<any[]>([]);
  const [errors, setError] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/user/get-movies`);
        console.log(response.data.data, 'This is movies data');
        if (Array.isArray(response.data.data)) {
          setMovies(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();

    const fetchTheatres = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/user/get-theatres`);
        console.log(response.data.data, 'This is theatre data');

        if (Array.isArray(response.data.data)) {
          setTheatres(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTheatres();
  }, []);

  useEffect(() => {
    const debounceTimeOut = setTimeout(() => {
      setDebouncedText(searchedText);
      setSearchedMovies([])
    }, 300);

    return () => clearTimeout(debounceTimeOut);
  }, [searchedText]);

  useEffect(() => {
    if (debouncedText) {
      const fetchSearchResult = async () => {
        try {
          const response = await axios.post(`${baseUrl}api/user/search-movies`, { debouncedText });
          console.log(response, 'This is searched movies');

          if (response.status === 200) {
            if (Array.isArray(response.data.searchedMovies)) {
              setSearchedMovies(response.data.searchedMovies);
              setError(''); // Clear any previous errors
            }
          } else if (response.status === 404) {
            setError('No movies found for the result');
          }
        } catch (error: any) {
          console.log(error);
          setError('No movies found for the searched Movie Name');
        }
      };
      fetchSearchResult();
    }
  }, [debouncedText]);

  const handleClickMovies = (id: string) => {
    console.log(id, 'This is specific movie id');
    navigate(`/movie?id=${id}`);
  };

  const handleSpecificTheatre = (id: string) => {
    navigate(`/theatre?id=${id}`);
  };

  const handleSearchMovies = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedText(e.target.value);
  };


  return (
    <div>
      {/* Hero Section */}
      <NavBar />
      <header className="hero">
  <div className="hero-overlay">
    <h1>Book Your Movie Experience</h1>
    <p>Find shows, choose seats, and book movies in Trivandrum.</p>
    <div className="search-bar">
      <input
        onChange={handleSearchMovies}
        type="text"
        placeholder="Search for movies, theatres in Trivandrum"
      />
    </div>

    {/* Error message will appear without affecting the layout */}
    {errors && searchedText && <p className="error-message">{errors}</p>}
  </div>
</header>


      {
        searchedMovies && searchedMovies.length > 0 && 

        <section className="now-showing">
        <h2>Searched Movies</h2>
        <div className="movie-grid">
          {searchedMovies.map((movie) => (
            <div className="movie-card" key={movie._id} onClick={() => handleClickMovies(movie._id)}>
              <img
                style={{ height: 200, objectFit: 'fill' }}
                src={`${baseUrl}${movie.imageUrl.replace(/\\/g, '/')}`}
                alt={movie.movieName}
              />
              <h3>{movie.movieName}</h3>
              <p>{movie.genre} | Rating: {movie.rating}</p>
              <button>View Now</button>
            </div>
          ))}
        </div>
      </section>
      }

      {/* Now Showing Section */}
     { searchedMovies.length === 0 && <section className="now-showing">
  <h2>Now Showing in Trivandrum</h2>
  <div className="movie-grid">
    {movies.map((movie) => (
      <div className="movie-card" key={movie._id} onClick={() => handleClickMovies(movie._id)}>
        <img
          style={{ height: 200, objectFit: 'cover' }}
          src={`${baseUrl}${movie.imageUrl.replace(/\\/g, '/')}`}
          alt={movie.movieName}
        />
        <div className="movie-details">
          <h3>{movie.movieName}</h3>
          <p>{movie.genre} | Rating: {movie.rating}</p>
          <button>View Now</button>
        </div>
      </div>
    ))}
  </div>
</section>
}

      {/* Featured Theaters Section */}
      <section className="featured-theaters">
        <h2>Featured Theaters in Trivandrum</h2>
        <div className="theater-carousel">
          {theatres.map((theatre) => (
            <div className="theater-card" onClick={() => handleSpecificTheatre(theatre._id)} key={theatre._id}>
              <img
                style={{ objectFit: 'fill', height: 150, marginTop: 20 }}
                src={`${baseUrl}${theatre.imageUrl.replace(/\\/g, '/')}`}
                alt="Theater 1"
              />
              <h3 style={{ padding: 60, width: 400 }}>{theatre.theatreName}</h3>
              <h6 style={{ padding: 70 }}>Contact Info: {theatre.mobile}</h6>
              <p style={{ padding: 70 }}>
                {`${theatre.state} , ${theatre.city} , ${theatre.location}`}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
