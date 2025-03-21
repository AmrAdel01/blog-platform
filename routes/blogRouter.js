const express = require("express");
const {
  addNewBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("./../controllers/blogController");
const { protect } = require("./../middleware/authMiddleware");
const {
  createBlogValidation,
  updateBlogValidation,
  getOrDeleteBlogValidation,
} = require("./../utils/validator/blogvalidation");

// Define the blog routes and their respective handlers
const router = express.Router();

router.use(protect); // Apply authentication middleware to all routes below this one

router.route("/").post(createBlogValidation, addNewBlog).get(getBlogs);
router
  .route("/:id")
  .get(getOrDeleteBlogValidation, getBlogById)
  .put(updateBlogValidation, updateBlog)
  .delete(getOrDeleteBlogValidation, deleteBlog);

module.exports = router;
