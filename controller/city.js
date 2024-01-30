import cityModel from '../model/city.js';
import Controller from './controller.js';

const cityController =  new Controller(cityModel)

cityController.GET = async function (req, res){

   // this.model.addWhere('win=1');

    await this._GET(req, res);
   
}

export default cityController
