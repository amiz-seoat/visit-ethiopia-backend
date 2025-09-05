const mongoose = require('mongoose')

const NewsSchema = new mongoose.Schema(
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
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

NewsSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

NewsSchema.index({ category: 1, date: -1 })
NewsSchema.index({ featured: 1, date: -1 })

// Virtual for formatted date
NewsSchema.virtual('formattedDate').get(function () {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// auto-populate author details when querying
NewsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'FirstName LastName email',
  })
  next()
})

const News = mongoose.model('News', NewsSchema)

module.exports = News
