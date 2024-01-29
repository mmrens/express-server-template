import Model from "./model.js";
import Joi from 'joi';


// const tradeSchema = Joi.object({
//     lastname:Joi.string().required(),
//     firstname:Joi.string().required(),
//     midname:Joi.string().required(),
//     username:Joi.string().min(4).max(10).required(),
//     password:Joi.string().required().min(3).max(10).alphanum(),
//     email:Joi.any().allow(1,0)
// });

const tradeSchema = Joi.object({
    datetime:Joi.date().required(),
    position:Joi.allow('L','S').required(),
    ep:Joi.number().required(),
    sl:Joi.number().required(),
    tp:Joi.number().required(),
    win:Joi.any().allow(1,0)
});

const tradeModel = new Model('trades', tradeSchema);


export default tradeModel;