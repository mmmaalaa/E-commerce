import e from "express";
import { check } from "express-validator";

const authRules = {
  register: [
    check("username")
      .notEmpty()
      .withMessage("Username is required")
      .isString()
      .isLength({ min: 2 })
      .withMessage("Username must be at least 2 characters long")
      .isLength({ max: 32 })
      .withMessage("Username must be at most 32 characters long"),
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    check("password")
      .notEmpty()
      .withMessage("password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      ).withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    check("confirmPassword")
      .notEmpty()
      .withMessage("confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match the password");
        }
        return true;
      }),
  ],
};

export const loginRules = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("password").notEmpty().withMessage("Password is required"),
];

export default authRules;
