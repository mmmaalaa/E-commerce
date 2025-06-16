import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: [true, "Category name must be unique"],
      minLength: [3, "Category name must be at least 3 characters long"],
      maxLength: [32, "Category name must be at most 32 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: [true, "Category slug must be unique"],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});
categorySchema.pre("findOneAndUpdate", function (next) {
  this.set({
    slug: slugify(this.getUpdate().name, { lower: true, strict: true }),
  });
  next();
});
function setImageUrl(doc) {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
  }
}
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});
// categorySchema.index({ slug: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
