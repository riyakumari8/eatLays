import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`[eatLays] Backend API Server running on port ${PORT}`);
  console.log(`[eatLays] Health Check: http://localhost:${PORT}/api/health`);
  console.log(`[eatLays] Frontend origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`===============================================`);
});
