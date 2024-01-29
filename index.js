import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { CustomAPIError, ValidationError } from './config/errors.js';


import apiRoute from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v2', apiRoute);

app.use('*', (req, res)=>{
    //res.redirect('/test');
    res.send('Not Found');
})


app.use((err, req, res, next)=>{

    if(err instanceof CustomAPIError){
        return res.status(err.statusCode).json(err.message);
    }

    if(err instanceof ValidationError){
        return res.status(400).json('Validation Error :'+ err.message);
    }
    //console.log(err);
    res.status(500).json("Internal Server Error :" + err.message);
})

const port = process.env.PORT


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});