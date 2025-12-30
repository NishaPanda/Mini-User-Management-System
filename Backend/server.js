const express = require("express");
const PORT = process.env.PORT || 8080;
const authRouter = require("./Routers/auth.Router");
const adminRouter = require("./Routers/admin.Router");
const userRouter = require("./Routers/user.Router");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: ["http://localhost:5173", "https://mini-user-management-system-seven.vercel.app"],
        credentials: true
    }
));

const connectDB = require("./db/db");
connectDB();

app.get("/", (req, res) => {
    res.send("User Management System !");
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});