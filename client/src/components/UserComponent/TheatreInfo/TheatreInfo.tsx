import React, { useEffect, useState } from 'react';
import './TheatreInfo.css';
import baseUrl from '../../../utils/Url';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TheatreInfo = ({theatreId}:any) => {

  const [movies,setMovies] = useState<any[]>([])
  const navigate = useNavigate()
  
  useEffect(()=>{

    const fetchMovies = async() =>{

        try {
            
            const response = await axios.post(`${baseUrl}api/user/get-specific-theatre-movies`,{theatreId})
            console.log(response,'This is specific thetare movie response');

            if(Array.isArray(response.data.movies)){
                setMovies(response.data.movies)
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }

    fetchMovies()
  },[theatreId])

  const handleMovieClick = (id:string) =>{
    navigate(`/movie?id=${id}`)
  }

  return (
    <div className="movie-container">
      {movies.map(movie => (
        <div key={movie._id} className="movie-item">
          <div className="movie-poster">
            <img src={`${baseUrl}${movie.imageUrl}`} alt={movie.movieName} />
          </div>
          <div className="movie-info">
            <h2 className="movie-title">{movie.movieName}</h2>
            <div style={{display:'block'}}>

            <p style = {{width:20}}  className="movie-language">{movie.languages}</p>
            <p style = {{width:50}} className="movie-genre">{movie.genre}</p>
            </div>
            <div className="movie-rating" style={{marginLeft:20}}>
              <span className="rating-value">{movie.rating}</span>
            </div>
            <div className="show-times">
              <button onClick={()=>handleMovieClick(movie._id)}>Book Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TheatreInfo;