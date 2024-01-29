import trades from '../model/trades.js';
import Controller from './controller.js';

const tradeController =  new Controller(trades)

tradeController.GET = async function (req, res){

    this.model.addWhere('win=1');

    await this._GET(req, res);
   
}

export default tradeController
