
class CustomAPIError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
    }
}

const createCustomAPIError = (message, statusCode)=>{
    return new CustomAPIError(message, statusCode)
}

class ValidationError extends Error{
    
}

export {CustomAPIError, createCustomAPIError, ValidationError};