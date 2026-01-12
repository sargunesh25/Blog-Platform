const express = require("express");
const router = express.Router();
const auth = require("../Middleware/authMiddleware");

const {
    createBlog,
    getPublicBlogs,
    getMyBlogs,
    getablog,
    deleteBlog,
    updateBlog,
    toggleLike
} = require("../controller/blogcontroller");

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management APIs
 */

/**
 * @swagger
 * /blogs/public:
 *   get:
 *     summary: Get all public blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of all public blogs
 */
router.get("/public", getPublicBlogs);

/**
 * @swagger
 * /blogs/my:
 *   get:
 *     summary: Get current user's blogs
 *     security:
 *       - bearerAuth: []
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of user's blogs
 */
router.get("/my", auth, getMyBlogs);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog details
 *       404:
 *         description: Blog not found
 */
router.get("/:id", getablog);

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     security:
 *       - bearerAuth: []
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first blog
 *               content:
 *                 type: string
 *                 example: This is the content of my first blog
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Blog created successfully
 */
router.post("/", auth, createBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog
 *     security:
 *       - bearerAuth: []
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Blog updated successfully
 */
router.put("/:id", auth, updateBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     security:
 *       - bearerAuth: []
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 */
router.delete("/:id", auth, deleteBlog);

/**
 * @swagger
 * /blogs/{id}/like:
 *   post:
 *     summary: Like or unlike a blog
 *     security:
 *       - bearerAuth: []
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog liked or unliked
 */
router.post("/:id/like", auth, toggleLike);

module.exports = router;