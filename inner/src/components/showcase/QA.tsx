import React, { useState } from 'react';
import { useCmsCollection } from '../../api';
import { CmsFaqItem } from '../../api/types';
import { RetroLoader } from '../general';
import { useLanguage } from '../../contexts/LanguageContext';

const QA: React.FC = () => {
    const [openId, setOpenId] = useState<number | null>(null);
    const { data: faq, loading } = useCmsCollection<CmsFaqItem>('faq');
    const { t } = useLanguage();

    const toggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    if (loading) return <div className="site-page-content"><RetroLoader /></div>;

    return (
        <div className="site-page-content">
            <h1>{t.qa.title}</h1>
            <h3>{t.qa.subtitle}</h3>
            <br />
            <div className="text-block">
                <p>{t.qa.intro}</p>
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
