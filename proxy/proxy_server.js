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
  '/api/insert', // This path will match requests coming from the frontend
  createProxyMiddleware({
    target: 'https://numer-pt-03-ex-zgy8.vercel.app', // Your backend server URL
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' }, // Forward requests with '/api' intact
    onProxyReq: (proxyReq, req, res) => {
      console.log('Proxy request made to:', proxyReq.path);
    },
  })
);

// Start the proxy server
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
