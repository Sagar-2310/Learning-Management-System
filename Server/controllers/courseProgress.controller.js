import { CourseProgress } from "../models/courseProgress.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js"; 
import { generateCertificateBuffer } from "../utils/certificateGenerator.js";

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const progress = await CourseProgress.findOne({ userId, courseId }).populate("courseId");
        
        if (!progress) {
            return res.status(200).json({
                data: {
                    completedLectures: [],
                    completed: false,
                },
                message: "No progress found"
            });
        }

        return res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// 2. Update Lecture Progress
export const updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        let progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress) {
            progress = await CourseProgress.create({
                userId,
                courseId,
                completedLectures: [lectureId],
            });
        } else {
            if (!progress.completedLectures.includes(lectureId)) {
                progress.completedLectures.push(lectureId);
            }
        }

        const course = await Course.findById(courseId);
        
        // Logic: Mark completed if all lectures are done
        // Note: If you add a Quiz later, add '&& quizPassed' here
        if (course && progress.completedLectures.length === course.lectures.length) {
            progress.completed = true;
        }

        await progress.save();

        return res.status(200).json({
            success: true,
            message: "Lecture progress updated successfully.",
            completed: progress.completed
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// 3. Download Certificate
export const downloadCertificate = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        // Fetch all necessary data
        const progress = await CourseProgress.findOne({ userId, courseId });
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        // Validation: Check if course/user exist and if course is actually completed
        if (!course || !user) {
            return res.status(404).json({
                success: false,
                message: "Course or User record not found."
            });
        }

        if (!progress || !progress.completed) {
            return res.status(400).json({
                success: false,
                message: "Course not completed. Finish all lectures and quizzes to earn your certificate."
            });
        }

        // Prepare Data for PDFKit
        const certificateData = {
            studentName: user.name,
            courseName: course.courseTitle || course.title, // Support both naming conventions
            date: new Date().toLocaleDateString('en-GB'),
            certificateId: `UPSKL-${courseId.slice(-4)}-${userId.slice(-4)}`.toUpperCase()
        };

        // Generate the PDF Buffer
        const pdfBuffer = await generateCertificateBuffer(certificateData);

        // Set Headers for File Download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${course.courseTitle || 'Course'}_Certificate.pdf"`);
        
        return res.status(200).send(pdfBuffer);

    } catch (error) {
        console.error("Certificate Generation Error:", error);
        return res.status(500).json({ 
            success: false,
            message: "Failed to generate certificate." 
        });
    }
};