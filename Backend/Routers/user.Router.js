const express = require("express");
const router = express.Router();
const {getUserProfile,updateUserProfile,ChangePassword} = require("../Controllers/user.Controller");
const {authMiddleware} = require("../Middleware/auth.Middleware");

router.get("/profile",authMiddleware,getUserProfile);
router.patch("/profile",authMiddleware,updateUserProfile);
router.patch("/changepassword",authMiddleware,ChangePassword);

module.exports = router;