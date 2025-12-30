const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const userSchema = require("../Models/user.Schema");

async function authMiddleware(req,res,next){
const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try{
        const decodedToken = jwt.verify(token,JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
}

async function adminMiddleware(req,res,next){
    try{
        const user = await userSchema.findById(req.user.id);
        if(!user){
            return res.status(401).json({message:"User not found"});
        }
        if(user.role !== "admin"){
            return res.status(401).json({message:"User is not admin"});
        }
        next();
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
}

async function isActiveMiddleware(req,res,next){
    try{
        const user = await userSchema.findById(req.user.id);
        if(!user){
            return res.status(401).json({message:"User not found"});
        }
        if(!user.isActive){
            return res.status(401).json({message:"User is not active"});
        }
        next();
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
}
module.exports = {authMiddleware,adminMiddleware,isActiveMiddleware};
