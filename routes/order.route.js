import { Router } from "express";
import * as orderServices from "../services/orders/orders.services.js";
import { authentication } from "../middlewares/authentication.js";
const router = Router();

router.post("/:cartId", authentication, orderServices.createCashOrder);
router.get("/", authentication, orderServices.filterLoggedUsers, orderServices.getAllOrders);

export default router;
