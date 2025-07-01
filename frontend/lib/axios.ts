// lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://your-backend.onrender.com/api',
});

export default instance;
