import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/pages/Home'
import AdminLogin from './components/AdminComponent/Login/AdminLogin';
import './index.css'
import AdminHome from './components/AdminComponent/Home/AdminHome';
import SpecificMovies from './pages/SpecificMovies';
import SpecificTheatres from './pages/SpecificTheatre';
import SeatComponent from './components/UserComponent/SeatComponent/SeatComponent';
import UserLoginPage from './pages/UserLogin.';
import ProtectedRoutes from './components/UserComponent/UserRouterProtect/UserRouterProtect'; 
// const showId = 1; // Example showId
// const theatreId = 1; // Example theatreId
// const userId = 123; // Example userId
const email = localStorage.getItem('userEmail')

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<UserLoginPage />} />
        <Route

          path="/seat"
          element={<ProtectedRoutes><SeatComponent /></ProtectedRoutes>}
        />
        <Route path="/movie" element={<SpecificMovies />} />
        <Route path="/theatre" element={<SpecificTheatres />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path='/admin-home' element={<AdminHome />} />
      </Routes>
    </Router>
  );
}

export default App;
