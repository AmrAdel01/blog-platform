const asyncHandler = require("express-async-handler");
const ApiError = require("./../utils/ApiError");
const blogModel = require("./../models/blogModel");
const slugify = require("slugify");

exports.addNewBlog = asyncHandler(async (req, res, next) => {
  const { title, content, image, category, createdAt } = req.body;
  const blogExist = await blogModel.findOne({
    title,
    content,
  });
  if (blogExist) {
    return res.status(200).json({
      message: "Blog already exists",
      blog: blogExist,
    });
  }
  const newBlog = await blogModel.create({
    title,
    slug: slugify(title, { lower: true, strict: true }),
    content,
    image,
    category,
  });
  res.status(201).json({
    message: "Blog added successfully",
    blog: newBlog,
  });
});

exports.getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await blogModel.find({});
  if (!blogs) {
    return next(new ApiError("No blogs found", 404));
  }
  res.json({
    message: "Blogs fetched successfully",
    results: blogs.length,
    blogs,
  });
});

exports.getBlogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blog = await blogModel.findById(id);
  if (!blog) {
    return next(new ApiError(`Blog not found with this id : ${id}`, 404));
  }
  res.status(200).json({
    message: "Blog fetched successfully",
    blog,
  });
});

exports.updateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blog = await blogModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    return next(new ApiError(`Blog not found with this id : ${id}`, 404));
  }
  res.status(200).json({
    message: "Blog updated successfully",
    blog,
  });
});

exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blog = await blogModel.findByIdAndDelete(id);
  if (!blog) {
    return next(new ApiError(`Blog not found with this id : ${id}`, 404));
  }
  res.status(200).json({
    message: "Blog deleted successfully",
  });
});
