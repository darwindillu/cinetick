const express = require('express')
const {AdminLogin,AdminVerifyOtp, AddTheatres, AddMovies, AddShows}  = require('../controllers/AdminController')
const {authenticateJwt, requireAdmin} = require('../utils/authentication')
const upload = require('../utils/multer')

const AdminRouter = express.Router()

AdminRouter.post('/login',AdminLogin)
AdminRouter.post('/verify-otp',AdminVerifyOtp)
AdminRouter.post('/add-Theatres',authenticateJwt,requireAdmin,upload.single('imageUrl'),AddTheatres)
AdminRouter.post('/add-Movies',authenticateJwt,requireAdmin,upload.single('imageUrl'),AddMovies)
AdminRouter.post('/add-Shows',authenticateJwt,requireAdmin,upload.none(),AddShows)



module.exports = AdminRouter

