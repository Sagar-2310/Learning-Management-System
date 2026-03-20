import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config(); 

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js"; 

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// --- UPDATED LIMITS FOR VIDEO UPLOADS ---
app.use(express.json({ limit: "100mb" })); 
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
// ----------------------------------------

app.use(cookieParser());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/uploads", express.static("uploads", {
    setHeaders: (res) => {
        res.set("Access-Control-Allow-Origin", "*"); 
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
    }
}));
app.use("/api/v1/course/webhook", express.raw({ type: 'application/json' }));

const PORT = process.env.PORT || 3000;

// --- ASSIGN TO 'server' VARIABLE ---
const server = app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});

// Now this works because 'server' is defined above
server.timeout = 600000;