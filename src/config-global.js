// routes
import { paths } from 'src/routes/paths';

// API
export const HOST_API = process.env.REACT_APP_SERVER_URL;
export const HOST_API_TOKEN = process.env.REACT_APP_HOST_API_TOKEN;
export const ASSETS_API = process.env.REACT_APP_ASSETS_API;

// SANAD
export const SANAD_CLIENT_ID = process.env.REACT_APP_SANAD_CLIENT_ID;
export const SANAD_SIGNFLOW_URL = process.env.REACT_APP_SANAD_SIGNFLOW_URL;
export const SANAD_REDIRECT_URL = process.env.REACT_APP_SANAD_REDIRECT_URL;

export const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
export const PATH_AFTER_REGISTER = paths.auth.jwt.OTP; // as '/OTP
export const PASSWORD_RESET = paths.auth.jwt.forgotPassword; // as '/forgotPassword'

// PLACEHOLDER IMAGE
export const PLACEHOLDER_IMAGE = '/assets/images/placeholder.png';
