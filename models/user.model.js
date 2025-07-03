import { model, Schema } from "mongoose";
import slugify from "slugify";
import { hashPassword } from "../utils/hashingPassword.js";

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    phone: String,
    profilePicture: String,
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses:[
      {
        id: Schema.Types.ObjectId,
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre("save",async function (next) {
  this.slug = slugify(this.username, { lower: true, strict: true });
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();


  if (!update.password && !update.username) return next();

  if (update.password) {
    update.password = await hashPassword(update.password);
  }

  if (update.username) {
    update.slug = slugify(update.username, { lower: true, strict: true });
  }

  this.set(update);
  next();
});


const User = model("User", userSchema);
export default User;
