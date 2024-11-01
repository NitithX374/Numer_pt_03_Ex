const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 5001; // You can choose any available port

// Proxy configuration: Replace with your actual backend URL if needed
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:5000", // Backend server URL (replace if different)
    changeOrigin: true,
    pathRewrite: { "^/api": "" }, // Rewrite if the frontend uses "/api"
  })
);

// Start the proxy server
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
