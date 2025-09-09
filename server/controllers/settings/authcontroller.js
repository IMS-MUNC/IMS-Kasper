const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); 
    const userEmail = payload.email;

    res.status(200).json({ success: true, user: payload });
  } catch (err) {
    console.error("Google Token Verification Error:", err);
    res.status(401).json({ error: "Invalid Google token" });
  }
};

module.exports = { verifyGoogleToken };