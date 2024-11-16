import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import baseUrl from "../utils/Url";

const SpecificTheatres = () =>{

    const [theatres,setTheatres] = useState<any>({})
    const location = useLocation()

    useEffect(()=>{
        const queryParams = new URLSearchParams(location.search)
        const theatreId = queryParams.get('id')
      
        if(theatreId){
            const fetchTheatre = async() =>{

                try {
                    
                    const response = await axios.post(`${baseUrl}api/user/get-specific-theatre`,{theatreId})

                console.log(response,'This is response');

                    setTheatres(response.data.data)
                
                } catch (error) {
                    console.log(error);
                    
                }
                
            }

            fetchTheatre()
        }
    },[location.search])

    return(
        <h1>Hiiiiiiiii {theatres}</h1>
    )
}

export default SpecificTheatres;