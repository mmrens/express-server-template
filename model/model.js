import db from "./db.js";
import { ValidationError } from "../config/errors.js";


class Model{

    _where = [];

    constructor(table, schema){
      //  if(!table) throw new Error('Model Name is Required');
        this.tableName = table;
        this.fields = Object.keys(schema.describe().keys);
        this.schema = schema;
        this.db= db;
    }

    async selectById(id, options = {}){

        const fields = options.fields;

        let selectFields = '*';
        if (fields && Array.isArray(fields)) {
            selectFields = fields.join(', ');
        }
      
        const [row] = await this.db.query(`select ${selectFields} from ${this.tableName} where id=?`, [id]);
        return row[0];
    }

    async select(options = {}){

        const fields = options.fields;

        let selectFields = '*';
        if (fields && Array.isArray(fields)) {
            selectFields = fields.join(', ');
        }

        const where = this._where.length > 0 ? this._where.join(' and ') : "1=1";
        const queryString = `select ${selectFields} from ${this.tableName} where ${where}`;
      
        const [row] = await this.db.query(queryString);
        return row;
    }

    async insert(body){
        const filteredfields = this._filterFields(body);
        const fields = this.validate(filteredfields);
        const keys = Object.keys(fields).map((key)=>`:`+key).join(',');
        const fieldNames = Object.keys(fields).join(',');
        const sql = `insert into ${this.tableName}(${fieldNames}) values(${keys})`
        const [ret] = await this.db.execute(sql, fields);
        return this.selectById(ret.insertId);
    }

    async update(body){ 
        const fields = this._filterFields(body);
        const keys = Object.keys(fields).map((key)=>`${key}=:${key}`).join(',');
        //const fieldNames = Object.keys(fields).join(',');
        const sql = `update ${this.tableName} set ${keys} where id=:id`;
        await db.execute(sql, {...fields, id:body.id});
        
        //return this.selectById(body.id);

        return body.id;
    }

    async delete(id){
        const [ret] = await db.execute(`delete from ${this.tableName} where id=:id`, {id:id});
        
        return ret.affectedRows == 1;
    }

    _filterFields(data){

        const bodyKeys = Object.keys(data);
        const filteredKeys = bodyKeys.filter((key)=>this.fields.includes(key));
        const fields = {};
    
        for(let key of filteredKeys){
            fields[key] = data[key];
        }
    
        return fields;
    }


    validate(data, schema){

        const validationSchema = schema || this.schema;
        let {error, value} =  validationSchema.validate(data, {abortEarly:false});
    
        if(error){

            let errObj = {};

            for(let err of error.details){
                let label = err.context.key;
                errObj[label] = err.message.replaceAll("\"", "")
            }

            error = JSON.stringify(errObj);
            throw new ValidationError(error);
           
        }
        
        return value;

    }


    addWhere($where){
        if(typeof($where) == 'string') this._where.push($where);
        else {
            const fWhere = this._filterFields($where);
            for(let w in fWhere){
                this._where.push(`${w}='${$where[w]}'`);
            }
        }

        return this;
    }

}

export default Model