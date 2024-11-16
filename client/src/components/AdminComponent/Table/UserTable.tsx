import React, { useEffect, useState } from 'react';
import './UserTable.css';
import axios from 'axios';
import baseUrl from '../../../utils/Url';

interface Column {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
  role: string;
}

const Table: React.FC<TableProps> = ({ columns, data, role }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [file, setFile] = useState<File | null>(null);
  
    useEffect(() => {
      setShowModal(false);
    }, [role]);
  
    const toggle = () => {
      setShowModal(!showModal);
    };
  
    const closeModal = () => {
      setShowModal(false);
      setFormData({});
      setFile(null);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    };
  
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      
        const dataToSubmit = new FormData();
        dataToSubmit.append('role', role);
      
        // Append the file if it exists
        if (file) {
            console.log(file,'This is file');
            
          dataToSubmit.append('imageUrl', file);
        }
      
        // Append other form data
        Object.entries(formData).forEach(([key, value]) => {
          dataToSubmit.append(key, value);
        });
      
        // Log form data to verify entries
        dataToSubmit.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });
      
        try {

              const response = await axios.post(`${baseUrl}api/admin/add-${role}`, dataToSubmit, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
              console.log('Form submitted:', response.data);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          closeModal();
        }
      };
      


  // Define different forms based on role
  const getModalContent = () => {
    switch (role) {
      case 'Theatres':
        return (
          <form onSubmit={handleFormSubmit} className="theatre-form">
            <label className="form-label">
              Theatre Name:
              <input
                type="text"
                name="theatreName"
                value={formData.theatreName || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Location:
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Phone Number:
              <input
                type="tel"
                name="mobile"
                value={formData.mobile || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Total Seats:
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Image URL:
              <input
                type="file"
                name="imageUrl"
                onChange={handleFileInput}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              State:
              <input
                name="state"
                value={formData.state || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              City:
              <input
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <button type="submit" className="submit-button">Add Theatre</button>
          </form>
        );
  
      case 'Movies':
        return (
          <form onSubmit={handleFormSubmit} className="movie-form">
            <label className="form-label">
              Movie Title:
              <input
                type="text"
                name="movieName"
                value={formData.movieName || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Genre (comma separated):
              <input
                type="text"
                name="genre"
                value={formData.genre || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Duration (in minutes):
              <input
                type="text"
                name="duration"
                value={formData.duration || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Release Date:
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Director:
              <input
                type="text"
                name="director"
                value={formData.director || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Cast (comma separated):
              <input
                type="text"
                name="cast"
                value={formData.cast || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Description:
              <input
                type="text"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Trailer Links:
              <input
                type="text"
                name="trailerLinks"
                value={formData.trailerLinks || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Rating:
              <input
                type="text"
                name="rating"
                value={formData.rating || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Image URL:
              <input
                type="file"
                name="imageUrl"
                onChange={handleFileInput}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Languages (comma separated):
              <input
                type="text"
                name="languages"
                value={formData.languages || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Visual Effect:
              <input
                type="text"
                name="visualEffect"
                value={formData.visualEffect || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Certificate Type:
              <input
                type="text"
                name="certificateType"
                value={formData.certificateType || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <button type="submit" className="submit-button">Add Movie</button>
          </form>
        );
  
      case 'Shows':
        return (
          <form onSubmit={handleFormSubmit} className="screen-form">
            <label className="form-label">
              Movie Name:
              <input
                type="text"
                name="movieName"
                value={formData.movieName || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>

            <label className="form-label">
              Theatre Name:
              <input
                type="text"
                name="theatreName"
                value={formData.theatreName || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Show Times (comma separated):
              <input
                type="text"
                name="showTimes"
                value={formData.showTimes || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              Start Date:
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <label className="form-label">
              End Date:
              <input
                type="date"
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
  
            <button type="submit" className="submit-button">Add Shows</button>
          </form>
        );
  
      default:
        return <p>No form available for this role.</p>;
    }
  };
  

  return (
    <>
      {role !== 'Users' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn"
            style={{
              backgroundColor: '#483D8B',
              color: 'white',
            }}
            onClick={toggle}
          >
            ADD {role.toUpperCase()}
          </button>
        </div>
      )}

      {showModal ? (
        <div>
          <div >
            <h2>Add {role}</h2>
            {getModalContent()}
            <button className="btn btn-primary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Table;
