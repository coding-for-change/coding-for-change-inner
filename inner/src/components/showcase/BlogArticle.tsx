import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCmsCollection, mediaUrl } from '../../api';
import { CmsBlogPost } from '../../api/types';
import { LexicalRenderer } from '../general';
import { useLanguage } from '../../contexts/LanguageContext';
import './landing.css';

const BLOG_PARAMS = { depth: '2' };

const formatDate = (iso: string, locale: string) =>
    new Date(iso).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

const initials = (name: string) =>
    name
        .split(' ')
        .map((n: string) => n[0])
        .join('');

const BlogArticle: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { t, locale } = useLanguage();
    const { data: posts, loading } = useCmsCollection<CmsBlogPost>(
        'blog-posts',
        BLOG_PARAMS
    );

    const post = (posts ?? []).find((p) => p.slug === slug) ?? null;

    const backButton = (
        <button className="lp-back" onClick={() => navigate('/blog')}>
            ← {t.blog.back}
        </button>
    );

    if (loading) {
        return (
            <div className="lp lp-page">
                <div className="lp-inner">
                    <p className="lp-loading">Loading…</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="lp lp-page">
                <div className="lp-inner">
                    {backButton}
                    <h2 className="lp-page__title" style={{ marginTop: 24 }}>
                        {t.blog.notFound}
                    </h2>
                </div>
            </div>
        );
    }

    const imgSrc = mediaUrl(post.featuredImage ?? null);
    const author =
        post.author && typeof post.author !== 'number' ? post.author : null;
    const project =
        post.project && typeof post.project !== 'number' ? post.project : null;
    const authorImgSrc = author ? mediaUrl(author.image ?? null) : null;

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                {backButton}
                <motion.div
                    className="lp-article"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {imgSrc && (
                        <div className="lp-article__hero">
                            <img
                                src={imgSrc}
                                alt={post.featuredImage?.alt ?? post.title}
                            />
                        </div>
                    )}

                    <h1 className="lp-article__title">{post.title}</h1>

                    <div className="lp-article__meta">
                        {author && (
                            <div className="lp-author">
                                {authorImgSrc ? (
                                    <img
                                        className="lp-author__avatar"
                                        src={authorImgSrc}
                                        alt={author.name}
                                    />
                                ) : (
                                    <div className="lp-author__avatar-ph">
                                        {initials(author.name)}
                                    </div>
                                )}
                                <div className="lp-author__text">
                                    <span className="lp-author__name">
                                        {author.name}
                                    </span>
                                    <span className="lp-author__role">
                                        {author.role}
                                    </span>
                                </div>
                            </div>
                        )}
                        <span className="lp-article__date">
                            {formatDate(post.publishedAt, locale)}
                        </span>
                        {project && (
                            <span
                                className="lp-article__date"
                                style={{ color: '#246b6c' }}
                            >
                                Re: {project.title}
                            </span>
                        )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div className="lp-pills">
                            {post.tags.map((tg) => (
                                <span key={tg.tag} className="lp-pill">
                                    {tg.tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <hr className="lp-article__divider" />

                    <p className="lp-article__lead">{post.excerpt}</p>

                    <div className="text-block">
                        <LexicalRenderer doc={post.content} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BlogArticle;
