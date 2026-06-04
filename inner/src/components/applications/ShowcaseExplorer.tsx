import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Window from '../os/Window';
import Landing from '../showcase/Landing';
import TopNav from '../showcase/TopNav';
import Contact from '../showcase/Contact';
import Team from '../showcase/Team';
import BecomeAMember from '../showcase/BecomeAMember';
import Blog from '../showcase/Blog';
import BlogArticle from '../showcase/BlogArticle';
import useInitialWindowSize from '../../hooks/useInitialWindowSize';
import { useSiteConfig } from '../../api';

export interface ShowcaseExplorerProps extends WindowAppProps {}

const ShowcaseExplorer: React.FC<ShowcaseExplorerProps> = (props) => {
    const { initWidth, initHeight } = useInitialWindowSize({ margin: 100 });
    const siteConfig = useSiteConfig();

    return (
        <Window
            top={24}
            left={56}
            width={initWidth}
            height={initHeight}
            trackViewport
            windowTitle={siteConfig.windowTitle || ''}
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={siteConfig.copyrightText || ''}
        >
            <Router basename="/">
                <div className="site-page">
                    <TopNav />
                    <div className="site-scroll">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            {/* Legacy section URLs now scroll to their section
                                on the single-page landing. */}
                            <Route
                                path="/about"
                                element={<Navigate to="/#about" replace />}
                            />
                            <Route
                                path="/events"
                                element={<Navigate to="/#events" replace />}
                            />
                            <Route
                                path="/projects"
                                element={<Navigate to="/#projects" replace />}
                            />
                            <Route
                                path="/sponsors"
                                element={<Navigate to="/#sponsors" replace />}
                            />
                            <Route
                                path="/qa"
                                element={<Navigate to="/#qa" replace />}
                            />
                            {/* Standalone pages */}
                            <Route path="/team" element={<Team />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route
                                path="/blog/:slug"
                                element={<BlogArticle />}
                            />
                            <Route path="/join" element={<BecomeAMember />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </Window>
    );
};

export default ShowcaseExplorer;
