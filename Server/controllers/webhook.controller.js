import stripe from 'stripe';
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
    let event;

    try {
        const signature = req.headers['stripe-signature'];
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const { userId, courseId } = session.metadata;

        await Purchase.create({
            courseId,
            userId,
            amount: session.amount_total / 100, 
            status: "completed",
            paymentId: session.payment_intent
        });

        await User.findByIdAndUpdate(userId, {
            $addToSet: { enrolledCourses: courseId }
        });

        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { enrolledStudents: userId }
        });

        console.log(`Course ${courseId} unlocked for User ${userId}`);
    }

    res.status(200).json({ received: true });
};