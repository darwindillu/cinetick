import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import './MovieShowTimes.css'; // Import your CSS file for styling
import axios from 'axios';
import baseUrl from '../../../utils/Url';

const MovieShowtimes = ({ Id }: any) => {
  const [showTimes, setShowTimes] = useState<any>([]);
  const [showId, setShowId] = useState<any>([]); // It's not clear if `showId` is needed in the logic
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    console.log(Id, 'this is id');

    const fetchShows = async () => {
      try {
        const response = await axios.post(`${baseUrl}api/user/get-show-time`, { Id });
        console.log(response.data.showTimes, 'This is response for fetching show times');
        setShowTimes(response.data.showTimes);
        setShowId(response.data); // You can remove this if you're not using it
      } catch (error) {
        console.log(error);
      }
    }

    fetchShows();
  }, [Id]);

  const handleShowTimeClick = (show: string, theatreName: string) => {
    // Navigate to the seat booking page with state
    navigate('/seat', {
      state: { show, theatreName, Id }
    });
  }

  return (
    <div className="movie-show">
      {showTimes.length > 0 && showTimes.map((theater: any, index: number) => (
        <div key={index} className="movie-card">
          {theater.theatreName && (
            <div className="movie-container">
              <div className="movie-name">{theater.theatreName}</div>
              <div className="movie-showtimes">
                {theater.showTimes && theater.showTimes.map((show: string, j: number) => (
                  <div
                    key={j}
                    className="showtime"
                    onClick={() => handleShowTimeClick(show, theater.theatreName)}
                  >
                    {show.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MovieShowtimes;
