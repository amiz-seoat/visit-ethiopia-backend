import mongoose from 'mongoose'

const TourSchema = new mongoose.Schema(
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
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    type: {
      type: String, // ✅ Added missing type definition
      required: true,
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
    likelyToSellOut: {
      type: Boolean,
      default: false,
    },
    discountAvailable: {
      type: Boolean,
      default: false,
    },
    guests: {
      type: Number,
      min: 1,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
  }
)

// Virtual for discount percentage
TourSchema.virtual('discountPercentage').get(function () {
  if (this.oldPrice && this.oldPrice > 0) {
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100)
  }
  return 0
})

// Virtual for total reviews count
TourSchema.virtual('totalReviews').get(function () {
  return this.reviews ? this.reviews.length : 0
})

// Indexes for better query performance
TourSchema.index({ location: 1, type: 1 })
TourSchema.index({ createdBy: 1, status: 1 })
TourSchema.index({ isFeatured: 1, status: 1 })

// Pre-save middleware to ensure oldPrice is higher than price if both exist
TourSchema.pre('save', function (next) {
  if (this.oldPrice && this.oldPrice <= this.price) {
    this.oldPrice = undefined
  }
  next()
})

const Tour = mongoose.model('Tour', TourSchema)
export default Tour
