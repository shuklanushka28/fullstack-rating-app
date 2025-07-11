import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/protected/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setData(res.data.message))
      .catch(() => setData("Unauthorized or error occurred"));
  }, []);

  return <div><h2>Dashboard</h2><p>{data}</p></div>;
};

export default Dashboard;
