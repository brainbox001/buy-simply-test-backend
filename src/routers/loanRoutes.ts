import express from 'express';
import { auth, isSuperAdmin } from '../middlewares/auth';
import { getAllLoans, getLoanByUserEmail, getExpiredLoan, deleteLoan } from '../controllers/loans/loans';

const loanRoutes = express.Router();
loanRoutes.use(express.json());
loanRoutes.use(auth);

loanRoutes.get('/', getAllLoans);
loanRoutes.get('/:email/get', getLoanByUserEmail);
loanRoutes.get('/expired', getExpiredLoan);
loanRoutes.delete('/:id/delete', isSuperAdmin, deleteLoan);

export default loanRoutes;
