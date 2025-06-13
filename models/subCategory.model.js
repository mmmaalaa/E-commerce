import mongoose, { Types } from "mongoose";
import slugify from "slugify";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: [true, "Category name must be unique"],
      minLength: [2, "Category name must be at least 3 characters long"],
      maxLength: [32, "Category name must be at most 32 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: [true, "Category slug must be unique"],
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "suCategory must belong to a category"],
    },
  },
  { timestamps: true }
);

subCategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});
subCategorySchema.pre("findOneAndUpdate", function (next) {
  this.set({
    slug: slugify(this.getUpdate().name, { lower: true, strict: true }),
  });
  next();
});
subCategorySchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name " });

  next();
});
// categorySchema.index({ slug: 1 });

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
