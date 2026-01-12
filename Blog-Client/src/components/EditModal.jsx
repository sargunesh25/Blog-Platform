import { useState, useEffect } from 'react';

function EditModal({ blog, onSave, onClose }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (blog) {
            setTitle(blog.title || '');
            setContent(blog.content || '');
            setIsPublic(blog.isPublic !== undefined ? blog.isPublic : true);
        }
    }, [blog]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(blog._id, title, content, isPublic);
        setLoading(false);
    };

    if (!blog) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Blog</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            rows="6"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
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
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;
