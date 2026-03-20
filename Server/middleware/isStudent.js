const isStudent = (req, res, next) => {
    if (req.role !== 'student') {
        return res.status(403).json({
            message: "Access denied. Instructors cannot access student features.",
            success: false
        });
    }
    next();
};
export default isStudent;