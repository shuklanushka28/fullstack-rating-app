import React, { useEffect, useState } from "react";
import axios from "axios";

const StoreOwnerDashboard = () => {
  const token = localStorage.getItem("token");
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/store-owner/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStores(res.data.stores);
      } catch (err) {
        console.error("❌ Error fetching store owner dashboard", err);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🏬 Store Owner Dashboard</h2>

      {stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        stores.map((store) => (
          <div key={store.id} style={{ marginBottom: "2rem" }}>
            <h3>📍 {store.name}</h3>
            <p>⭐ Average Rating: {store.averageRating}</p>

            <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {store.ratings.length === 0 ? (
                  <tr>
                    <td colSpan="3">No ratings submitted yet.</td>
                  </tr>
                ) : (
                  store.ratings.map((rating) => (
                    <tr key={rating.userId}>
                      <td>{rating.userName}</td>
                      <td>{rating.userEmail}</td>
                      <td>{rating.rating}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
