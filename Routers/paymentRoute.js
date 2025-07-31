import express from "express";
import { createCheckout } from "../Controllers/paymentController.js";

const router = express.Router();

router.post("/checkout", createCheckout);

export default router;