import { check, body } from "express-validator";

// Constants for validation
const VALIDATION_MESSAGES = {
  INVALID_MONGO_ID: "Invalid mongo ID",
  PASSWORD_UPDATE_NOT_ALLOWED: "Password update is not allowed from this route",
  CURRENT_PASSWORD_REQUIRED: "Current password is required",
  PASSWORD_CONFIRMATION_REQUIRED: "Password confirmation is required",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
  PASSWORD_CONFIRMATION_MISMATCH:
    "Password confirmation does not match new password",
  USERNAME_REQUIRED: "Username is required",
  EMAIL_REQUIRED: "Email is required",
  INVALID_EMAIL: "Invalid email format",
  PASSWORD_REQUIRED: "Password is required",
  PHONE_REQUIRED: "Phone number is required",
  INVALID_PHONE: "Invalid phone number format",
  CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",
};

const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  MESSAGE:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
};

const USERNAME_LIMITS = { MIN: 3, MAX: 32 };
const EMAIL_LIMITS = { MIN: 5, MAX: 50 };

// Reusable validation rules
const commonValidations = {
  mongoId: (field = "id") =>
    check(field).isMongoId().withMessage(VALIDATION_MESSAGES.INVALID_MONGO_ID),

  password: (field = "password") =>
    check(field)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
      .isLength({ min: PASSWORD_REQUIREMENTS.MIN_LENGTH })
      .withMessage(
        `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`
      )
      .matches(PASSWORD_REQUIREMENTS.REGEX)
      .withMessage(PASSWORD_REQUIREMENTS.MESSAGE),

  newPassword: () =>
    check("newPassword")
      .isLength({ min: PASSWORD_REQUIREMENTS.MIN_LENGTH })
      .withMessage(
        `New password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`
      )
      .matches(PASSWORD_REQUIREMENTS.REGEX)
      .withMessage(PASSWORD_REQUIREMENTS.MESSAGE),

  currentPassword: () =>
    check("currentPassword")
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.CURRENT_PASSWORD_REQUIRED),

  confirmPassword: (compareField = "password") =>
    check("confirmPassword")
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED)
      .custom((value, { req }) => {
        if (value !== req.body[compareField]) {
          throw new Error(
            compareField === "newPassword"
              ? VALIDATION_MESSAGES.PASSWORD_CONFIRMATION_MISMATCH
              : VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH
          );
        }
        return true;
      }),

  username: () =>
    check("username")
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.USERNAME_REQUIRED)
      .isLength({ min: USERNAME_LIMITS.MIN, max: USERNAME_LIMITS.MAX })
      .withMessage(
        `Username must be between ${USERNAME_LIMITS.MIN} and ${USERNAME_LIMITS.MAX} characters long`
      )
      .trim(),

  email: () =>
    check("email")
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED)
      .isEmail()
      .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL)
      .normalizeEmail()
      .isLength({ min: EMAIL_LIMITS.MIN, max: EMAIL_LIMITS.MAX })
      .withMessage(
        `Email must be between ${EMAIL_LIMITS.MIN} and ${EMAIL_LIMITS.MAX} characters long`
      ),

  phone: () =>
    check("phone")
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.PHONE_REQUIRED)
      .isMobilePhone("ar-EG")
      .withMessage(VALIDATION_MESSAGES.INVALID_PHONE),

  preventPasswordUpdate: () =>
    check("password").custom((value) => {
      if (value !== undefined) {
        throw new Error(VALIDATION_MESSAGES.PASSWORD_UPDATE_NOT_ALLOWED);
      }
      return true;
    }),
};

// Main validation rules object
const userRules = {
  getUser: [commonValidations.mongoId()],

  updateUser: [
    commonValidations.mongoId(),
    commonValidations.preventPasswordUpdate(),
  ],

  updatePassword: [
    commonValidations.mongoId(),
    commonValidations.currentPassword(),
    commonValidations.newPassword(),
    commonValidations.confirmPassword("newPassword"),
  ],

  deleteUser: [commonValidations.mongoId()],

  createUser: [
    commonValidations.username(),
    commonValidations.email(),
    commonValidations.password(),
    commonValidations.phone(),
    commonValidations.confirmPassword(),
  ],
};

export default userRules;
