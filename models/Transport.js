import mongoose from 'mongoose'

const TransportSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      min: 0,
      required: true,
    },
    seatingCapacity: {
      type: Number,
      min: 1,
      required: true,
    },
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual'],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
      required: true,
    },
    PickupLocation: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['available', 'unavailable', 'maintenance'],
      default: 'available',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
TourSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

// Create compound indexes for better query performance
TransportSchema.index({ location: 1, category: 1 })
TransportSchema.index({ brand: 1, model: 1 })
TransportSchema.index({ status: 1, pricePerDay: 1 })

// Virtual for average rating calculation
TransportSchema.virtual('averageRating').get(function () {
  if (this.reviews.length === 0) return this.rating || 0

  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0)
  return (total / this.reviews.length).toFixed(1)
})

// Pre-save middleware to update overall rating based on reviews
TransportSchema.pre('save', function (next) {
  if (this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0)
    this.rating = parseFloat((total / this.reviews.length).toFixed(1))
  }
  next()
})

const Transport = mongoose.model('Transport', TransportSchema)
export default Transport
