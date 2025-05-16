import { DEV_CONFIG } from './development';

// Get the current network configuration
const CURRENT_NETWORK = DEV_CONFIG[DEV_CONFIG.CURRENT];

// Your backend is running on port 5000 based on the logs
export const API_URL = 'http://192.168.5.178:5000/api';
