import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../showcase/Landing';
import Team from '../showcase/Team';
import BecomeAMember from '../showcase/BecomeAMember';
import Contact from '../showcase/Contact';
import Blog from '../showcase/Blog';
import BlogArticle from '../showcase/BlogArticle';
import MobileNav from './MobileNav';
import MobileFooter from './MobileFooter';
import ImprintPage from './ImprintPage';

// Height of the sticky nav bar — used to size the content area so that
// position:absolute pages (Home) fill the visible viewport below the nav.
const NAV_HEIGHT = 60;

const MobileLayout: React.FC = () => {
    return (
        <BrowserRouter>
            <div style={styles.layout}>
                <MobileNav />
                <div style={styles.content}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        {/* Legacy section URLs scroll to their section. */}
                        <Route path="/about" element={<Navigate to="/#about" replace />} />
                        <Route path="/events" element={<Navigate to="/#events" replace />} />
                        <Route path="/projects" element={<Navigate to="/#projects" replace />} />
                        <Route path="/sponsors" element={<Navigate to="/#sponsors" replace />} />
                        <Route path="/qa" element={<Navigate to="/#qa" replace />} />
                        {/* Standalone pages */}
                        <Route path="/team" element={<Team />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogArticle />} />
                        <Route path="/join" element={<BecomeAMember />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/imprint" element={<ImprintPage />} />
                    </Routes>
                </div>
                <MobileFooter />
            </div>
        </BrowserRouter>
    );
};

const styles: StyleSheetCSS = {
    layout: {
        flex: 1,
        width: '100%',
        minHeight: '100vh',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    },
    // Positioned wrapper so that Home's position:absolute fills the
    // visible screen below the nav, while normal-flow pages (About, etc.)
    // push this container taller and naturally scroll.
    content: {
        position: 'relative',
        flex: 1,
        minHeight: `calc(100vh - ${NAV_HEIGHT}px)`,
    },
};

export default MobileLayout;
