import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        console.log("Token Status: Received");

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated." 
            });
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decode) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token." 
            });
        }

        req.id = decode.userId; 
        req.user = { id: decode.userId }; 
        
        next();
    } catch (error) {
        console.error("Auth Error:", error.message); 
        return res.status(401).json({ 
            success: false, 
            message: "Authentication failed: " + error.message 
        });
    }
};