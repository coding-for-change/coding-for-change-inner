import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';

export interface AboutProps {}

const About: React.FC<AboutProps> = (props) => {
    const siteConfig = useSiteConfig();
    const { t } = useLanguage();
    const a = t.about;

    return (
        <div className="site-page-content">
            <h1>{a.title}</h1>
            <h3>{siteConfig.tagline}</h3>
            <br />
            <div className="text-block">
                <p>{siteConfig.description}</p>
                <br />
                <p>
                    {a.getInvolvedPre}{' '}
                    <Link to="/qa">{a.qaLink}</Link>{' '}
                    {a.getInvolvedMid}{' '}
                    <Link to="/contact">{a.contactLink}</Link>.{' '}
                    {a.getInvolvedPost}{' '}
                    <a href={`mailto:${siteConfig.email}`}>
                        {siteConfig.email}
                    </a>
                </p>
            </div>
            <br />
            <div className="text-block">
                <h3>{a.mission}</h3>
                <br />
                <p>{a.missionText}</p>
                <br />
                <h3>{a.whatWeDo}</h3>
                <br />
                <p>{a.whatWeDoText}</p>
                <br />
                <h3>{a.howItWorks}</h3>
                <br />
                <p>
                    <b>{a.step1Title}</b> {a.step1Text}
                </p>
                <br />
                <p>
                    <b>{a.step2Title}</b> {a.step2Text}
                </p>
                <br />
                <p>
                    <b>{a.step3Title}</b> {a.step3Text}
                </p>
                <br />
                <p>
                    {a.joinPre}{' '}
                    <Link to="/join">{a.memberLink}</Link>{' '}
                    {a.joinPost}
                </p>
            </div>
        </div>
    );
};

export default About;
