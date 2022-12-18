import Cookies from "js-cookie";
import useDeepEffect from "../../hooks/useDeepEffect";
import { React, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import asyncAPICall from "../../util/apiWrapper";

ChartJS.register(ArcElement, Tooltip, Legend);

export const DataGet = () => {
  const [data, setData] = useState([]);

  asyncAPICall(
    `/devices/get_counts`,
    "GET",
    null,
    null,
    (data) => {
      setData(data);
    },
    (error) => {
      console.log("Unable to get data", error);
    }
  );
};
export const data = {
  labels: ["Unmanaged Assets", "Enrolled in MicroMDM"],
  datasets: [
    {
      label: "Assets Owned vs Assets Managed by MicroMDM",
      data: DataGet(),
      backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
      borderWidth: 1,
    },
  ],
};

const Home = (props) => {
  useDeepEffect(() => {
    let auth_token = Cookies.get("auth_token");

    if (!auth_token) {
      props.history.push("/login");
    }
  }, [props.history]);

  return (
    // className="home-wrapper"
    <div>
      <div>Welcome to Foundation</div>
      <Doughnut data={data} />
    </div>
  );
};

export default Home;
