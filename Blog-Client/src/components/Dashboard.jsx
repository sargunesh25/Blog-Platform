import { useState, useEffect, useCallback } from 'react';
import { authAPI, blogAPI } from '../api';
import BlogCard from './BlogCard';
import EditModal from './EditModal';

function Dashboard({ onLogout }) {
    const [publicBlogs, setPublicBlogs] = useState([]);
    const [myBlogs, setMyBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [creating, setCreating] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    const userEmail = authAPI.getUserEmail();

    // Get current user ID from token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(payload.id);
            } catch (e) {
                console.error('Error parsing token:', e);
            }
        }
    }, []);

    // Fetch blogs
    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const [publicData, myData] = await Promise.all([
                blogAPI.getPublicBlogs(),
                blogAPI.getMyBlogs()
            ]);
            setPublicBlogs(Array.isArray(publicData) ? publicData : []);
            setMyBlogs(Array.isArray(myData) ? myData : []);
        } catch (err) {
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Create blog
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setCreating(true);
        try {
            await blogAPI.createBlog(title, content, isPublic);
            setTitle('');
            setContent('');
            setIsPublic(true);
            await fetchBlogs();
        } catch (err) {
            console.error('Error creating blog:', err);
        } finally {
            setCreating(false);
        }
    };

    // Like blog
    const handleLike = async (blogId) => {
        try {
            await blogAPI.toggleLike(blogId);
            await fetchBlogs();
        } catch (err) {
            console.error('Error liking blog:', err);
        }
    };

    // Edit blog
    const handleEdit = (blog) => {
        setEditingBlog(blog);
    };

    const handleSaveEdit = async (id, newTitle, newContent, newIsPublic) => {
        try {
            await blogAPI.updateBlog(id, newTitle, newContent, newIsPublic);
            setEditingBlog(null);
            await fetchBlogs();
        } catch (err) {
            console.error('Error updating blog:', err);
        }
    };

    // Delete blog
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        try {
            await blogAPI.deleteBlog(id);
            await fetchBlogs();
        } catch (err) {
            console.error('Error deleting blog:', err);
        }
    };

    // Logout
    const handleLogout = () => {
        authAPI.logout();
        onLogout();
    };

    // Filter out user's blogs from public blogs to avoid duplicates
    const otherPublicBlogs = publicBlogs.filter(
        blog => !myBlogs.some(myBlog => myBlog._id === blog._id)
    );

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <h1>📝 Blog Platform</h1>
                    <div className="header-actions">
                        <span className="user-info">{userEmail}</span>
                        <button className="btn btn-outline" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-content">
                {/* Create Blog Section */}
                <section className="create-blog-section">
                    <h2>✍️ Create New Blog</h2>
                    <form className="create-form" onSubmit={handleCreate}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Blog Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Write your blog content here..."
                                rows="4"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <label className="visibility-toggle">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                />
                                <span className="toggle-label">
                                    {isPublic ? '🌍 Public' : '🔒 Private'}
                                </span>
                            </label>
                            <button type="submit" className="btn btn-primary" disabled={creating}>
                                {creating ? 'Publishing...' : 'Publish Blog'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* My Blogs Section */}
                <section className="blogs-section">
                    <h2>📚 My Blogs ({myBlogs.length})</h2>
                    <div className="blogs-grid">
                        {loading ? (
                            <div className="loading">Loading...</div>
                        ) : myBlogs.length === 0 ? (
                            <div className="empty-state">
                                <p>You haven't created any blogs yet. Create your first blog above!</p>
                            </div>
                        ) : (
                            myBlogs.map((blog) => (
                                <BlogCard
                                    key={blog._id}
                                    blog={blog}
                                    isOwner={true}
                                    currentUserId={currentUserId}
                                    onLike={handleLike}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </section>

                {/* All Public Blogs Section */}
                <section className="blogs-section">
                    <h2>🌍 Public Blogs from Others ({otherPublicBlogs.length})</h2>
                    <div className="blogs-grid">
                        {loading ? (
                            <div className="loading">Loading...</div>
                        ) : otherPublicBlogs.length === 0 ? (
                            <div className="empty-state">
                                <p>No public blogs from other users yet.</p>
                            </div>
                        ) : (
                            otherPublicBlogs.map((blog) => (
                                <BlogCard
                                    key={blog._id}
                                    blog={blog}
                                    isOwner={false}
                                    currentUserId={currentUserId}
                                    onLike={handleLike}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Edit Modal */}
            {editingBlog && (
                <EditModal
                    blog={editingBlog}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingBlog(null)}
                />
            )}
        </div>
    );
}

export default Dashboard;
