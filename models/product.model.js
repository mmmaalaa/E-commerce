// import { Schema } from "mongoose";
import mongoose, { Types } from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      // unique: [true, "Product title must be unique"],
      minLength: [3, "Product title must be at least 3 characters long"],
      maxLength: [100, "Product title must be at most 100 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: [true, "Product slug must be unique"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minLength: [
        20,
        "Product description must be at least 20 characters long",
      ],
      maxLength: [
        2000,
        "Product description must be at most 2000 characters long",
      ],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price must be at least 0"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Product quantity must be at least 0"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    imageCover: {
      type: String,
      required: [true, "Product cover image is required"],
    },
    images: {
      type: [String],
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subCategory: {
      type: [Types.ObjectId],
      ref: "SubCategory",
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
    },
    colors: {
      type: [String],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update?.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
    this.set(update);
  }

  next();
});



productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" })
    .populate({ path: "subCategory", select: "name" })
    .populate({ path: "brand", select: "name" });
  next();
});
function setImageUrl(doc) {
  if (doc.images) {
    doc.images = doc.images.map(
      (image) => `${process.env.BASE_URL}/products/${image}`
    );
  }
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
}
productSchema.post("init", (doc) => {
  setImageUrl(doc);
});
productSchema.post("save", (doc) => {
  setImageUrl(doc);
});
const Product = mongoose.model("Product", productSchema);
export default Product;
