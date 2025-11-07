const axios = require('axios');

/**
 * Simple wrapper for WhiteBooks public sandbox search API.
 * Expects these env vars to be set when using WhiteBooks as provider:
 * - WHITEBOOKS_CLIENT_ID
 * - WHITEBOOKS_CLIENT_SECRET
 * - WHITEBOOKS_EMAIL (optional; the sample sandbox requires an email query param)
 */
async function searchTaxpayer({ gstin, email }) {
    const clientId = process.env.WHITEBOOKS_CLIENT_ID;
    const clientSecret = process.env.WHITEBOOKS_CLIENT_SECRET;
    const base = process.env.WHITEBOOKS_BASE_URL || 'https://apisandbox.whitebooks.in/public/search';

    if (!clientId || !clientSecret) {
        throw new Error('WhiteBooks credentials not configured (set WHITEBOOKS_CLIENT_ID and WHITEBOOKS_CLIENT_SECRET)');
    }

    const params = { gstin };
    if (email) params.email = email;

    // Retry a few times for transient network issues (timeout, 5xx)
    const maxAttempts = 3;
    let attempt = 0;
    let lastErr;
    while (attempt < maxAttempts) {
        try {
            const res = await axios.get(base, {
                params,
                headers: {
                    accept: '*/*',
                    client_id: clientId,
                    client_secret: clientSecret,
                },
                timeout: 30000, // increased timeout for sandbox
            });
            return res.data;
        } catch (err) {
            lastErr = err;
            attempt += 1;
            const isTimeout = err.code === 'ECONNABORTED' || String(err.message || '').toLowerCase().includes('timeout');
            const is5xx = err.response && err.response.status >= 500;
            if (attempt >= maxAttempts || (!isTimeout && !is5xx)) break;
            // exponential backoff
            const backoff = 200 * Math.pow(2, attempt);
            await new Promise((r) => setTimeout(r, backoff));
        }
    }
    // If we reach here, throw last error for caller to handle/log
    throw lastErr || new Error('WhiteBooks request failed');
}

module.exports = { searchTaxpayer };
