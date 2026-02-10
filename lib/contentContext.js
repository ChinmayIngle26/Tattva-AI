'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { BLOGS, ANNOUNCEMENTS, RESOURCES, DOMAINS } from './data';

const ContentContext = createContext({
    blogs: [],
    announcements: [],
    resources: [],
    siteContent: {},
    addBlog: () => { },
    updateBlog: () => { },
    deleteBlog: () => { },
    addAnnouncement: () => { },
    updateAnnouncement: () => { },
    deleteAnnouncement: () => { },
    addResource: () => { },
    deleteResource: () => { },
    updateSiteContent: () => { },
    loading: true,
});

export const ContentProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [resources, setResources] = useState([]);
    const [siteContent, setSiteContent] = useState({
        aboutUs: "Tattva AI is a student-driven technical club fostering innovation in AI/ML, Web Development, and Android Development. Join us to learn, build, and grow.",
        contactEmail: "hello@tattva.ai",
        domainDescriptions: {}
    });
    const [loading, setLoading] = useState(true);

    // Initialize data from localStorage or default data
    useEffect(() => {
        try {
            const storedBlogs = localStorage.getItem('tattva_blogs');
            const storedAnnouncements = localStorage.getItem('tattva_announcements');
            const storedResources = localStorage.getItem('tattva_resources');
            const storedSiteContent = localStorage.getItem('tattva_site_content');

            setBlogs(storedBlogs ? JSON.parse(storedBlogs) : BLOGS.map(b => ({ ...b, status: 'published' })));
            // Default blogs are considered published

            setAnnouncements(storedAnnouncements ? JSON.parse(storedAnnouncements) : ANNOUNCEMENTS.map(a => ({ ...a, status: 'published' })));

            setResources(storedResources ? JSON.parse(storedResources) : RESOURCES);

            if (storedSiteContent) {
                setSiteContent(JSON.parse(storedSiteContent));
            } else {
                // Initialize default domain descriptions
                const initialDomainDescs = {};
                DOMAINS.forEach(d => initialDomainDescs[d.id] = d.description);
                setSiteContent(prev => ({ ...prev, domainDescriptions: initialDomainDescs }));
            }

        } catch (e) {
            console.error('Failed to parse content data', e);
        } finally {
            setLoading(false);
        }
    }, []);

    // Persistence Effects
    useEffect(() => { if (!loading) localStorage.setItem('tattva_blogs', JSON.stringify(blogs)); }, [blogs, loading]);
    useEffect(() => { if (!loading) localStorage.setItem('tattva_announcements', JSON.stringify(announcements)); }, [announcements, loading]);
    useEffect(() => { if (!loading) localStorage.setItem('tattva_resources', JSON.stringify(resources)); }, [resources, loading]);
    useEffect(() => { if (!loading) localStorage.setItem('tattva_site_content', JSON.stringify(siteContent)); }, [siteContent, loading]);


    // BLOG ACTIONS
    const addBlog = (blog) => {
        const newBlog = {
            ...blog,
            date: new Date().toISOString().split('T')[0],
            status: blog.status || 'draft' // draft, pending, published, rejected
        };
        setBlogs(prev => [newBlog, ...prev]);
        return { success: true };
    };

    const updateBlog = (slug, updatedData) => {
        setBlogs(prev => prev.map(b => b.slug === slug ? { ...b, ...updatedData } : b));
        return { success: true };
    };

    const deleteBlog = (slug) => {
        setBlogs(prev => prev.filter(b => b.slug !== slug));
        return { success: true };
    };

    // ANNOUNCEMENT ACTIONS
    const addAnnouncement = (announcement) => {
        const newAnn = {
            ...announcement,
            id: `ann-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            status: announcement.status || 'draft'
        };
        setAnnouncements(prev => [newAnn, ...prev]);
        return { success: true };
    };

    const updateAnnouncement = (id, updatedData) => {
        setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
        return { success: true, message: 'Updated successfully' };
    };

    const deleteAnnouncement = (id) => {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        return { success: true };
    };

    // RESOURCE ACTIONS
    const addResource = (resource) => {
        const newRes = {
            ...resource,
            id: `res-${Date.now()}`,
            date: new Date().toISOString().split('T')[0]
        };
        setResources(prev => [newRes, ...prev]);
        return { success: true };
    };

    const deleteResource = (id) => {
        setResources(prev => prev.filter(r => r.id !== id));
        return { success: true };
    };

    // SITE CONTENT ACTIONS
    const updateSiteContent = (key, value, nestedKey = null) => {
        setSiteContent(prev => {
            if (nestedKey) {
                return {
                    ...prev,
                    [key]: {
                        ...prev[key],
                        [nestedKey]: value
                    }
                };
            }
            return { ...prev, [key]: value };
        });
        return { success: true };
    };

    return (
        <ContentContext.Provider value={{
            blogs, addBlog, updateBlog, deleteBlog,
            announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
            resources, addResource, deleteResource,
            siteContent, updateSiteContent,
            loading
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => useContext(ContentContext);
