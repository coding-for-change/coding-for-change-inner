import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCmsCollection, mediaUrl } from '../../api';
import { CmsBlogPost } from '../../api/types';
import { RetroLoader, LexicalRenderer } from '../general';
import { useLanguage } from '../../contexts/LanguageContext';
import Colors from '../../constants/colors';

const BLOG_PARAMS = { depth: '2' };

const formatDate = (iso: string, locale: string) =>
    new Date(iso).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

const BlogArticle: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { t, locale } = useLanguage();
    const { data: posts, loading } = useCmsCollection<CmsBlogPost>('blog-posts', BLOG_PARAMS);

    const post = (posts ?? []).find((p) => p.slug === slug) ?? null;

    const BackButton = (
        <button
            className="site-button"
            style={styles.backBtn}
            onClick={() => navigate('/blog')}
        >
            ← {t.blog.back}
        </button>
    );

    if (loading) {
        return (
            <div className="site-page-content">
                <RetroLoader />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="site-page-content">
                {BackButton}
                <h2 style={{ marginTop: 24 }}>{t.blog.notFound}</h2>
            </div>
        );
    }

    const imgSrc = mediaUrl(post.featuredImage ?? null);
    const author = post.author && typeof post.author !== 'number' ? post.author : null;
    const project = post.project && typeof post.project !== 'number' ? post.project : null;
    const authorImgSrc = author ? mediaUrl(author.image ?? null) : null;

    return (
        <div className="site-page-content">
            {BackButton}

            {imgSrc && (
                <div style={styles.heroBanner}>
                    <img
                        src={imgSrc}
                        alt={post.featuredImage?.alt ?? post.title}
                        style={styles.heroImg}
                    />
                </div>
            )}

            <h1 style={styles.title}>{post.title}</h1>

            <div style={styles.metaRow}>
                {author && (
                    <div style={styles.authorBlock}>
                        {authorImgSrc ? (
                            <img src={authorImgSrc} alt={author.name} style={styles.avatarImg} />
                        ) : (
                            <div style={styles.avatarPlaceholder}>
                                <span style={styles.avatarInitials}>
                                    {author.name
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')}
                                </span>
                            </div>
                        )}
                        <div style={styles.authorText}>
                            <span style={styles.authorName}>{author.name}</span>
                            <span style={styles.authorRole}>{author.role}</span>
                        </div>
                    </div>
                )}
                <span style={styles.date}>{formatDate(post.publishedAt, locale)}</span>
                {project && <span style={styles.projectRef}>Re: {project.title}</span>}
            </div>

            {post.tags && post.tags.length > 0 && (
                <div style={styles.tagRow}>
                    {post.tags.map((tg) => (
                        <span key={tg.tag} style={styles.tagChip}>
                            {tg.tag}
                        </span>
                    ))}
                </div>
            )}

            <hr style={styles.divider} />

            <p style={styles.excerptLead}>{post.excerpt}</p>

            <div className="text-block">
                <LexicalRenderer doc={post.content} />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    backBtn: {
        alignSelf: 'flex-start',
        flexShrink: 0,
        marginBottom: 24,
        padding: '8px 16px',
    },
    heroBanner: {
        width: '100%',
        marginBottom: 24,
        overflow: 'hidden',
    },
    heroImg: {
        width: '100%',
        maxHeight: 360,
        objectFit: 'cover',
        display: 'block',
    },
    title: {
        marginBottom: 16,
        marginTop: 0,
    },
    metaRow: {
        gap: 24,
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 14,
    },
    authorBlock: {
        gap: 10,
        alignItems: 'center',
    },
    avatarImg: {
        width: 44,
        height: 44,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
    },
    avatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: '50%',
        backgroundColor: '#008080',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    avatarInitials: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    authorText: {
        flexDirection: 'column',
    },
    authorName: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    authorRole: {
        fontSize: 13,
        color: Colors.darkGray,
        fontStyle: 'italic',
    },
    date: {
        fontSize: 14,
        fontFamily: 'MSSerif, serif',
        color: Colors.darkGray,
    },
    projectRef: {
        fontSize: 14,
        fontFamily: 'MSSerif, serif',
        color: Colors.blue,
    },
    tagRow: {
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 16,
    },
    tagChip: {
        backgroundColor: '#c0c0c0',
        border: '1px solid #808080',
        padding: '2px 8px',
        fontSize: 12,
        fontFamily: 'MSSerif, serif',
    },
    divider: {
        border: 'none',
        borderTop: '1px solid #888',
        margin: '8px 0 16px 0',
        width: '100%',
    },
    excerptLead: {
        fontStyle: 'italic',
        fontSize: 17,
        color: Colors.darkGray,
        marginBottom: 8,
    },
};

export default BlogArticle;
