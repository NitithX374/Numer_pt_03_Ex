const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; // You can choose any available port

// Enable CORS for all origins (adjust as necessary for your production setup)
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Proxy configuration
app.use(
  '/api/insert',
  createProxyMiddleware({
    target: 'https://numer-pt-03-ex-zgy8.vercel.app',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log('Proxy request made to:', proxyReq.path);
    },
    onError: (err, req, res) => {
      console.error("Proxy error:", err); // Log proxy errors
      res.status(500).send('Something went wrong with the proxy.');
    }
  })
);

// Start the proxy server
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
