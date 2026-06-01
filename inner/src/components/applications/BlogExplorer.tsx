import React, { useState } from 'react';
import Window from '../os/Window';
import { useCmsCollection } from '../../api';
import { CmsBlogPost } from '../../api/types';
import BlogList from './BlogList';
import BlogPostDetail from './BlogPostDetail';

export interface BlogExplorerProps extends WindowAppProps {}

const BLOG_PARAMS = { depth: '2' };

const BlogExplorer: React.FC<BlogExplorerProps> = (props) => {
    const { data: posts, loading } = useCmsCollection<CmsBlogPost>('blog-posts', BLOG_PARAMS);
    const [selectedPost, setSelectedPost] = useState<CmsBlogPost | null>(null);

    return (
        <Window
            top={60}
            left={80}
            width={900}
            height={700}
            windowTitle={selectedPost ? selectedPost.title : 'Engineering Blog'}
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={selectedPost ? '' : `${posts?.length ?? 0} posts`}
        >
            {selectedPost ? (
                <BlogPostDetail
                    post={selectedPost}
                    onBack={() => setSelectedPost(null)}
                />
            ) : (
                <BlogList
                    posts={posts}
                    loading={loading}
                    onSelectPost={setSelectedPost}
                />
            )}
        </Window>
    );
};

export default BlogExplorer;
