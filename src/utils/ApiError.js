class ApiError extends Error {

    constructor(
        satausCode,
        message="somthing went wrong",
        error=[],
        stack=""

    ){
        super(message)
        this.satausCode=satausCode;
        this.data=null;
        this.message=message;
        this.success=false;
        this.error = error;

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}