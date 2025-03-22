const asyncHandler = require("express-async-handler");
const ApiError = require("./../utils/ApiError");
const blogModel = require("./../models/blogModel");
const slugify = require("slugify");

exports.addNewBlog = asyncHandler(async (req, res, next) => {
  const { title, content, image, category } = req.body;
  const userId = req.user._id;
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
    user: userId,
  });
  res.status(201).json({
    message: "Blog added successfully",
    blog: newBlog,
  });
});

exports.getBlogs = asyncHandler(async (req, res, next) => {
  let { search, page, skip, limit } = req.query;
  const userId = req.user._id;
  const query = { user: userId };

  page = parseInt(page, 10) * 1 || 1;
  limit = parseInt(limit, 10) * 1 || 10;
  skip = (page - 1) * limit;

  if (search) {
    query.$text = { $search: search };
  }
  const blogs = await blogModel.find(query).skip(skip).limit(limit);
  if (!blogs) {
    return next(new ApiError("No blogs found", 404));
  }
  res.json({
    message: "Blogs fetched successfully",
    results: blogs.length,
    page,
    limit,
    blogs,
    userId,
  });
});

exports.getBlogById = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  const blog = await blogModel.findOne({ _id: id, user: userId });
  if (!blog) {
    return next(new ApiError(`Blog not found with this id : ${id}`, 404));
  }
  res.status(200).json({
    message: "Blog fetched successfully",
    blog,
  });
});

exports.updateBlog = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { title, content, image, category } = req.body;

  const blog = await blogModel.findOneAndUpdate(
    { _id: id, user: userId },
    { title, content, image, category },
    { new: true }
  );

  if (!blog) {
    return next(new ApiError(`Blog not found with this id : ${id}`, 404));
  }
  res.status(200).json({
    message: "Blog updated successfully",
    blog,
  });
});

exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const deleteBlog = await blogModel.findOneAndDelete({
    _id: req.params.id,
    user: userId,
  });
  if (!deleteBlog) {
    return next(new ApiError(`Blog not found with this id : ${id}`, 404));
  }
  res.status(200).json({
    message: "Blog deleted successfully",
  });
});
