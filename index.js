import axios from 'axios';
import "dotenv/config";
import HttpsProxyAgent from 'https-proxy-agent';

// Configuration
const TOKEN = process.env.AUTH_TOKEN;
const API_URL = "https://api.depined.org/api/user/widget-connect";
const POLLING_INTERVAL = process.env.POLLING_INTERVAL;
const USE_PROXY = process.env.USE_PROXY === 'true';
const PROXY_HOST = process.env.PROXY_HOST;
const PROXY_PORT = process.env.PROXY_PORT;

let connectionState = false;
let pollTimer = null;
let pingTimer = null;

// Initialize axios instance with conditional proxy
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  }
};

// Add proxy configuration only if enabled
if (USE_PROXY && PROXY_HOST && PROXY_PORT) {
  const httpsAgent = new HttpsProxyAgent(`http://${PROXY_HOST}:${PROXY_PORT}`);
  axiosConfig.httpsAgent = httpsAgent;
  axiosConfig.proxy = false;
  console.log(`[${new Date().toISOString()}] Connecting through proxy: ${PROXY_HOST}:${PROXY_PORT}`);
}

const api = axios.create(axiosConfig);

const keepAlivePing = () => {
  console.log(`[${new Date().toISOString()}] Sending keep-alive ping...`);
  // Simulate internal ping to keep the process alive
  return true;
};

// Modified pollAPI function
const pollAPI = async () => {
  try {
    const startTime = Date.now();
    
    // Send keep-alive ping before API call
    keepAlivePing();
    
    if (!connectionState) {
      console.log('Connection state is false, continuing to poll...');
    }

    const response = await api.post(API_URL, {
      connected: true
    });

    if (response.status === 200) {
      connectionState = true;
      console.log(`Poll successful at ${new Date().toISOString()}:`, response.data);
    }
  } catch (error) {
    console.error('Polling error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    connectionState = false;
  }
};

const startPolling = () => {
  console.log(`[${new Date().toISOString()}] Starting polling service...`);
  
  // Clear any existing timers
  if (pollTimer) clearInterval(pollTimer);
  if (pingTimer) clearInterval(pingTimer);
  
  // Start main polling
  pollAPI();
  pollTimer = setInterval(pollAPI, POLLING_INTERVAL);
  
  // Start keep-alive ping at shorter intervals (every 3 seconds)
  pingTimer = setInterval(keepAlivePing, 3000);
  
  // Additional ping every minute for redundancy
  setInterval(() => {
    console.log(`[${new Date().toISOString()}] Minute marker - service is running`);
    keepAlivePing();
  }, 60000);
};

// Modify the shutdown handler
process.on('SIGINT', async () => {
  console.log('\nShutting down polling service...');
  connectionState = false;
  
  // Clear all intervals
  if (pollTimer) clearInterval(pollTimer);
  if (pingTimer) clearInterval(pingTimer);
  
  try {
    await api.post(API_URL, { connected: false });
  } catch (error) {
    console.error('Error during shutdown:', error.message);
  }
  process.exit(0);
});

// Add SIGTERM handler
process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Shutting down gracefully...');
  connectionState = false;
  
  // Clear all intervals
  if (pollTimer) clearInterval(pollTimer);
  if (pingTimer) clearInterval(pingTimer);
  
  try {
    await api.post(API_URL, { connected: false });
  } catch (error) {
    console.error('Error during shutdown:', error.message);
  }
  process.exit(0);
});

// Start the service
startPolling();