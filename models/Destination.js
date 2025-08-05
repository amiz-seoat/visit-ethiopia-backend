import mongoose from 'mongoose'

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  region: { type: String, required: true },
  location: {
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    address: { type: String },
  },
  attractions: [{ type: String }],
  bestTimeToVisit: [{ type: String }],
  images: [{ type: String }],
  coverImage: { type: String, required: true },
  climate: { type: String },
  localCuisine: [{ type: String }],
  nearbyAccommodations: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  ],
  tours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Destination = mongoose.model('Destination', DestinationSchema)
export default Destination
