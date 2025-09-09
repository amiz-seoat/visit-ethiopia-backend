import mongoose from 'mongoose'

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    content: [
      {
        type: String,
        required: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
)

// Indexes
NewsSchema.index({ category: 1, date: -1 })
NewsSchema.index({ isFeatured: 1, date: -1 }) // Fixed: changed 'featured' to 'isFeatured'

// Virtual for formatted date
NewsSchema.virtual('formattedDate').get(function () {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Auto-populate author details when querying
NewsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'FirstName LastName email',
  })
  next()
})

const News = mongoose.model('News', NewsSchema)

export default News
