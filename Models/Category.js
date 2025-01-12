const mongoose = require('mongoose');

// Define Category Schema
const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subcat: [
      {
        type: String,
        required: true,
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Category model
exports.Category = mongoose.model('Category', CategorySchema);
