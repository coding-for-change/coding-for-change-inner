import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data';

export interface AboutProps {}

const About: React.FC<AboutProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>About Us</h1>
            <h3>{siteConfig.tagline}</h3>
            <br />
            <div className="text-block">
                <p>{siteConfig.description}</p>
                <br />
                <p>
                    Have questions or want to get involved? Check out our{' '}
                    <Link to="/qa">Q&A page</Link> or reach out via the{' '}
                    <Link to="/contact">contact form</Link>. You can also email
                    us at{' '}
                    <a href={`mailto:${siteConfig.email}`}>
                        {siteConfig.email}
                    </a>
                </p>
            </div>
            <br />
            <div className="text-block">
                <h3>Our Mission</h3>
                <br />
                <p>
                    We believe that technology should serve everyone. Many NGOs
                    and non-profit organizations have great ideas and important
                    missions but lack the technical resources to bring them to
                    life. At the same time, CS students are eager to apply their
                    skills to real-world problems. Coding for Change bridges this
                    gap.
                </p>
                <br />
                <h3>What We Do</h3>
                <br />
                <p>
                    We partner with NGOs in and around Munich to build software
                    solutions — from websites and apps to data dashboards and
                    automation tools. Each project is developed by a team of
                    student volunteers, guided by experienced team leads, and
                    delivered in close collaboration with the partner
                    organization.
                </p>
                <br />
                <h3>How It Works</h3>
                <br />
                <p>
                    <b>1. Partner Matching:</b> We identify NGOs with technology
                    needs and match them with a student team.
                </p>
                <br />
                <p>
                    <b>2. Project Development:</b> Teams work in agile sprints
                    over the course of a semester to deliver a working product.
                </p>
                <br />
                <p>
                    <b>3. Handoff & Support:</b> Completed projects are handed
                    off to the NGO with documentation and optional ongoing
                    support.
                </p>
                <br />
                <p>
                    Interested in joining us? Check out the{' '}
                    <Link to="/join">membership page</Link> to learn more about
                    how you can get involved!
                </p>
            </div>
        </div>
    );
};

export default About;
