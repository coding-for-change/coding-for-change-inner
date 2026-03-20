import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../showcase/Home';
import About from '../showcase/About';
import Window from '../os/Window';
import CFCProjects from '../showcase/CFCProjects';
import Contact from '../showcase/Contact';
import Events from '../showcase/Events';
import Sponsors from '../showcase/Sponsors';
import Team from '../showcase/Team';
import QA from '../showcase/QA';
import BecomeAMember from '../showcase/BecomeAMember';
import VerticalNavbar from '../showcase/VerticalNavbar';
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
            windowTitle={siteConfig.windowTitle || ''}
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={siteConfig.copyrightText || ''}
        >
            <Router basename="/inner">
                <div className="site-page">
                    <VerticalNavbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/projects" element={<CFCProjects />} />
                        <Route path="/sponsors" element={<Sponsors />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/qa" element={<QA />} />
                        <Route path="/join" element={<BecomeAMember />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </div>
            </Router>
        </Window>
    );
};

export default ShowcaseExplorer;
