import createOTP from "./createOTP.js";
import sendEmails from "./sendEmails.js";

import eventEmitter from "events";
const OTPEvent = new eventEmitter();
OTPEvent.on("sendOtp", async function (email, purpose = "verification") {
  const otp = await createOTP(email, purpose);
  await sendEmails(email, otp, purpose);
});
export default OTPEvent;
