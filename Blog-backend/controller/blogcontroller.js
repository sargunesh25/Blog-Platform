const Blog = require("../models/Blog");

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const { title, content, isPublic } = req.body;
        const blog = await Blog.create({
            title,
            content,
            isPublic: isPublic !== undefined ? isPublic : true,
            userId: req.user.id,
        });
        res.json({ message: "Blog created ✅", blog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error ❌" });
    }
};

// Get all PUBLIC blogs (no auth required)
exports.getPublicBlogs = async (req, res) => {
    try {
        const publicBlogs = await Blog.find({ isPublic: true }).sort({ createdAt: -1 });
        res.json(publicBlogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error ❌" });
    }
};

// Get current user's blogs only (auth required)
exports.getMyBlogs = async (req, res) => {
    try {
        const myBlogs = await Blog.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(myBlogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error ❌" });
    }
};

// Get a single blog by ID
exports.getablog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("userId", "name email");
        if (!blog) return res.status(404).json({ message: "Blog not found ❌" });

        // Increment views
        blog.views += 1;
        await blog.save();

        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a blog (only owner can delete)
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found ❌" });
        }
        if (blog.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized - Can't delete this blog ❌" });
        }
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted ✅" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error ❌" });
    }
};

// Update a blog (only owner can update)
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found ❌" });
        }
        if (blog.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized - Can't edit this blog ❌" });
        }

        const { title, content, isPublic } = req.body;
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (isPublic !== undefined) updateData.isPublic = isPublic;

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ message: "Blog updated ✅", blog: updatedBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error ❌" });
    }
};

// Toggle like on a blog
exports.toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found ❌" });
        }

        const userId = req.user.id;
        const index = blog.likes.indexOf(userId);

        if (index === -1) {
            // Like the blog
            blog.likes.push(userId);
            await blog.save();
            return res.json({ message: "Blog liked ✅", blog });
        } else {
            // Unlike the blog
            blog.likes = blog.likes.filter((id) => id.toString() !== userId);
            await blog.save();
            return res.json({ message: "Blog unliked ❤️‍🔥", blog });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error ❌" });
    }
};
