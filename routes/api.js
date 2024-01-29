import express from 'express';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createCustomAPIError } from '../config/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const router = express.Router();

router.route('/tests').all(asyncHandler(async (req, res)=>{
    res.json('working')
}))

const getController = async (controller)=>{
    const filePath = path.join(__dirname, '../controller/', `${controller}.js`);
    if(!fs.existsSync(filePath)) throw createCustomAPIError('Not Found', 404);
    const controllerImport = await import(`../controller/${controller}.js`);
    return controllerImport.default;
}

router.route('/:controller/:id?/:method?').all(asyncHandler(async (req, res)=>{

    const params = req.params;
    const controller = await getController(params.controller);

    if(params.method){
        if(req.method != 'POST' || typeof controller[params.method] == 'undefined') throw createCustomAPIError('Method not found', 404);
        await controller[params.method](req, res);
    }else{
        await controller[req.method](req, res);
    } 

}))




export default router;