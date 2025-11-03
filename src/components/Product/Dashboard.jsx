import { authRequest,getTokens } from '../../lib/auth';
import React from 'react'
import { Bar } from 'react-chartjs-2';

export default function Dashboard() {
const [chartData, setChartData] = useState({});
useEffect(()=>{
    fetch ('http://127.0.0.1:8000/api/products/')
    .then(response => response.json())
                .then(data => {
                 setChartData({
                        labels: data.labels, 
                        datasets: [
                            {  label: 'My Data',
                                data: data.values, 
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            },
                        ],
                    });
                })
                .catch(error => console.error('Error fetching data:', error));
        }, []);
  return (
    <div>
            {chartData.labels && chartData.datasets && (
                <Bar data={chartData} />
            )}
        </div>
    );
  
}
