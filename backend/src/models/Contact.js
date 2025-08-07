import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique user-contact pairs
contactSchema.index({ user: 1, contact: 1 }, { unique: true });

// Index for efficient querying by user and sorting by lastMessageAt
contactSchema.index({ user: 1, lastMessageAt: -1 });

export default mongoose.model("Contact", contactSchema);