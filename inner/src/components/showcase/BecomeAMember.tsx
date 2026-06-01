'use client'
import React, { useState } from 'react';
import { CmsMembership } from '../../api/types';

interface BecomeAMemberProps {
    membership: CmsMembership | null;
}

const BecomeAMember: React.FC<BecomeAMemberProps> = ({ membership }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [motivation, setMotivation] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    if (!membership) return <div className="site-page-content"><p>Content unavailable.</p></div>;

    const isValid = name.length > 0 && email.length > 0 && motivation.length > 0;

    const handleSubmit = async () => {
        if (!name || !email || !motivation) return;
        setError('');
        try {
            // Try Form Builder first
            const formsRes = await fetch('/api/forms?where[slug][equals]=membership-interest');
            const formsData = await formsRes.json();
            const form = formsData.docs?.[0];
            if (form) {
                await fetch('/api/form-submissions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        form: form.id,
                        submissionData: [
                            { field: 'name', value: name },
                            { field: 'email', value: email },
                            { field: 'motivation', value: motivation },
                        ],
                    }),
                });
                setSubmitted(true);
                return;
            }
        } catch (_) {}
        // Fallback to mailto
        const subject = encodeURIComponent(`Membership Application - ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMotivation:\n${motivation}`
        );
        window.location.href = `mailto:${membership.contactEmail}?subject=${subject}&body=${body}`;
    };

    if (submitted) {
        return (
            <div className="site-page-content">
                <h1>Application Sent!</h1>
                <div className="text-block"><p>Thank you for applying! We&apos;ll be in touch soon.</p></div>
            </div>
        );
    }

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
                {error && <p style={{ color: 'red' }}>{error}</p>}
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
