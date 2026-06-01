import React from 'react';
import { CmsBlogPost } from '../../api/types';
import { mediaUrl } from '../../api';
import { LexicalRenderer } from '../general';
import Colors from '../../constants/colors';

interface BlogPostDetailProps {
    post: CmsBlogPost;
    onBack: () => void;
}

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post, onBack }) => {
    const imgSrc = mediaUrl(post.featuredImage ?? null);
    const author = post.author && typeof post.author !== 'number' ? post.author : null;
    const project = post.project && typeof post.project !== 'number' ? post.project : null;
    const authorImgSrc = author ? mediaUrl(author.image ?? null) : null;

    return (
        <div className="site-page-content" style={styles.container}>
            <button className="site-button" onClick={onBack} style={styles.backBtn}>
                ← Back to Blog
            </button>

            {imgSrc && (
                <div style={styles.heroBanner}>
                    <img src={imgSrc} alt={post.featuredImage?.alt ?? post.title} style={styles.heroImg} />
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
                                    {author.name.split(' ').map((n: string) => n[0]).join('')}
                                </span>
                            </div>
                        )}
                        <div style={styles.authorText}>
                            <span style={styles.authorName}>{author.name}</span>
                            <span style={styles.authorRole}>{author.role}</span>
                        </div>
                    </div>
                )}
                <span style={styles.date}>{formatDate(post.publishedAt)}</span>
                {project && (
                    <span style={styles.projectRef}>Re: {project.title}</span>
                )}
            </div>

            {post.tags && post.tags.length > 0 && (
                <div style={styles.tagRow}>
                    {post.tags.map(t => (
                        <span key={t.tag} style={styles.tagChip}>{t.tag}</span>
                    ))}
                </div>
            )}

            <hr style={styles.divider} />

            <p style={styles.excerptLead}>{post.excerpt}</p>

            <hr style={styles.divider} />

            <div className="text-block">
                <LexicalRenderer doc={post.content} />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    container: {
        overflowY: 'auto',
        flexDirection: 'column',
    },
    backBtn: {
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    heroBanner: {
        width: '100%',
        marginBottom: 20,
        overflow: 'hidden',
    },
    heroImg: {
        width: '100%',
        maxHeight: 300,
        objectFit: 'cover',
        display: 'block',
    },
    title: {
        marginBottom: 12,
        marginTop: 0,
    },
    metaRow: {
        gap: 20,
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    authorBlock: {
        gap: 10,
        alignItems: 'center',
    },
    avatarImg: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        objectFit: 'cover',
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: '#008080',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    avatarInitials: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    authorText: {
        flexDirection: 'column',
    },
    authorName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    authorRole: {
        fontSize: 12,
        color: Colors.darkGray,
        fontStyle: 'italic',
    },
    date: {
        fontSize: 13,
        fontFamily: 'MSSerif, serif',
        color: Colors.darkGray,
    },
    projectRef: {
        fontSize: 13,
        fontFamily: 'MSSerif, serif',
        color: Colors.blue,
    },
    tagRow: {
        flexWrap: 'wrap',
        gap: 4,
        marginBottom: 12,
    },
    tagChip: {
        backgroundColor: '#c0c0c0',
        border: '1px solid #808080',
        padding: '2px 6px',
        fontSize: 11,
        fontFamily: 'MSSerif, serif',
    },
    divider: {
        border: 'none',
        borderTop: '1px solid #888',
        margin: '12px 0',
        width: '100%',
    },
    excerptLead: {
        fontStyle: 'italic',
        fontSize: 15,
        color: Colors.darkGray,
        marginBottom: 12,
    },
};

export default BlogPostDetail;
