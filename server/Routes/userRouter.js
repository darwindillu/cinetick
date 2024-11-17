const express = require('express')
const UserController = require('../controllers/UserController')

const userRouter = express.Router()

userRouter.post('/login',UserController.UserLogin)
userRouter.post('/verify-otp',UserController.UserVerifyOtp)
userRouter.get('/get-movies-theatres',UserController.GetMoviesAndTheatre)
userRouter.get('/get-movies',UserController.getMovies)
userRouter.get('/get-theatres',UserController.getTheatres)
userRouter.post('/get-specific-theatre',UserController.getSpecificTheatre)
userRouter.post('/get-specific-movie',UserController.getSpecificMovie)
userRouter.post('/get-show-time',UserController.getShowTimes)
userRouter.post('/payment',UserController.bookTicket)
userRouter.post('/search-movies',UserController.searchedMovies  )
userRouter.post('/get-specific-theatre-movies',UserController.getSpecificTheaterMovies  )
userRouter.post('/orders',UserController.fetchOrders  )



module.exports = userRouter