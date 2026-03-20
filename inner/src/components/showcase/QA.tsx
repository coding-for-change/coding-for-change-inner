import React, { useState } from 'react';
import { useCmsCollection } from '../../api';
import { CmsFaqItem } from '../../api/types';
import { RetroLoader } from '../general';

const QA: React.FC = () => {
    const [openId, setOpenId] = useState<number | null>(null);
    const { data: faq, loading } = useCmsCollection<CmsFaqItem>('faq');

    const toggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    if (loading) return <div className="site-page-content"><RetroLoader /></div>;

    return (
        <div className="site-page-content">
            <h1>Q&A</h1>
            <h3>Frequently Asked Questions</h3>
            <br />
            <div className="text-block">
                <p>Find answers to common questions about Coding for Change below.</p>
            </div>
            <br />
            <div style={styles.faqList}>
                {(faq ?? []).map(item => (
                    <div key={item.id} style={styles.faqItem}>
                        <div
                            className="big-button-container"
                            style={styles.question}
                            onMouseDown={() => toggle(item.id)}
                        >
                            <p style={styles.questionText}>
                                <b>{openId === item.id ? '- ' : '+ '}{item.question}</b>
                            </p>
                        </div>
                        {openId === item.id && (
                            <div style={styles.answer}>
                                <p>{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    faqList: {
        flexDirection: 'column',
        width: '100%',
    },
    faqItem: {
        flexDirection: 'column',
        marginBottom: 8,
        width: '100%',
    },
    question: {
        cursor: 'pointer',
        padding: 12,
        width: '100%',
        boxSizing: 'border-box',
    },
    questionText: {
        flex: 1,
    },
    answer: {
        padding: 16,
        paddingTop: 8,
        backgroundColor: '#f0f0f0',
        borderLeft: '2px solid #008080',
    },
};

export default QA;
