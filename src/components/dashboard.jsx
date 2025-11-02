import React, {useEffect,useState} from 'react'
import { authRequest,getTokens } from '../lib/auth'
const Dasboard =() =>{
    const [state,setState] = useState({
        totalCost :0,
        totalProfit :0,

    })
    const [timeRange,setTimeRange] = useState ('week')
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
     useEffect(()=>{
         if (!getTokens().access) {
            navigate('/login');
            return;
        }
     })

}