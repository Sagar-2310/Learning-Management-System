import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  subTitle: { type: String },
  description: { type: String },
  category: { type: String },
  courseLevel: { type: String },
  coursePrice: { type: Number },
  courseThumbnail: { type: String },
  isPublished: { type: Boolean, default: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
  
  quiz: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true }, 
    }
  ]
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);