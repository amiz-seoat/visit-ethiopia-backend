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
    pickupLocation: {
      // ✅ Fixed: changed 'PickupLocation' to 'pickupLocation' (camelCase)
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
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true }, // ✅ Added to include virtuals in JSON output
  }
)

// Create compound indexes for better query performance
TransportSchema.index({ pickupLocation: 1, category: 1 }) // ✅ Fixed: changed 'location' to 'pickupLocation'
TransportSchema.index({ brand: 1, model: 1 })
TransportSchema.index({ status: 1, pricePerDay: 1 })

// Virtual for average rating calculation
TransportSchema.virtual('averageRating').get(function () {
  if (!this.reviews || this.reviews.length === 0) return this.rating || 0

  // Note: This virtual assumes reviews are populated with rating field
  // If reviews are just ObjectIds, you'll need to populate them first
  const total = this.reviews.reduce(
    (sum, review) => sum + (review.rating || 0),
    0
  )
  return parseFloat((total / this.reviews.length).toFixed(1))
})

// Virtual for total reviews count
TransportSchema.virtual('totalReviews').get(function () {
  return this.reviews ? this.reviews.length : 0
})

const Transport = mongoose.model('Transport', TransportSchema)
export default Transport
