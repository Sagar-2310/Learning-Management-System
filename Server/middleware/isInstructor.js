const isInstructor = (req, res, next) => {
    try {
        if (!req.role || req.role.toLowerCase() !== 'instructor') {
            return res.status(403).json({
                message: "Access denied. Only instructors can access this resource.",
                success: false
            });
        }
        next();
    } catch (error) {
        console.error("isInstructor Middleware Error:", error);
        return res.status(500).json({
            message: "Internal server error during role verification",
            success: false
        });
    }
};

export default isInstructor;