const axios = require("axios");

async function getAccessToken() {
  try {
    const res = await axios.post(
      "https://commonapi.mastersindia.co/oauth/access_token",
      {
        username: process.env.MASTERSINDIA_USERNAME,
        password: process.env.MASTERSINDIA_PASSWORD,
        client_id: process.env.MASTERSINDIA_CLIENT_ID,
        client_secret: process.env.MASTERSINDIA_CLIENT_SECRET,
        grant_type: "password",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Access Token:", res.data);

    return res.data.access_token;
  } catch (err) {
    console.error(
      "MastersIndia Auth Error:",
      err.response?.data || err.message
    );
    throw new Error("Failed to fetch MastersIndia access token");
  }
}

module.exports = { getAccessToken };
