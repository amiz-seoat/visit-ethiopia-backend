import mongoose from 'mongoose'

const RestaurantSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    tag: {
      type: String,
      default: '',
    },
    oldPrice: {
      type: Number,
      min: 0,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

RestaurantSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})
RestaurantSchema.index({ location: 1, cuisine: 1 })

RestaurantSchema.virtual('totalReviews').get(function () {
  return this.reviews ? this.reviews.length : 0
})

RestaurantSchema.virtual('discountPercentage').get(function () {
  if (this.oldPrice && this.oldPrice > 0) {
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100)
  }
  return 0
})

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)
export default Restaurant
