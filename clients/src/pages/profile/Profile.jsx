// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserData } from '../../redux/userDataSlice';

// const Profile = () => {
//   const dispatch = useDispatch();
//   const { userData, loading, error } = useSelector((state) => state.userData);
//   console.log(userData);

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     if (userId) {
//       dispatch(fetchUserData(userId));
//     }
//   }, [dispatch]);

//   const userId = localStorage.getItem('userId');
//   if (loading) return <p>Loading profile...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!userData || (!userData.id && !userData._id)) {
//     console.log('userData is null or missing id:', userData);
//     return <p>No profile data found.</p>;
//   }
//   if ((userData.id && userData.id !== userId) && (userData._id && userData._id !== userId)) {
//     console.log('User ID does not match profile:', userData, userId);
//     return <p>User ID does not match profile.</p>;
//   }

//   return (
//     <div className="container mt-4">
//       <h2>User Profile</h2>
//       <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
//       <p><strong>Email:</strong> {userData.email}</p>
//       <p><strong>Phone:</strong> {userData.phone}</p>
//       <p><strong>Status:</strong> {userData.status}</p>
//       <p><strong>Role:</strong> {userData.role?.roleName}</p>
//       {/* Add more fields as needed */}
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/config";

const Profile = () => {
  const [user, setUser] = useState(null);
  const userObj = JSON.parse(localStorage.getItem("user"));
  const userId = userObj?.id; // or userObj?._id based on your schema
  const token = localStorage.getItem("token");
  // console.log("User ID:", userId);
  // console.log("Token:", token);
  // console.log("User Object:", userObj);
  console.log("User Data:", user);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/userdata/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {

        // console.log("Full URL:", `${BASE_URL}/api/user/userdata/${userId}`);

        console.error("Profile fetch failed:", err);
      }
    };

    fetchUser();
  }, [userId, token]);

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div className="container mt-4">
      <h2>User Profile</h2>
      <div className="card p-3 shadow-sm">
        {/* {user.profileImage?.length > 0 && (
          <img
            src={user.profileImage[0]} // adjust if it's a full object
            alt="Profile"
            className="rounded-circle mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        )} */}
        <div className="d-flex align-items-center">
          <a
            href="javascript:void(0);"
            className="avatar avatar-md me-2"
          >

            {user.profileImage &&
              user.profileImage.length > 0 ? (
              <img
                src={user.profileImage[0].url}
                alt="Profile"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10%",
                }}
              />
            ) : (
              <div
                className="bg-secondary text-white  d-flex justify-content-center align-items-center"
                style={{ width: "40px", height: "40px" }}
              >
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </div>
            )}
          </a>
          <a>
            {" "}
            <td>
              {user.firstName} {user.lastName}
            </td>
          </a>
        </div>
        <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Status:</strong> {user?.status}</p>
        <p><strong>Role:</strong> {user.role?.roleName}</p>        <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Profile;


// semi final
// src/pages/Profile.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../config/config";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const userObj = JSON.parse(localStorage.getItem("user"));
//   const userId = userObj?.id; // or userObj?._id based on your schema
//   const token = localStorage.getItem("token");
//   // console.log("User ID:", userId);
//   // console.log("Token:", token);
//   // console.log("User Object:", userObj);
//   // console.log("User Data:", user);

//   useEffect(() => {
//     if (!userId || !token) return;

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/user/userdata/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUser(res.data);
//       } catch (err) {

//         // console.log("Full URL:", `${BASE_URL}/api/user/userdata/${userId}`);

//         console.error("Profile fetch failed:", err);
//       }
//     };

//     fetchUser();
//   }, [userId, token]);

//   if (!user) return <p>Loading user profile...</p>;

//   return (
//     <div>
//       <h2>Welcome, {user.firstName} {user.lastName}</h2>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>Role:</strong> {user.role?.roleName}</p>
//     </div>
//   );
// };

// export default Profile;
