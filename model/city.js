import Model from "./model.js";
import Joi from 'joi';



const citySchema = Joi.object({
    desciption:Joi.string().required(),
});

const cityModel = new Model('mk_city', citySchema);


export default cityModel;