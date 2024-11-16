import React     from 'react';
import './MovieInfo.css'; // Import your CSS file for styling
import baseUrl from '../../../utils/Url';

const MovieInfo = ({ movie }:any) => {
  return (
    <div className="movie-info">
      <div className="movie-details">
        <h2 style={{color:'#002d6b'}}>{movie.movieName}</h2>
        <ul>
          <li><strong>UA:</strong> {movie.rating}</li>
          <li><strong>Duration:</strong> {movie.duration}</li>
          <li><strong>Genre:</strong> {movie.genres}</li>
          <li><strong>Language:</strong> {movie.language}</li>
        </ul>
        <div className="movie-actions">
        <button>Watch Trailer</button>
      </div>
      </div>
      <div className="movie-image">
      <img src={`${baseUrl}${movie.imageUrl}`} alt="" />

      </div>
    </div>
  );
};

export default MovieInfo;