import express, { Request, Response, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routers/authRoutes';
import loanRoutes from './routers/loanRoutes';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors({
  origin: "*",
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  let userAgent: string | undefined;
  userAgent = req.headers['user-agent']
    res.status(200).json({welcome: `Welcome to buysimple app ${userAgent}`})
  });

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

app.use((err: any, req:Request, res:Response, next:NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});
