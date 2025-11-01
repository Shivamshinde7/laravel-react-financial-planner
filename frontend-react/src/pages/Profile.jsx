import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setUser(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone_number: response.data.phone_number || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/user/profile/update/${user.id}`, formData);

      setUser(response.data);
      setEditing(false);
      alert("Profile updated successfully!");
    }catch (error) {
  if (error.response) {
    console.error("Validation Error:", error.response.data);
    alert(JSON.stringify(error.response.data, null, 2));
  } else {
    console.error("Error updating profile:", error);
  }
}

  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Profile</h2>

        {/* View Mode */}
        {!editing ? (
          <div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Full Name</p>
                <p className="text-lg font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-lg font-medium">
                  {user?.phone_number || "Not added"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Phone</label>
            <input
  type="text"
  name="phone_number"
  value={formData.phone_number}
  onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"

/>

            </div>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
