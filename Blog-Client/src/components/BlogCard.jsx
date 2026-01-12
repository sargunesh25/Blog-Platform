function BlogCard({ blog, isOwner, onLike, onEdit, onDelete, currentUserId }) {
    const likesArray = blog.likes || [];
    const isLiked = currentUserId && likesArray.includes(currentUserId);

    const handleLike = async () => {
        await onLike(blog._id);
    };

    return (
        <div className="blog-card">
            <div className="blog-header">
                <h3>{blog.title}</h3>
                <span className={`visibility-badge ${blog.isPublic ? 'public' : 'private'}`}>
                    {blog.isPublic ? '🌍 Public' : '🔒 Private'}
                </span>
            </div>
            <p>{blog.content}</p>

            <div className="blog-meta">
                <span>👁️ {blog.views || 0} views</span>
                <span>❤️ {likesArray.length} likes</span>
            </div>

            <div className="blog-actions">
                <button
                    className={`like-btn ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    {isLiked ? '❤️' : '🤍'} <span className="like-count">{likesArray.length}</span>
                </button>

                {isOwner && (
                    <>
                        <button
                            className="btn btn-outline btn-small"
                            onClick={() => onEdit(blog)}
                        >
                            ✏️ Edit
                        </button>
                        <button
                            className="btn btn-danger btn-small"
                            onClick={() => onDelete(blog._id)}
                        >
                            🗑️ Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default BlogCard;
