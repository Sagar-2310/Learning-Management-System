import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = (authHeader && authHeader.split(" ")[1]) || req.cookies.token;
        
        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({ success: false, message: "No token found." });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.id = decoded.userId; 
        next();
    } catch (error) {
        console.error("DEBUG -> JWT Secret used for verify:", process.env.SECRET_KEY ? "Loaded" : "MISSING");
        console.error("DEBUG -> Error Message:", error.message);
        return res.status(401).json({ success: false, message: "Authentication failed." });
    }
};

export default isAuthenticated;