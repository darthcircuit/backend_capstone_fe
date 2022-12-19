import Cookies from "js-cookie";
import useDeepEffect from "../../hooks/useDeepEffect";
import { React, useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import DataTable from "react-data-table-component";

import asyncAPICall from "../../util/apiWrapper";

ChartJS.register(ArcElement, Tooltip, Legend);

export function useCurrentCounts() {
    let [currentCounts, setCurrentCounts] = useState({});
    useEffect(()=> {
      asyncAPICall(`/devices/get_counts`, "GET", null, null, (counts) => {
        setCurrentCounts(counts);

      });
    },[])
  return currentCounts;
}

const Home = (props) => {
  const columns = [
    {
        name: 'Person',
        selector: row => row.person,
    },
    {
        name: 'Serial Number',
        selector: row => row.serial,
    },
];

  const currentCounts = useCurrentCounts();
  const enrollmentData = {
    labels: ["Not Enrolled", "Enrolled in MicroMDM"],
    datasets: [
      {
        label: "Total Devices Enrolled in MDM",
        data: currentCounts[0],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };
  useDeepEffect(() => {
    let auth_token = Cookies.get("auth_token");

    if (!auth_token) {
      props.history.push("/login");
    }
  }, [props.history]);

  return (
    // className="home-wrapper"
    <div>
      <div>
        {/* <h1>Welcome to Foundation</h1> */}
        </div>
      <div className="charts" style={{display:"flex",}}>

      <div className="enrollments-chart" style={{width:"500px", "margin-right":'100px', display:'flex', 'flex-direction':'column'}}>
        <h2 style={{"align-self":'center'}}>Total Devices Managed by MDM</h2> 
      <Doughnut data={enrollmentData} />
      </div>

      <div className="annoy-people-table" style={{display:'flex', 'flex-direction':'column'}}>
<h2>
             People to Annoy about getting enrolled
          </h2>
      <div>

      <DataTable
        columns={ columns }
        data = {currentCounts[1]}
        // title={
          
          // }
          />
          </div>
      </div>

      </div>


    </div>
  );
};

export default Home;
