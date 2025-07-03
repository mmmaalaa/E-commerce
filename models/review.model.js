import { model, Schema } from "mongoose";
import Product from "./product.model.js";
const reviewSchema = new Schema(
  {
    content: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.statics.calcAverageRatingAndCount = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        ratingCount: { $sum: 1 },
      },
    },
  ]);


  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].averageRating,
      ratingsQuantity: stats[0].ratingCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingAndCount(this.product);
});
reviewSchema.pre("findOneAndDelete", async function (next) {
  this.reviewDoc = await this.model.findOne(this.getFilter());
  next();
});

reviewSchema.post("findOneAndDelete", async function () {
  if (this.reviewDoc) {
    await this.reviewDoc.constructor.calcAverageRatingAndCount(this.reviewDoc.product);
  } 
});



reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "username" });
  next();
});
const Review = model("Review", reviewSchema);

export default Review;
