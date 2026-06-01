import React, { useState } from 'react';
import { CmsBlogPost } from '../../api/types';
import { mediaUrl } from '../../api';
import { RetroLoader } from '../general';
import Colors from '../../constants/colors';

interface BlogListProps {
    posts: CmsBlogPost[] | null;
    loading: boolean;
    onSelectPost: (post: CmsBlogPost) => void;
}

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

interface PostCardProps {
    post: CmsBlogPost;
    onClick: (post: CmsBlogPost) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
    const imgSrc = mediaUrl(post.featuredImage ?? null);
    const authorName = post.author && typeof post.author !== 'number' ? post.author.name : null;
    const projectTitle = post.project && typeof post.project !== 'number' ? post.project.title : null;

    return (
        <div
            className="big-button-container"
            style={styles.card}
            onClick={() => onClick(post)}
        >
            {imgSrc && (
                <img src={imgSrc} alt={post.featuredImage?.alt ?? post.title} style={styles.thumbnail} />
            )}
            <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{post.title}</h3>
                <div style={styles.metaRow}>
                    {authorName && <span style={styles.metaText}>by {authorName}</span>}
                    <span style={styles.metaText}>{formatDate(post.publishedAt)}</span>
                    {projectTitle && <span style={styles.metaText}>Re: {projectTitle}</span>}
                </div>
                <p style={styles.excerpt}>{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                    <div style={styles.tagRow}>
                        {post.tags.map(t => (
                            <span key={t.tag} style={styles.tagChip}>{t.tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const BlogList: React.FC<BlogListProps> = ({ posts, loading, onSelectPost }) => {
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const allTags = Array.from(
        new Set((posts ?? []).flatMap(p => (p.tags ?? []).map(t => t.tag)))
    ).sort();

    const filtered = (posts ?? [])
        .filter(p => !activeTag || (p.tags ?? []).some(t => t.tag === activeTag))
        .filter(p => {
            if (!search) return true;
            const q = search.toLowerCase();
            const authorName = p.author && typeof p.author !== 'number' ? p.author.name : '';
            return (
                p.title.toLowerCase().includes(q) ||
                p.excerpt.toLowerCase().includes(q) ||
                authorName.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return (
        <div className="site-page-content" style={styles.container}>
            <h1>Engineering Blog</h1>
            <h3>Projects, lessons, and reflections from our teams</h3>
            <br />

            <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={styles.searchInput}
            />

            {allTags.length > 0 && (
                <div style={styles.tagFilterRow}>
                    <button
                        className="site-button"
                        style={activeTag === null ? styles.activeTagBtn : {}}
                        onClick={() => setActiveTag(null)}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            className="site-button"
                            style={activeTag === tag ? styles.activeTagBtn : {}}
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            <div style={styles.postList}>
                {loading && <RetroLoader />}
                {!loading && filtered.map(post => (
                    <PostCard key={post.id} post={post} onClick={onSelectPost} />
                ))}
                {!loading && filtered.length === 0 && (
                    <p style={{ color: Colors.darkGray, fontStyle: 'italic' }}>No posts found.</p>
                )}
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    container: {
        overflowY: 'auto',
        flexDirection: 'column',
    },
    searchInput: {
        width: '100%',
        padding: '6px 8px',
        marginBottom: 12,
        marginTop: 8,
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        fontSize: 14,
        boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #808080, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a',
        border: 'none',
        backgroundColor: '#ffffff',
    },
    tagFilterRow: {
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 20,
    },
    activeTagBtn: {
        backgroundColor: Colors.blue,
        color: '#ffffff',
    },
    postList: {
        flexDirection: 'column',
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        cursor: 'pointer',
        overflow: 'hidden',
        padding: 0,
        marginBottom: 0,
    },
    thumbnail: {
        width: 140,
        height: 100,
        objectFit: 'cover',
        flexShrink: 0,
    },
    cardBody: {
        flexDirection: 'column',
        padding: 12,
        flex: 1,
    },
    cardTitle: {
        marginBottom: 4,
        marginTop: 0,
    },
    metaRow: {
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 6,
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: Colors.darkGray,
        fontFamily: 'MSSerif, serif',
    },
    excerpt: {
        fontSize: 13,
        marginBottom: 8,
        marginTop: 0,
    },
    tagRow: {
        flexWrap: 'wrap',
        gap: 4,
    },
    tagChip: {
        backgroundColor: '#c0c0c0',
        border: '1px solid #808080',
        padding: '2px 6px',
        fontSize: 11,
        fontFamily: 'MSSerif, serif',
    },
};

export default BlogList;
