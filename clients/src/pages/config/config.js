// // config.js
// const BASE_URL = `http://localhost:5000`;
// // const BASE_URL = `https://crmbackend-mn7w.onrender.com`;
// export default BASE_URL;


// config.js
let BASE_URL;

// If running on localhost (your own computer)
if (window.location.hostname === "localhost") {
    BASE_URL = `http://localhost:5000`;
} else {
    // If accessed from LAN IP or another device
    BASE_URL = `http://192.168.1.37:5000`; // <-- replace with your computer's IP
}

export default BASE_URL;

