import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["student", "instructor"], 
    default: "student" 
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  photoUrl: { type: String, default: "" },
  bio: { type: String, default: "" },
  lectureProgress: { type: Object, default: {} }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);