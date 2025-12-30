const userSchema = require("../Models/user.Schema");
const bcrypt = require("bcryptjs");

async function getUserProfile(req,res){
    try{
        const user = await userSchema.findById(req.user.id).select("-password");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        res.status(200).json({message:"User found",user:user});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
}

async function updateUserProfile(req,res){
    try{
        const {fullName,email,password} = req.body;

        if(!password){
            return res.status(400).json({message:"Password is required"});
        }
        const user = await userSchema.findById(req.user.id);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isPasswordMatched = await bcrypt.compare(password,user.password);
        if(!isPasswordMatched){
            return res.status(400).json({message:"Invalid credentials"});
        }
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        console.log(user.email,user.fullName);
        await user.save();
        res.status(200).json({message:"User updated successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
}

async function ChangePassword(req,res){
    try{
        const {currentPassword,newPassword} = req.body;
        if(!currentPassword || !newPassword){
            return res.status(400).json({message:"Password is required"});
        }
        const user = await userSchema.findById(req.user.id);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isPasswordMatched = await bcrypt.compare(currentPassword,user.password);
        if(!isPasswordMatched){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isSamePassword = await bcrypt.compare(newPassword,user.password);
        if(isSamePassword){
            return res.status(400).json({message:"New password cannot be same as old password"});
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({message:"Password changed successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
}

module.exports = {getUserProfile,updateUserProfile,ChangePassword};
