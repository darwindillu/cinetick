import React from 'react';
import './MovieInfo.css'; // Import your CSS file for styling
import baseUrl from '../../../utils/Url';

const MovieInfo = ({ movie }: any) => {
  return (
    <div className="movie-info">
      <div className="movie-details">
        <h2>{movie.movieName}</h2>
        <ul>
          <li><strong>Certificate:</strong> {movie.certificateType}</li>
          <li><strong>Duration:</strong> {movie.duration} minutes</li>
          <li><strong>Genre:</strong> {Array.isArray(movie.genre) ? movie.genre.join(', ') : 'N/A'}</li>
          <li><strong>Language:</strong> {Array.isArray(movie.languages) ? movie.languages.join(', ') : 'N/A'}</li>
        </ul>
        <div className="movie-actions">
          <a href={movie.trailerLinks} target="_blank" rel="noopener noreferrer">
            <button>Watch Trailer</button>
          </a>
        </div>
      </div>
      <div className="movie-image">
        <img src={`${baseUrl}${movie.imageUrl}`} alt={`${movie.movieName} Poster`} />
      </div>
    </div>
  );
};

export default MovieInfo;
