const mongoose = require("mongoose");
const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title must be required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true, // Ensure uniqueness
    },
    content: {
      type: String,
      required: [true, "Content Must be Required "],
    },
    image: { type: String }, // Path to uploaded image
    category: {
      type: String,
      required: [true, "Category Must be Required "],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// **Generate slug before saving**
blogSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
