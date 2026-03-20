import React, { useState } from 'react';
import { useSiteConfig } from '../../api';

export interface ContactProps {}

const validateEmail = (email: string) => {
    const re =
        // eslint-disable-next-line
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const Contact: React.FC<ContactProps> = (props) => {
    const [organization, setOrganization] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const siteConfig = useSiteConfig();

    const isFormValid =
        validateEmail(email) && name.length > 0 && message.length > 0;

    const handleSubmit = () => {
        if (!isFormValid) return;
        const subject = encodeURIComponent(`Contact from ${name}${organization ? ` (${organization})` : ''}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nOrganization/NGO: ${organization || 'N/A'}\n\nMessage:\n${message}`
        );
        window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="site-page-content">
            <div style={styles.header}>
                <h1>Contact</h1>
                <div style={styles.socials}>
                    {(siteConfig.socialLinks ?? []).map((link) => (
                        <a
                            key={link.platform}
                            rel="noreferrer"
                            target="_blank"
                            href={link.url}
                            style={styles.socialLink}
                        >
                            {link.platform}
                        </a>
                    ))}
                </div>
            </div>
            <div className="text-block">
                <p>
                    Whether you are an NGO looking for tech support, a student
                    wanting to join, or just curious about what we do — we would
                    love to hear from you!
                </p>
                <br />
                <p>
                    <b>Email: </b>
                    <a href={`mailto:${siteConfig.email}`}>
                        {siteConfig.email}
                    </a>
                </p>

                <div style={styles.form}>
                    <label>
                        <p>
                            {!name && <span style={styles.star}>*</span>}
                            <b>Your name:</b>
                        </p>
                    </label>
                    <input
                        style={styles.formItem}
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label>
                        <p>
                            {!validateEmail(email) && (
                                <span style={styles.star}>*</span>
                            )}
                            <b>Email:</b>
                        </p>
                    </label>
                    <input
                        style={styles.formItem}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>
                        <p>
                            <b>Organization/NGO (optional):</b>
                        </p>
                    </label>
                    <input
                        style={styles.formItem}
                        type="text"
                        name="organization"
                        placeholder="Organization or NGO name"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                    />
                    <label>
                        <p>
                            {!message && <span style={styles.star}>*</span>}
                            <b>Message:</b>
                        </p>
                    </label>
                    <textarea
                        name="message"
                        placeholder="Message"
                        style={styles.formItem}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div style={styles.buttons}>
                        <button
                            className="site-button"
                            style={styles.button}
                            type="submit"
                            disabled={!isFormValid}
                            onMouseDown={handleSubmit}
                        >
                            Send Message
                        </button>
                        <div style={styles.formInfo}>
                            <p>
                                <b>
                                    <sub>
                                        This will open your email client to send
                                        the message
                                    </sub>
                                </b>
                            </p>
                            <p>
                                <sub>
                                    {!isFormValid ? (
                                        <span>
                                            <b style={styles.star}>*</b> =
                                            required
                                        </span>
                                    ) : (
                                        '\xa0'
                                    )}
                                </sub>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    form: {
        flexDirection: 'column',
        marginTop: 32,
    },
    formItem: {
        marginTop: 4,
        marginBottom: 16,
    },
    buttons: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formInfo: {
        textAlign: 'right',
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingLeft: 24,
    },
    star: {
        paddingRight: 4,
        color: 'red',
    },
    button: {
        minWidth: 184,
        height: 32,
    },
    header: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    socials: {
        marginBottom: 16,
        justifyContent: 'flex-end',
        gap: 12,
    },
    socialLink: {
        fontSize: 14,
        textDecoration: 'none',
    },
};

export default Contact;
