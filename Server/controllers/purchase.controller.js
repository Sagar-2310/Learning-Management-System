import { Purchase } from "../models/purchase.model.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }

    const alreadyPurchased = user.enrolledCourses.includes(courseId);

    if (alreadyPurchased) {
      return res.status(200).json({
        success: true,
        message: "Course already purchased",
      });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: userId }
    });

    await Purchase.create({
      courseId,
      userId,
      amount: 0,
      status: "completed",
      paymentId: "INSTANT_UNLOCK"
    });

    res.status(200).json({
      success: true,
      message: "Course unlocked successfully!",
    });

  } catch (error) {
    console.error("Purchase Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during purchase"
    });
  }
};

export const approvePurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    purchase.status = "completed";
    await purchase.save();

    await User.findByIdAndUpdate(purchase.userId, {
      $addToSet: { enrolledCourses: purchase.courseId }
    });
    
    await Course.findByIdAndUpdate(purchase.courseId, {
      $addToSet: { enrolledStudents: purchase.userId }
    });

    return res.status(200).json({
      success: true,
      message: "Student approved! Content unlocked."
    });
  } catch (error) {
    console.error("Approval Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Approval failed" 
    });
  }
};

export const getAllPurchaseRequests = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("userId", "fullName email")
      .populate("courseId", "courseTitle")
      .sort({ createdAt: -1 });

    return res.status(200).json({ 
      success: true, 
      purchases 
    });
  } catch (error) {
    console.error("Fetch Purchase Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch requests" 
    });
  }
};

export const verifyPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isEnrolled = user.enrolledCourses.includes(courseId);

    console.log("DEBUG:", {
      Purchase: isEnrolled,
      Enrolled: isEnrolled,
      Creator: false
    });

    res.status(200).json({
    success: true,
    purchased: isEnrolled,
    enrolled: isEnrolled
  });

  } catch (error) {
    console.error("Verify Error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};