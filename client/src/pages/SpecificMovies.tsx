import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import baseUrl from "../utils/Url";
import MovieInfo from "../components/UserComponent/MovieInfo/MovieInfo";
import NavBar from "../components/UserComponent/Navbar/Navbar";
import DateFilter from "../components/UserComponent/DateFilter/DateFilter";
import MovieShowtimes from "../components/UserComponent/MovieShowTimes/MovieShowTimes";
import Footer from "../components/UserComponent/Footer/Footer";

const SpecificMovies = () =>{

    const location = useLocation()
    const [movies,setMovies] = useState<any>({})
    const [movieId,setMovieId] = useState<string> ('')
    const [selectedDate,setSelectedDate] = useState<any>()

    useEffect(()=>{
        const queryParams = new URLSearchParams(location.search)

        const movieId = queryParams.get('id')

        console.log(movieId,'This is movieId');

        if(movieId){
            setMovieId(movieId)
            const fetchMovie = async() =>{

                try {
                    
                    const response = await axios.post(`${baseUrl}api/user/get-specific-movie`,{movieId})
                    console.log(response,'this is movie specific response');
                    
                        setMovies(response.data.data)
                    
                } catch (error) {
                    console.log(error);
                    
                }
            }
            fetchMovie()
        }
        
    },[location.search])
    
    function handleDateSelect(date: any): void {
        setSelectedDate(date)
        console.log(date,'This is selected date');
        
    }

    return (
        <>
        <NavBar />
        <div style={{marginTop:40}}>

        {
            movies &&

            <MovieInfo movie={movies} />       
        }
        </div>
        <div style={{padding:60,marginLeft:100}}>
            <DateFilter handleDateSelect = {handleDateSelect}/>
        </div>
        <div>
        <h4 style={{marginLeft:100,marginBottom:30}}>Now Playing</h4>

            { movieId  && <MovieShowtimes Id={movieId} selectedDate={selectedDate} />}
        </div>
        <div>
            <Footer />
        </div>
        </>
    )
}

export default SpecificMovies;