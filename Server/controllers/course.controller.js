import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { Lecture } from "../models/lecture.model.js";
import { Purchase } from "../models/purchase.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import cloudinary from "../utils/cloudinary.js";
import Stripe from "stripe";
import fs from "fs";
import mongoose from "mongoose";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. CREATE COURSE
export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({ message: "Missing title or category", success: false });
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id // Assuming isAuthenticated attaches user id to req.id
        });

        return res.status(201).json({
            course,
            message: "Course created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to create course" });
    }
};

// 2. GET ALL COURSES (Instructor specific)
export const getAllCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        return res.status(200).json({ success: true, courses: courses || [] });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch courses" });
    }
};

// 3. GET PUBLISHED COURSES (Home Page)
export const getPublishedCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({
            path: "creator",
            select: "fullName profilePhoto"
        });

        return res.status(200).json({
            success: true,
            courses: courses || []
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching courses" });
    }
};

// 4. GET COURSE BY ID
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });
        return res.status(200).json({ success: true, course });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching course" });
    }
};

// 5. GET COURSE DETAIL WITH STATUS

export const getCourseDetailWithStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        // 1. Fetch data and populate lectures
        const course = await Course.findById(courseId).populate("lectures");
        const user = await User.findById(userId);

        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        // 2. Access Check Logic
        const purchase = await Purchase.findOne({ userId, courseId });
        const isEnrolled = user?.enrolledCourses?.some((id) => id.toString() === courseId);
        const isCreator = course.creator?.toString() === userId.toString();

        const isPurchased = !!purchase || isEnrolled || isCreator;

        return res.status(200).json({
            success: true,
            course, // This now includes the 'quiz' array from your model
            purchased: isPurchased,
            enrolled: isEnrolled,
            progress: []
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// 6. EDIT COURSE
export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
        return res.status(200).json({ success: true, course, message: "Course updated successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Update failed" });
    }
};

// 7. CREATE LECTURE
export const createLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { lectureTitle } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const lecture = await Lecture.create({ lectureTitle: lectureTitle || "Untitled Lecture" });

        course.lectures.push(lecture._id);
        await course.save();

        return res.status(201).json({ success: true, lecture, message: "Lecture created successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lecture creation failed" });
    }
};

// 8. GET COURSE LECTURES
export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) return res.status(404).json({ message: "Course not found" });

        return res.status(200).json({ success: true, lectures: course.lectures || [] });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Fetch lectures failed" });
    }
};

// 9. EDIT LECTURE
export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const { lectureTitle, isPreviewFree } = req.body;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

        if (req.file) {
            if (lecture.publicId) {
                await cloudinary.uploader.destroy(lecture.publicId, { resource_type: "video" });
            }

            const cloudResponse = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video",
            });

            lecture.videoUrl = cloudResponse.secure_url;
            lecture.publicId = cloudResponse.public_id;

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        await lecture.save();
        return res.status(200).json({
            success: true,
            lecture,
            message: "Lecture updated successfully!"
        });
    } catch (error) {
        console.error("Edit Lecture Error:", error);
        return res.status(500).json({ success: false, message: "Edit failed" });
    }
};

// 10. REMOVE LECTURE
export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (lecture && lecture.publicId) {
            await cloudinary.uploader.destroy(lecture.publicId, { resource_type: "video" });
        }
        await Course.findOneAndUpdate({ lectures: lectureId }, { $pull: { lectures: lectureId } });
        return res.status(200).json({ success: true, message: "Lecture deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Delete failed" });
    }
};

// 11. PURCHASE / CHECKOUT
export const createCheckoutSession = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // CREATE STRIPE SESSION
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: course.courseTitle,
                            description: course.subTitle || "Course Purchase",
                        },
                        unit_amount: course.coursePrice * 100, 
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/course-detail/${courseId}?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/course-detail/${courseId}?canceled=true`,
            metadata: {
                courseId: courseId,
                userId: userId,
            },
        });

        return res.status(200).json({
            success: true,
            url: session.url 
        });

    } catch (error) {
        console.error("STRIPE ERROR:", error);
        return res.status(500).json({ message: "Internal Server Error during checkout" });
    }
};

// 12. VERIFY PURCHASE
export const verifyPurchase = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        // 1. Check if already purchased
        const existingPurchase = await Purchase.findOne({ userId, courseId, status: "completed" });
        if (existingPurchase) return res.status(200).json({ success: true, message: "Already unlocked" });

        // 2. Atomic Updates: Update Purchase, User, and Progress all at once
        await Promise.all([
            Purchase.create({
                courseId,
                userId,
                status: "completed",
                amount: 0, // Set your price logic here
                paymentId: `FREE_OR_STRIPE_${Date.now()}`
            }),
            User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } }),
            CourseProgress.findOneAndUpdate(
                { userId, courseId },
                { $setOnInsert: { completedLectures: [] } },
                { upsert: true }
            )
        ]);

        return res.status(200).json({ success: true, message: "Course unlocked successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 13. UPDATE QUIZ
export const updateCourseQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { questions } = req.body;

        const course = await Course.findByIdAndUpdate(
            courseId,
            { quiz: questions },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        return res.status(200).json({
            message: "Quiz updated successfully",
            quiz: course.quiz
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update quiz" });
    }
};

// Inside course.controller.js

export const getCertificate = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id; // Assuming you get this from your 'isAuthenticated' middleware

        // 1. Find the Course and User Progress
        // You likely have a 'Course' model and a 'CourseProgress' or 'User' model
        const course = await Course.findById(courseId);
        
        // 2. Logic to check if Quiz & Lectures are done
        // This depends on how you store progress (e.g., an array of completed lecture IDs)
        const userProgress = await CourseProgress.findOne({ userId, courseId });

        if (!userProgress || !userProgress.isCompleted) {
            return res.status(400).json({
                message: "Please complete all lectures and the quiz to unlock your certificate.",
                success: false
            });
        }

        // 3. Prepare data for the PDF
        const data = {
            studentName: req.user.name, // or from your user object
            courseName: course.title,
            date: new Date().toLocaleDateString(),
            certificateId: `UPSKL-${Math.random().toString(36).toUpperCase().slice(2, 10)}`
        };

        // 4. Generate the Buffer
        const pdfBuffer = await generateCertificateBuffer(data);

        // 5. Send PDF to client
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${course.title}_Certificate.pdf`,
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to generate certificate",
            success: false
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // 1. Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // 2. Delete all associated lectures first
        if (course.lectures && course.lectures.length > 0) {
            await Lecture.deleteMany({ _id: { $in: course.lectures } });
        }

        // 3. Delete the course itself
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course and all associated lectures deleted successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete course" });
    }
};


