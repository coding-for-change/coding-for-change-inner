import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../showcase/Home';
import About from '../showcase/About';
import Events from '../showcase/Events';
import CFCProjects from '../showcase/CFCProjects';
import Sponsors from '../showcase/Sponsors';
import Team from '../showcase/Team';
import QA from '../showcase/QA';
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
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/projects" element={<CFCProjects />} />
                        <Route path="/sponsors" element={<Sponsors />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogArticle />} />
                        <Route path="/qa" element={<QA />} />
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
