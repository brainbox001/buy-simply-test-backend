import express from 'express';
import login from '../controllers/staff/login';
import logout from '../controllers/staff/logout';

const authRoutes = express.Router();
authRoutes.use(express.json());

authRoutes.post('/login', login);
authRoutes.post('/logout', logout);

export default authRoutes;
