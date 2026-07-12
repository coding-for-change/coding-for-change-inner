'use client';
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './landing.css';

const Credits: React.FC = () => {
    const { t } = useLanguage();
    const c = t.credits;

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                <div className="lp-page__head">
                    <p className="lp-kicker">{c.kicker}</p>
                    <h1 className="lp-page__title">{c.title}</h1>
                    <p className="lp-lead">{c.lead}</p>
                </div>

                <div className="lp-credits">
                    {c.sections.map((section) => (
                        <section className="lp-credits__section" key={section.title}>
                            <h2 className="lp-credits__heading">{section.title}</h2>
                            <ul className="lp-credits__list">
                                {section.rows.map(([name, role], i) => (
                                    <li className="lp-credits__row" key={`${name}-${i}`}>
                                        <span className="lp-credits__name">{name}</span>
                                        <span className="lp-credits__role">{role}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Credits;
