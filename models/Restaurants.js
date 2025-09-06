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
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
)

// Indexes - Fixed: added missing 'cuisine' field or removed it
RestaurantSchema.index({ location: 1 })

// Virtual for total reviews count
RestaurantSchema.virtual('totalReviews').get(function () {
  return this.reviews ? this.reviews.length : 0
})

// Virtual for discount percentage
RestaurantSchema.virtual('discountPercentage').get(function () {
  if (this.oldPrice && this.oldPrice > 0) {
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100)
  }
  return 0
})

// Pre-save middleware to ensure oldPrice is higher than price if both exist
RestaurantSchema.pre('save', function (next) {
  if (this.oldPrice && this.oldPrice <= this.price) {
    this.oldPrice = undefined
  }
  next()
})

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)
export default Restaurant
