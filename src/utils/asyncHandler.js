const asyncHandler=(requestHandler)=>{
   return   (req,res,next)=>{
        Promise.resolve(
            requestHandler(req,res,next)
        ).catch((err)=>next(err))
    }
}

export default asyncHandler

/*

const asyncHandler = ()=>{}
    const asyncHandler = (func)=>{()=>{}} 
         const asyncHandler = (func)=> ()=>{}


            const asyncHandler=(fun)=>()=>{
                try{
                await fun(req,res,next)
                }
                catch(error){
                res.status(err.code || 500).json({
                success:false,
                message:err.message
                })
                }
                }

*/