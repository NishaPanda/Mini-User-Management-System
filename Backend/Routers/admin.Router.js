const express = require("express");
const router = express.Router();
const {getAllUsersByPagination,activateUsers,deactivateUsers} = require("../Controllers/admin.Controller");
const {authMiddleware,adminMiddleware,isActiveMiddleware} = require("../Middleware/auth.Middleware");

router.get("/getallusers",authMiddleware,adminMiddleware,isActiveMiddleware,getAllUsersByPagination);
router.patch("/users/:id/activate",authMiddleware,adminMiddleware,isActiveMiddleware,activateUsers);
router.patch("/users/:id/deactivate",authMiddleware,adminMiddleware,isActiveMiddleware,deactivateUsers);

module.exports = router;
