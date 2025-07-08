import corn from "node-cron";
import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";

function clearExpiredCoupons() {
  corn.schedule("0 2 * * *", async () => {
    const expiredCoupons = await Coupon.find({
      expiresAt: { $lt: Date.now() },
    });
    if (expiredCoupons.length === 0) return;

    const expiredIds = expiredCoupons.map((c) => c._id);

    await Coupon.deleteMany({ _id: { $in: expiredIds } });
    await User.updateMany({}, { $pull: { usedCoupons: { $in: expiredIds } } });
  });
}


export default clearExpiredCoupons;