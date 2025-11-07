
// controllers/gstController.js
const axios = require('axios');
const GstRecord = require('../models/gstModels');

const SANDBOX = process.env.WHITEBOOKS_SANDBOX_BASE;
const CLIENT_ID = process.env.WHITEBOOKS_CLIENT_ID;
const CLIENT_SECRET = process.env.WHITEBOOKS_CLIENT_SECRET;
const GST_USER = process.env.WHITEBOOKS_GST_USER;
const REGISTERED_EMAIL = process.env.WHITEBOOKS_REGISTERED_EMAIL;

// helper: call WhiteBooks sandbox public/search
async function fetchFromWhitebooksByGstin(gstin, email = REGISTERED_EMAIL) {
  const url = `${SANDBOX}/public/search?gstin=${encodeURIComponent(gstin)}&email=${encodeURIComponent(email)}`;
  // For sandbox public endpoint headers might not be strictly required but include them
  const headers = {
    // include both lowercase header names and x- prefixed variants to match different sandbox expectations
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'x-client-id': CLIENT_ID,
    'x-client-secret': CLIENT_SECRET,
    // optional gst user header (some sandboxes expect a user identifier)
    'x-gst-user': GST_USER,
    'Content-Type': 'application/json'
  };

  const resp = await axios.get(url, { headers, timeout: 15000 });
  return resp.data; // exact JSON from WhiteBooks
}

// Controller function for route GET /api/gst/:gstin
exports.searchByGstin = async (req, res) => {
  try {
    const { gstin } = req.params;
    const email = req.query.email || REGISTERED_EMAIL;

    if (!gstin) return res.status(400).json({ error: 'GSTIN required' });

    // 1) Call WhiteBooks sandbox
    const wbResponse = await fetchFromWhitebooksByGstin(gstin, email);

    // 2) Upsert into MongoDB so we have local copy (optional but helpful)
    // Ensure we store exactly same structure (data, status_cd, status_desc)
    const filter = { 'data.gstin': wbResponse?.data?.gstin || gstin };
    const update = wbResponse;
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

    const saved = await GstRecord.findOneAndUpdate(filter, update, opts).lean();

    // 3) Return the exact WhiteBooks response shape so frontend sees same structure
    return res.status(200).json(wbResponse);
  } catch (err) {
    console.error('GST search error:', err?.response?.data || err.message);
    // if error from WhiteBooks proxy through
    if (err.response && err.response.data) {
      return res.status(err.response.status || 500).json(err.response.data);
    }
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};




// masterindi gst setup
// const Gst = require("../models/gstModels");
// const axios = require("axios");
// const { getAccessToken } = require("../utils/mastersindia");
// const { searchTaxpayer } = require('../utils/whitebooks');

// // Helper to call MastersIndia endpoints with automatic retry when token is invalid.
// async function callMastersIndiaGet(url, params, clientId) {
//   // try with env token or cached token first
//   let envAuth = process.env.MI_AUTH || process.env.MI_ACCESS_TOKEN || process.env.MASTERSINDIA_AUTH || process.env.MASTERSINDIA_ACCESS_TOKEN || null;
//   let token = null;
//   if (envAuth) token = envAuth.startsWith('Bearer ') ? envAuth.replace(/^Bearer\s+/i, '') : envAuth;

//   // internal helper to perform the request given a token
//   const doRequest = async (tokenToUse) => {
//     const authHeader = tokenToUse.startsWith('Bearer ') ? tokenToUse : `Bearer ${tokenToUse}`;
//     const res = await axios.get(url, {
//       params,
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         Authorization: authHeader,
//         client_id: clientId,
//       },
//       timeout: 15000,
//     });
//     return res.data;
//   };

//   // First attempt: use provided env token or try to obtain one
//   try {
//     if (!token) {
//       token = await getAccessToken();
//     }
//     let payload = await doRequest(token);

//     // If upstream indicates invalid token, try refresh once
//     const rawMsg = (payload && (payload.message || payload.error)) || '';
//     const lower = String(rawMsg).toLowerCase();
//     if (lower.includes('access token') || lower.includes('invalid_grant') || lower.includes('invalid grant')) {
//       // try to refresh token via password grant (getAccessToken will attempt)
//       try {
//         const refreshed = await getAccessToken();
//         if (refreshed && refreshed !== token) {
//           payload = await doRequest(refreshed);
//         }
//       } catch (refreshErr) {
//         // ignore refresh error here, we'll return original payload upstream
//         console.error('MastersIndia token refresh failed during API call:', refreshErr?.message || refreshErr);
//       }
//     }

//     return payload;
//   } catch (err) {
//     // If the request fails (network or 4xx/5xx), try one refresh attempt if we haven't already
//     const respData = err.response?.data;
//     const respMsg = (respData && (respData.message || respData.error)) || err.message || '';
//     const lower = String(respMsg).toLowerCase();
//     if (lower.includes('access token') || lower.includes('invalid_grant') || lower.includes('invalid grant')) {
//       try {
//         const refreshed = await getAccessToken();
//         const payload2 = await doRequest(refreshed);
//         return payload2;
//       } catch (err2) {
//         console.error('MastersIndia retry after token refresh failed:', err2.response?.data || err2.message || err2);
//         // throw original error to caller with upstream details
//         throw err;
//       }
//     }
//     throw err;
//   }
// }

// //  Create/Add GST
// exports.addGst = async (req, res) => {
//   try {
//     const { name, code, gstinCode } = req.body;

//     if (!name || !code || !gstinCode) {
//       return res.status(400).json({ message: "Name, code, and GSTIN code are required" });
//     }

//     const existing = await Gst.findOne({ name });
//     if (existing) {
//       return res.status(400).json({ message: "GST already exists" });
//     }

//     const gst = new Gst({ name, code, gstinCode });
//     await gst.save();
//     res.status(201).json(gst);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Bulk Import GST
// // POST /api/gst/import
// exports.bulkImportGst = async (req, res) => {
//   try {
//     const { gsts } = req.body;
//     if (!Array.isArray(gsts) || gsts.length === 0) {
//       return res.status(400).json({ message: "No GST entries provided" });
//     }

//     const bulkOps = gsts.map((item) => ({
//       updateOne: {
//         filter: { name: item.name }, // Or match by code
//         update: { $set: { name: item.name, code: item.code, gstinCode: item.gstinCode } },
//         upsert: true,
//       },
//     }));

//     await Gst.bulkWrite(bulkOps);

//     res.status(200).json({ message: `${gsts.length} GST entries processed successfully.` });
//   } catch (err) {
//     res.status(500).json({ message: "Bulk import error", error: err.message });
//   }
// };

// //  Get All GST
// exports.getAllGst = async (req, res) => {
//   try {
//     const gsts = await Gst.find().sort({ createdAt: -1 });
//     res.status(200).json(gsts);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Update GST
// exports.updateGst = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, code, gstinCode } = req.body;

//     const gst = await Gst.findById(id);
//     if (!gst) {
//       return res.status(404).json({ message: "GST not found" });
//     }

//     gst.name = name || gst.name;
//     gst.code = code || gst.code;
//     gst.gstinCode = gstinCode || gst.gstinCode;

//     await gst.save();
//     res.status(200).json(gst);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// //  Delete GST
// exports.deleteGst = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const gst = await Gst.findByIdAndDelete(id);

//     if (!gst) {
//       return res.status(404).json({ message: "GST not found" });
//     }

//     res.status(200).json({ message: "GST deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Verify GSTIN via Masters India API
// // GET /api/gst/verify?gstin=12GSPTN0792G1Z2
// exports.verifyGstin = async (req, res) => {
//   try {
//     // Accept gstin from query, body, or params to support GET/POST callers
//     let gstin = req.query?.gstin || req.body?.gstin || req.params?.gstin;
//     if (!gstin) {
//       return res.status(400).json({ error: true, message: "gstin is required" });
//     }
//     // Sanitize GSTIN: trim and uppercase as per common formats
//     gstin = String(gstin).trim().toUpperCase();

//     // If WhiteBooks credentials are provided, prefer calling WhiteBooks sandbox/public API
//     const wbClient = process.env.WHITEBOOKS_CLIENT_ID && process.env.WHITEBOOKS_CLIENT_SECRET;
//     if (wbClient) {
//       try {
//         const email = req.body?.email || process.env.WHITEBOOKS_EMAIL || undefined;
//         const wbRes = await searchTaxpayer({ gstin, email });
//         // Sample response contains payload.data as the taxpayer object
//         const info = wbRes && wbRes.data ? wbRes.data : wbRes;

//         const mapped = {
//           gstin: info?.gstin || gstin,
//           name: info?.lgnm || info?.tradeNam || info?.tradeName || "",
//           status: info?.sts || info?.status || "",
//           type: info?.dty || info?.type || "",
//           registrationDate: info?.rgdt || info?.lstupdt || info?.registrationDate || "",
//           stateJurisdiction: info?.stj || info?.pradr?.addr?.stcd || "",
//           centerJurisdiction: info?.ctj || info?.ctjCd || "",
//         };

//         return res.status(200).json({ error: false, data: mapped, upstream: wbRes });
//       } catch (wbErr) {
//         console.error('WhiteBooks search failed:', wbErr.response?.data || wbErr.message || wbErr);
//         // fallthrough to MastersIndia path if WhiteBooks fails unexpectedly
//       }
//     }

//     // Prefer explicit env token, else attempt to obtain one via password grant
//     let envAuth = process.env.MI_AUTH || process.env.MASTERSINDIA_AUTH || null;
//     const clientId = process.env.MI_CLIENT_ID || process.env.MI_CLIENT_PUBLIC_ID || process.env.MASTERSINDIA_CLIENT_ID || process.env.MASTERSINDIA_CLIENT_PUBLIC_ID || null;
//     if (!clientId) return res.status(500).json({ error: true, message: 'Masters India client_id not configured' });

//     let token = null;
//     if (envAuth) token = envAuth.startsWith('Bearer ') ? envAuth.replace(/^Bearer\s+/i, '') : envAuth;
//     else {
//       try {
//         token = await getAccessToken();
//       } catch (err) {
//         console.error('Failed to obtain MastersIndia token for verifyGstin:', err.message || err);
//         return res.status(500).json({ error: true, message: 'Masters India API not configured or token fetch failed', details: err.message || err });
//       }
//     }

//     const authHeaderValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

//     // Call MastersIndia with automatic token refresh if needed
//     const payload = await callMastersIndiaGet('https://commonapi.mastersindia.co/commonapis/searchgstin', { gstin }, clientId);
//     // Normalize and safely parse payload.data which MastersIndia sometimes returns as a JSON string
//     if (payload && payload.error === false && payload.data) {
//       let info = null;
//       try {
//         info = typeof payload.data === "string" ? JSON.parse(payload.data) : payload.data;
//       } catch (parseErr) {
//         // if parsing fails, attach raw payload for debugging
//         console.error("Failed to parse MastersIndia payload.data:", parseErr, payload.data);
//         return res.status(502).json({ error: true, message: "Failed to parse upstream response", details: { raw: payload.data } });
//       }

//       // Map MastersIndia fields to our API contract (safe guards if fields missing)
//       const mapped = {
//         gstin: info?.gstin || gstin,
//         name: info?.lgnm || info?.tradeName || info?.name || "",
//         status: info?.sts || info?.status || "",
//         type: info?.dty || info?.type || "",
//         registrationDate: info?.rgdt || info?.registrationDate || "",
//         stateJurisdiction: info?.stj || info?.stateJurisdiction || "",
//         centerJurisdiction: info?.ctj || info?.centerJurisdiction || "",
//       };

//       return res.status(200).json({ error: false, data: mapped });
//     }

//     // If we reach here, upstream indicated an error or missing data - normalize message
//     const rawMsg = payload?.message || payload?.error || (payload?.details && (payload.details.message || payload.details.error)) || "";
//     const lowerRaw = String(rawMsg).toLowerCase();
//     if (lowerRaw.includes("access token") || lowerRaw.includes("invalid_grant") || lowerRaw.includes("invalid grant")) {
//       const friendly = "MastersIndia access token invalid on the server. Please set MI_ACCESS_TOKEN and MI_CLIENT_PUBLIC_ID (or provide MI_USERNAME/MI_PASSWORD+client creds) in server env and restart the server.";
//       return res.status(401).json({ error: true, message: friendly, details: payload });
//     }
//     return res.status(400).json({ error: true, message: payload?.message || payload?.error || "Verification failed", details: payload });
//   } catch (err) {
//     // Surface upstream error details to help diagnose (e.g., 401 due to invalid token)
//     const status = err.response?.status || 500;
//     const upstream = err.response?.data;
//     // Build a helpful message. If upstream includes 'access token' mention it explicitly.
//     const upstreamMsg = (upstream && (upstream.message || upstream.error || JSON.stringify(upstream))) || err.message;
//     console.error("GST verify error:", status, upstream || err.message);

//     if (String(upstreamMsg).toLowerCase().includes("access token")) {
//       const friendly = "MastersIndia access token invalid on the server. Please set MI_ACCESS_TOKEN and MI_CLIENT_PUBLIC_ID (or provide MI_USERNAME/MI_PASSWORD+client creds) in server env and restart the server.";
//       return res.status(401).json({ error: true, message: friendly, details: upstream || undefined });
//     }

//     return res.status(status).json({ error: true, message: upstreamMsg || "Verification failed", details: upstream || undefined });
//   }
// };

// // GET /api/gst/trackReturns?gstin=...&fy=2018-19
// exports.trackReturns = async (req, res) => {
//   try {
//     let { gstin, fy } = req.query;
//     if (!gstin) return res.status(400).json({ error: true, message: 'gstin is required' });
//     gstin = String(gstin).trim().toUpperCase();

//     // trackReturns: same token/client resolution as verifyGstin
//     let envAuthTR = process.env.MI_AUTH || process.env.MASTERSINDIA_AUTH || null;
//     const clientIdTR = process.env.MI_CLIENT_ID || process.env.MI_CLIENT_PUBLIC_ID || process.env.MASTERSINDIA_CLIENT_ID || process.env.MASTERSINDIA_CLIENT_PUBLIC_ID || null;
//     if (!clientIdTR) return res.status(500).json({ error: true, message: 'Masters India client_id not configured' });
//     let tokenTR = null;
//     if (envAuthTR) tokenTR = envAuthTR.startsWith('Bearer ') ? envAuthTR.replace(/^Bearer\s+/i, '') : envAuthTR;
//     else {
//       try {
//         tokenTR = await getAccessToken();
//       } catch (err) {
//         console.error('Failed to obtain MastersIndia token for trackReturns:', err.message || err);
//         return res.status(500).json({ error: true, message: 'Masters India API not configured or token fetch failed', details: err.message || err });
//       }
//     }

//     const authHeaderValueTR = tokenTR.startsWith('Bearer ') ? tokenTR : `Bearer ${tokenTR}`;

//     const payload = await callMastersIndiaGet('https://commonapi.mastersindia.co/commonapis/trackReturns', { gstin, fy }, clientIdTR);
//     // const payload = miRes.data;
//     if (payload && payload.error === false && payload.data) {
//       let parsed = null;
//       try {
//         parsed = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
//       } catch (parseErr) {
//         console.error('Failed to parse MastersIndia trackReturns payload.data:', parseErr, payload.data);
//         return res.status(502).json({ error: true, message: 'Failed to parse upstream response', details: { raw: payload.data } });
//       }
//       return res.status(200).json({ error: false, data: parsed });
//     }
//     const rawMsgTR = payload?.message || payload?.error || (payload?.details && (payload.details.message || payload.details.error)) || "";
//     const lowerTR = String(rawMsgTR).toLowerCase();
//     if (lowerTR.includes("access token") || lowerTR.includes("invalid_grant") || lowerTR.includes("invalid grant")) {
//       const friendly = 'MastersIndia access token invalid on the server. Please set MI_ACCESS_TOKEN and MI_CLIENT_PUBLIC_ID (or provide MI_USERNAME/MI_PASSWORD+client creds) in server env and restart the server.';
//       return res.status(401).json({ error: true, message: friendly, details: payload });
//     }
//     return res.status(400).json({ error: true, message: payload?.message || payload?.error || 'Track returns failed', details: payload });
//   } catch (err) {
//     const status = err.response?.status || 500;
//     const upstream = err.response?.data;
//     console.error('GST trackReturns error:', status, upstream || err.message);
//     const upstreamMsg = (upstream && (upstream.message || upstream.error || JSON.stringify(upstream))) || err.message;
//     if (String(upstreamMsg).toLowerCase().includes('access token')) {
//       const friendly = 'MastersIndia access token invalid on the server. Please set MI_ACCESS_TOKEN and MI_CLIENT_PUBLIC_ID (or provide MI_USERNAME/MI_PASSWORD+client creds) in server env and restart the server.';
//       return res.status(401).json({ error: true, message: friendly, details: upstream || undefined });
//     }
//     return res.status(status).json({ error: true, message: upstreamMsg || 'Track returns failed', details: upstream || undefined });
//   }
// };

// // GET /api/gst/count?action=count
// exports.countApi = async (req, res) => {
//   try {
//     const { action } = req.query;
//     if (!action) return res.status(400).json({ error: true, message: 'action is required' });

//     const envAuthC = process.env.MI_AUTH || process.env.MASTERSINDIA_AUTH || null;
//     const clientIdC = process.env.MI_CLIENT_ID || process.env.MI_CLIENT_PUBLIC_ID || process.env.MASTERSINDIA_CLIENT_ID || process.env.MASTERSINDIA_CLIENT_PUBLIC_ID || null;
//     if (!clientIdC) return res.status(500).json({ error: true, message: 'Masters India client_id not configured' });
//     let tokenC = null;
//     if (envAuthC) tokenC = envAuthC.startsWith('Bearer ') ? envAuthC.replace(/^Bearer\s+/i, '') : envAuthC;
//     else {
//       try {
//         tokenC = await getAccessToken();
//       } catch (err) {
//         console.error('Failed to obtain MastersIndia token for countApi:', err.message || err);
//         return res.status(500).json({ error: true, message: 'Masters India API not configured or token fetch failed', details: err.message || err });
//       }
//     }

//     const authHeaderValueC = tokenC.startsWith('Bearer ') ? tokenC : `Bearer ${tokenC}`;

//     const payload = await callMastersIndiaGet('https://commonapi.mastersindia.co/commonapis/countapi', { action }, clientIdC);
//     // Normalize upstream response into { error, data } shape where possible
//     const rawMsgC = payload?.message || payload?.error || (payload?.details && (payload.details.message || payload.details.error)) || "";
//     const lowerC = String(rawMsgC).toLowerCase();
//     if (lowerC.includes("access token") || lowerC.includes("invalid_grant") || lowerC.includes("invalid grant")) {
//       const friendly = 'MastersIndia access token invalid on the server. Please set MI_ACCESS_TOKEN and MI_CLIENT_PUBLIC_ID (or provide MI_USERNAME/MI_PASSWORD+client creds) in server env and restart the server.';
//       return res.status(401).json({ error: true, message: friendly, details: payload });
//     }

//     if (payload && payload.error === false) {
//       return res.status(200).json({ error: false, data: payload.data || payload });
//     }
//     return res.status(200).json({ error: false, data: payload });
//   } catch (err) {
//     const status = err.response?.status || 500;
//     const upstream = err.response?.data;
//     console.error('GST countApi error:', status, upstream || err.message);
//     const upstreamMsg = (upstream && (upstream.message || upstream.error || JSON.stringify(upstream))) || err.message;
//     if (String(upstreamMsg).toLowerCase().includes('access token')) {
//       const friendly = 'MastersIndia access token invalid on the server. Please set MI_ACCESS_TOKEN and MI_CLIENT_PUBLIC_ID (or provide MI_USERNAME/MI_PASSWORD+client creds) in server env and restart the server.';
//       return res.status(401).json({ error: true, message: friendly, details: upstream || undefined });
//     }
//     return res.status(status).json({ error: true, message: upstreamMsg || 'Count API failed', details: upstream || undefined });
//   }
// };
