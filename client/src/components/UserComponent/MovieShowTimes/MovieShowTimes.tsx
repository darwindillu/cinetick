import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import './MovieShowTimes.css'; // Import your CSS file for styling
import axios from 'axios';
import baseUrl from '../../../utils/Url';

const MovieShowtimes = ({ Id,selectedDate }: any) => {
  const [showTimes, setShowTimes] = useState<any>([]);
  const navigate = useNavigate(); // Initialize navigate
  const [movieName,setMovieName] = useState<string>('')

  useEffect(() => {
    console.log(Id, 'this is id');

    const fetchShows = async () => {
      try {
        const response = await axios.post(`${baseUrl}api/user/get-show-time`, { Id });
        console.log(response.data, 'This is response for fetching show times');
        setShowTimes(response.data.showTimes);
        setMovieName(response.data.movieName.movieName)
      } catch (error) {
        console.log(error);
      }
    };

    fetchShows();
  }, [Id]);

  const handleShowTimeClick = (show: string, theatreName: string) => {
    // Navigate to the seat booking page with state
    const dateData = {
      day:selectedDate.day,
      date:selectedDate.date,
      month:selectedDate.month
    }
    navigate('/seat', {
      state: { show, theatreName, Id,movieName,dateData }
    });
  };

  return (
    <div className="showtimes-container">
      {showTimes.length > 0 && showTimes.map((theater: any, index: number) => (
        <div key={index} className="showtime-card">
          {theater.theatreName && (
            <div className="showtime-details">
              <div className="theatre-name">{theater.theatreName}</div>
              <div className="showtime-list">
                {theater.showTimes && theater.showTimes.map((show: string, j: number) => (
                  <div
                    key={j}
                    className="showtime-button"
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
