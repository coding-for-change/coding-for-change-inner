import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCmsCollection, mediaUrl } from '../../api';
import { CmsBlogPost } from '../../api/types';
import { RetroLoader } from '../general';
import useIsMobile from '../../hooks/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import Colors from '../../constants/colors';

const BLOG_PARAMS = { depth: '2' };

const formatDate = (iso: string, locale: string) =>
    new Date(iso).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

interface PostCardProps {
    post: CmsBlogPost;
    onOpen: (slug: string) => void;
    isMobile: boolean;
    locale: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onOpen, isMobile, locale }) => {
    const imgSrc = mediaUrl(post.featuredImage ?? null);
    const author = post.author && typeof post.author !== 'number' ? post.author : null;
    const project = post.project && typeof post.project !== 'number' ? post.project : null;

    return (
        <div
            className="big-button-container"
            style={Object.assign(
                {},
                styles.card,
                isMobile ? styles.cardMobile : {}
            )}
            onClick={() => onOpen(post.slug)}
        >
            {imgSrc && (
                <div
                    style={Object.assign(
                        {},
                        styles.thumbWrap,
                        isMobile ? styles.thumbWrapMobile : {}
                    )}
                >
                    <img
                        src={imgSrc}
                        alt={post.featuredImage?.alt ?? post.title}
                        style={styles.thumbImg}
                    />
                </div>
            )}
            <div style={styles.cardBody}>
                <h2 style={styles.cardTitle}>{post.title}</h2>
                <div style={styles.metaRow}>
                    {author && <span style={styles.metaText}>by {author.name}</span>}
                    <span style={styles.metaText}>{formatDate(post.publishedAt, locale)}</span>
                    {project && <span style={styles.metaProject}>Re: {project.title}</span>}
                </div>
                <p style={styles.excerpt}>{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                    <div style={styles.tagRow}>
                        {post.tags.map((tg) => (
                            <span key={tg.tag} style={styles.tagChip}>
                                {tg.tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const Blog: React.FC = () => {
    const { data: posts, loading } = useCmsCollection<CmsBlogPost>('blog-posts', BLOG_PARAMS);
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const { t, locale } = useLanguage();

    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="site-page-content">
                <RetroLoader />
            </div>
        );
    }

    const allTags = Array.from(
        new Set((posts ?? []).flatMap((p) => (p.tags ?? []).map((tg) => tg.tag)))
    ).sort();

    const filtered = (posts ?? [])
        .filter((p) => !activeTag || (p.tags ?? []).some((tg) => tg.tag === activeTag))
        .filter((p) => {
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
        <div className="site-page-content">
            <h1>{t.blog.title}</h1>
            <h3>{t.blog.subtitle}</h3>
            <br />

            <input
                type="text"
                placeholder={t.blog.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
            />

            {allTags.length > 0 && (
                <div style={styles.tagFilterRow}>
                    <button
                        className="site-button"
                        style={activeTag === null ? styles.activeTagBtn : {}}
                        onClick={() => setActiveTag(null)}
                    >
                        {t.blog.all}
                    </button>
                    {allTags.map((tag) => (
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
                {filtered.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onOpen={(slug) => navigate(`/blog/${slug}`)}
                        isMobile={isMobile}
                        locale={locale}
                    />
                ))}
                {filtered.length === 0 && (
                    <p style={styles.empty}>{t.blog.noPosts}</p>
                )}
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    searchInput: {
        width: '100%',
        maxWidth: 520,
        marginBottom: 16,
        marginTop: 8,
    },
    tagFilterRow: {
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 28,
    },
    activeTagBtn: {
        backgroundColor: Colors.blue,
        color: '#ffffff',
    },
    postList: {
        flexDirection: 'column',
        gap: 20,
        width: '100%',
    },
    card: {
        flexDirection: 'row',
        cursor: 'pointer',
        overflow: 'hidden',
        padding: 0,
        width: '100%',
        boxSizing: 'border-box',
        alignItems: 'stretch',
    },
    cardMobile: {
        flexDirection: 'column',
    },
    thumbWrap: {
        width: 220,
        flexShrink: 0,
        overflow: 'hidden',
    },
    thumbWrapMobile: {
        width: '100%',
        height: 180,
    },
    thumbImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    cardBody: {
        flexDirection: 'column',
        padding: 20,
        flex: 1,
        minWidth: 0,
    },
    cardTitle: {
        marginBottom: 10,
        marginTop: 0,
    },
    metaRow: {
        gap: 14,
        flexWrap: 'wrap',
        marginBottom: 10,
        alignItems: 'center',
    },
    metaText: {
        fontSize: 13,
        color: Colors.darkGray,
        fontFamily: 'MSSerif, serif',
    },
    metaProject: {
        fontSize: 13,
        color: Colors.blue,
        fontFamily: 'MSSerif, serif',
    },
    excerpt: {
        fontSize: 15,
        marginBottom: 12,
        marginTop: 0,
    },
    tagRow: {
        flexWrap: 'wrap',
        gap: 6,
    },
    tagChip: {
        backgroundColor: '#c0c0c0',
        border: '1px solid #808080',
        padding: '2px 8px',
        fontSize: 12,
        fontFamily: 'MSSerif, serif',
    },
    empty: {
        color: Colors.darkGray,
        fontStyle: 'italic',
    },
};

export default Blog;
