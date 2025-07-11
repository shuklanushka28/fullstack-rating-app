import React, { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "../components/StarRating"; // ⭐ Import star component

const UserDashboard = () => {
  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("userId"));

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [userRatings, setUserRatings] = useState({}); // Track input per store

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stores", {
          headers: { Authorization: `Bearer ${token}` },
          params: search,
        });
        setStores(res.data.stores);

        // Pre-fill existing ratings
        const initialRatings = {};
        res.data.stores.forEach((store) => {
          const existing = store.ratings.find((r) => r.userId === userId);
          if (existing) {
            initialRatings[store.id] = existing.rating;
          }
        });
        setUserRatings(initialRatings);
      } catch (err) {
        console.error("❌ Error loading stores", err);
      }
    };

    fetchStores();
  }, [token, search, userId]);

  const handleSearch = () => {
    setSearch({ ...search }); // triggers re-fetch
  };

  const handleRatingSubmit = async (storeId, isUpdate) => {
    const rating = parseInt(userRatings[storeId]);

    if (!rating || rating < 1 || rating > 5) {
      return alert("Please select a rating between 1 and 5.");
    }

    try {
      const url = isUpdate
        ? `http://localhost:5000/api/ratings/${storeId}`
        : `http://localhost:5000/api/ratings`;

      const method = isUpdate ? "put" : "post";

      const payload = {
        rating,
        ...(method === "post" && { storeId }),
      };

      const res = await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Rating failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🏪 Store Listings</h2>

      {/* 🔍 Search */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Search by name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <input
          placeholder="Search by address"
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* 📋 Store Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Owner</th>
            <th>Avg Rating</th>
            <th>Your Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.length === 0 ? (
            <tr>
              <td colSpan="5">No stores found.</td>
            </tr>
          ) : (
            stores.map((store) => {
              const existing = store.ratings.find((r) => r.userId === userId);
              const isUpdate = !!existing;

              return (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.address}</td>
                  <td>{store.ownerName || "—"}</td>
                  <td>{store.averageRating}</td>
                  <td>
                    <StarRating
                      value={parseInt(userRatings[store.id]) || 0}
                      onChange={(val) =>
                        setUserRatings({ ...userRatings, [store.id]: val })
                      }
                    />
                    <button onClick={() => handleRatingSubmit(store.id, isUpdate)}>
                      {isUpdate ? "Update" : "Submit"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
