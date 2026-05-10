const errorMiddleware  = (err, req,res,next)=>{
    console.log(err);

    if(err.code === 1000){
        return res.status(400).json({
            success:false,
            message:"you have already applied to this job",
        })
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        message:err.message || "Internal Server Error",
    })
}

export default errorMiddleware;