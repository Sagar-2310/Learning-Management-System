import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isInstructor from "../middleware/isInstructor.js";
import { 
    getAllPurchaseRequests, 
    approvePurchase, 
    createCheckoutSession 
} from "../controllers/purchase.controller.js";

const router = express.Router();
router.route("/checkout/create-checkout-session/:courseId").post(isAuthenticated, createCheckoutSession);

router.route("/checkout-session/:courseId").post(isAuthenticated, createCheckoutSession);
router.route("/approve/:purchaseId").put(isAuthenticated, approvePurchase);

export default router;