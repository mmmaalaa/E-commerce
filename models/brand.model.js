import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
      trim: true,
      unique: [true, "brand name must be unique"],
      minLength: [3, "brand name must be at least 3 characters long"],
      maxLength: [32, "brand name must be at most 32 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: [true, "brand slug must be unique"],
    },
    image: {
      type: String
    }
  },
  { timestamps: true }
);
brandSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});
brandSchema.pre("findOneAndUpdate", function (next) {
  this.set({ slug: slugify(this.getUpdate().name, { lower: true, strict: true }) });
  next();
});
// brandSchema.index({ slug: 1 });

const Brand = mongoose.model("brand", brandSchema);

export default Brand;
