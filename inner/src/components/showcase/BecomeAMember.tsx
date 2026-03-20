import React, { useState } from 'react';
import { useCmsGlobal } from '../../api';
import { CmsMembership } from '../../api/types';
import { RetroLoader } from '../general';

const BecomeAMember: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [motivation, setMotivation] = useState('');
    const { data: membership, loading } = useCmsGlobal<CmsMembership>('membership');

    const handleSubmit = () => {
        if (!membership) return;
        const subject = encodeURIComponent('Membership Application - ' + name);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMotivation:\n${motivation}`
        );
        window.location.href = `mailto:${membership.contactEmail}?subject=${subject}&body=${body}`;
    };

    const isValid = name.length > 0 && email.length > 0 && motivation.length > 0;

    if (loading) return <div className="site-page-content"><RetroLoader /></div>;
    if (!membership) return <div className="site-page-content"><p>Content unavailable.</p></div>;

    return (
        <div className="site-page-content">
            <h1>{membership.title}</h1>
            <br />
            <div className="text-block">
                <p>{membership.description}</p>
            </div>
            <br />
            <h3>Benefits</h3>
            <br />
            <ul style={styles.list}>
                {(membership.benefits ?? []).map((b, i) => (
                    <li key={i} style={styles.listItem}>{b.text}</li>
                ))}
            </ul>
            <br />
            <h3>Requirements</h3>
            <br />
            <ul style={styles.list}>
                {(membership.requirements ?? []).map((r, i) => (
                    <li key={i} style={styles.listItem}>{r.text}</li>
                ))}
            </ul>
            <br />
            <h3>Apply Now</h3>
            <br />
            <div style={styles.form}>
                <label><p><b>Your Name:</b></p></label>
                <input
                    style={styles.formItem}
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <label><p><b>Email:</b></p></label>
                <input
                    style={styles.formItem}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label><p><b>Why do you want to join?</b></p></label>
                <textarea
                    style={styles.formItem}
                    placeholder="Tell us about your motivation..."
                    value={motivation}
                    onChange={e => setMotivation(e.target.value)}
                />
                <button
                    className="site-button"
                    style={styles.button}
                    disabled={!isValid}
                    onMouseDown={handleSubmit}
                >
                    Send Application
                </button>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    list: {
        flexDirection: 'column',
        paddingLeft: 24,
    },
    listItem: {
        marginBottom: 8,
    },
    form: {
        flexDirection: 'column',
    },
    formItem: {
        marginTop: 4,
        marginBottom: 16,
    },
    button: {
        minWidth: 184,
        height: 32,
        alignSelf: 'flex-start',
    },
};

export default BecomeAMember;
