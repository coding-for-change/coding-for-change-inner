'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCmsGlobal } from '../../api';
import { CmsMembership } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import './landing.css';

const BecomeAMember: React.FC<{ membership?: CmsMembership | null }> = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [motivation, setMotivation] = useState('');
    const { data: membership, loading } = useCmsGlobal<CmsMembership>(
        'membership',
        props.membership
    );
    const { t } = useLanguage();

    const handleSubmit = () => {
        if (!membership) return;
        const subject = encodeURIComponent('Membership Application - ' + name);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMotivation:\n${motivation}`
        );
        window.location.href = `mailto:${membership.contactEmail}?subject=${subject}&body=${body}`;
    };

    const isValid =
        name.length > 0 && email.length > 0 && motivation.length > 0;

    if (loading) {
        return (
            <div className="lp lp-page">
                <div className="lp-inner">
                    <p className="lp-loading">Loading…</p>
                </div>
            </div>
        );
    }

    if (!membership) {
        return (
            <div className="lp lp-page">
                <div className="lp-inner">
                    <p className="lp-empty">{t.join.unavailable}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                <motion.div
                    className="lp-page__head"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="lp-kicker">{t.nav.join}</p>
                    <h1 className="lp-page__title">{membership.title}</h1>
                    <p className="lp-lead">{membership.description}</p>
                </motion.div>

                <motion.div
                    className="lp-cols2"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="lp-col">
                        <h3 className="lp-col__head">{t.join.benefits}</h3>
                        <ul className="lp-list">
                            {(membership.benefits ?? []).map((b, i) => (
                                <li key={i}>{b.text}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="lp-col">
                        <h3 className="lp-col__head">{t.join.requirements}</h3>
                        <ul className="lp-list">
                            {(membership.requirements ?? []).map((r, i) => (
                                <li key={i}>{r.text}</li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    className="lp-form"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="lp-col__head" style={{ marginBottom: 16 }}>
                        {t.join.applyNow}
                    </h3>
                    <div className="lp-field">
                        <span className="lp-label">{t.join.nameLabel}</span>
                        <input
                            className="lp-input"
                            type="text"
                            placeholder={t.join.namePlaceholder}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="lp-field">
                        <span className="lp-label">{t.join.emailLabel}</span>
                        <input
                            className="lp-input"
                            type="email"
                            placeholder={t.join.emailPlaceholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="lp-field">
                        <span className="lp-label">
                            {t.join.motivationLabel}
                        </span>
                        <textarea
                            className="lp-textarea"
                            placeholder={t.join.motivationPlaceholder}
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                        />
                    </div>
                    <button
                        className="lp-submit"
                        disabled={!isValid}
                        onMouseDown={handleSubmit}
                    >
                        {t.join.sendApplication}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default BecomeAMember;
