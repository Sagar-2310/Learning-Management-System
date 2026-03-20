import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completed: { type: Boolean, default: false },
    completedLectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
        },
    ],
}, { timestamps: true });

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);