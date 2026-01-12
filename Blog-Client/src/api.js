const API_BASE = 'http://localhost:3000';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Auth API calls
export const authAPI = {
    signup: async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },

    login: async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', email);
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
    },

    isLoggedIn: () => !!getToken(),

    getUserEmail: () => localStorage.getItem('userEmail'),
};

// Blog API calls
export const blogAPI = {
    getPublicBlogs: async () => {
        const res = await fetch(`${API_BASE}/blogs/public`);
        return res.json();
    },

    getMyBlogs: async () => {
        const res = await fetch(`${API_BASE}/blogs/my`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return res.json();
    },

    createBlog: async (title, content, isPublic = true) => {
        const res = await fetch(`${API_BASE}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ title, content, isPublic }),
        });
        return res.json();
    },

    updateBlog: async (id, title, content, isPublic) => {
        const res = await fetch(`${API_BASE}/blogs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ title, content, isPublic }),
        });
        return res.json();
    },

    deleteBlog: async (id) => {
        const res = await fetch(`${API_BASE}/blogs/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return res.json();
    },

    toggleLike: async (id) => {
        const res = await fetch(`${API_BASE}/blogs/${id}/like`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return res.json();
    },
};
