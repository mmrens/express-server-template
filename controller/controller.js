

class Controller{

    constructor(model){
        this.model = model;  
    }

    async _GET(req, res){
    
        const data = req.params.id ? 
                    await this.model.selectById(req.params.id) :
                    await this.model.addWhere(req.query).select();

        return  res.json(data);
    
    }
    async _POST(req, res){
    
        const body = this.model.validate(req.body)
        const data = await this.model.insert(body);
        return res.json(data);
    }
    
    async _PUT(req, res){
    
        const id = await this.model.update(req.body);
        const data = await this.model.selectById(id); 
        res.json(data);
      
    }
    
    async _DELETE(req, res){

        const ret =  await this.model.delete(req.params.id);
        res.json(ret);
    }


    async GET(req, res){
        this._GET(req, res);
    }

    async POST(req, res){
        this._POST(req, res);
    }

    async PUT(req, res){
        this._PUT(req, res);
    }

    async DELETE(req, res){
        this._DELETE(req, res);
    }

}

export default Controller;