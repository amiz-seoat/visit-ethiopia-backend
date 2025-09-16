import mongoose from 'mongoose'

const HotelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, required: true },
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

// Create a compound index for better query performance
HotelSchema.index({ location: 1, rating: -1 })
HotelSchema.index({ tag: 1 })

// Virtual for discount percentage
HotelSchema.virtual('discountPercentage').get(function () {
  if (this.oldPrice && this.oldPrice > 0) {
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100)
  }
  return 0
})

// Virtual for total reviews count
HotelSchema.virtual('totalReviews').get(function () {
  return this.reviews ? this.reviews.length : 0
})

// Pre-save middleware to handle both updatedAt and oldPrice validation
HotelSchema.pre('save', function (next) {
  this.updatedAt = Date.now()

  // Ensure oldPrice is higher than price if both exist
  if (this.oldPrice && this.oldPrice <= this.price) {
    this.oldPrice = undefined
  }

  next()
})

const Hotel = mongoose.model('Hotel', HotelSchema)
export default Hotel
