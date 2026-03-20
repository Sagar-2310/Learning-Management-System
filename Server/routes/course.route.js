import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";

import { 
    createCourse, getAllCourses, getPublishedCourse,
    getCourseById, getCourseDetailWithStatus, editCourse,
    getCourseLecture, createLecture, editLecture, removeLecture,
    createCheckoutSession, updateCourseQuiz, verifyPurchase, deleteCourse
} from "../controllers/course.controller.js";

import { upload } from "../middleware/multer.js";
import { stripeWebhook } from "../controllers/webhook.controller.js";
import { 
    getCourseProgress,
    updateLectureProgress,
    downloadCertificate
} from "../controllers/courseProgress.controller.js";

const router = express.Router();

router.get("/published", getPublishedCourse);
router.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

router.use(isAuthenticated);

router.get("/", getAllCourses);
router.get("/:courseId", getCourseById);
router.post("/create", createCourse);
router.get("/:courseId/detail-with-status", getCourseDetailWithStatus);
router.put("/:courseId", editCourse);

router.get("/:courseId/lecture", getCourseLecture);
router.post("/:courseId/lecture", createLecture);
router.put("/:courseId/lecture/:lectureId", upload.single("videoFile"), editLecture);
router.delete("/lecture/:lectureId", removeLecture);

router.post("/:courseId/checkout", createCheckoutSession);
router.route("/:courseId/verify").post(verifyPurchase);
router.route("/:courseId/quiz").put(updateCourseQuiz);
router.route("/:courseId/progress").get(getCourseProgress); 
router.route("/:courseId/lecture/:lectureId/view").post(updateLectureProgress);

router.route("/:courseId/certificate").get(downloadCertificate);
router.route("/:courseId").get(getCourseById).put(isAuthenticated, editCourse).delete(isAuthenticated, deleteCourse);

export default router;