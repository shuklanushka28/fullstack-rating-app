import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });

  useEffect(() => {
    // Load stats
    axios.get("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data));

    // Load all users
    axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUsers(res.data.users);
      const owners = res.data.users.filter(u => u.role === "store_owner");
      setStoreOwners(owners);
    });
  }, [token]);

  const handleChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/stores", newStore, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Store created successfully!");
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
    } catch (err) {
      console.error("❌ Store create error:", err);
      alert(err.response?.data?.message || "Store creation failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👩‍💼 Admin Dashboard</h2>
      <p> Total Users: {stats.totalUsers} | Stores: {stats.totalStores} | Ratings: {stats.totalRatings}</p>

      <h3>➕ Add New Store</h3>
      <form onSubmit={handleStoreSubmit} style={{ marginBottom: "2rem" }}>
        <input name="name" placeholder="Store Name" value={newStore.name} onChange={handleChange} required />
        <input name="email" placeholder="Store Email" value={newStore.email} onChange={handleChange} required />
        <input name="address" placeholder="Store Address" value={newStore.address} onChange={handleChange} required />
        <select name="ownerId" value={newStore.ownerId} onChange={handleChange} required>
          <option value="">Select Owner</option>
          {storeOwners.map(owner => (
            <option key={owner.id} value={owner.id}>{owner.name}</option>
          ))}
        </select>
        <button type="submit">Create Store</button>
      </form>

      <h3>👥 All Users</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Address</th><th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
