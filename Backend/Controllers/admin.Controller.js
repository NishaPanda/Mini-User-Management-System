const userSchema = require("../Models/user.Schema");


async function getAllUsersByPagination(req,res){
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const users = await userSchema.find()
        .select("-password")
        .where("role")
        .ne("admin")
        .skip(skip)
        .limit(limit)
        .sort({createdAt:-1});

        const totalUsers = await userSchema.countDocuments();

        res.status(200).json({
            message:"Users fetched successfully",
            users:users,
            totalUsers:totalUsers,
            currentPage:page,
            totalPages:Math.ceil(totalUsers/limit),
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
}

async function activateUsers(req,res){
    try{
        const userId = req.params.id;
        const user = await userSchema.findById(userId);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        user.isActive = true;
        await user.save();
        res.status(200).json({message:"User activated successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
}

async function deactivateUsers(req,res){
    try{
        const userId = req.params.id;
        const user = await userSchema.findById(userId);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        user.isActive = false;
        await user.save();
        res.status(200).json({message:"User deactivated successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log(error);
    }
}
module.exports = {getAllUsersByPagination,activateUsers,deactivateUsers};
