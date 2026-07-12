'use client';
import React from 'react';
import { useCmsGlobal, CmsLegal } from '../../api';
import RichText from '../RichText';

/**
 * The Impressum / Datenschutzerklärung content, sourced from the CMS `legal`
 * global. Now split across two routes (/imprint and /privacy) — pass `section`
 * to render just one. With no `section` it renders both (kept for the legacy
 * combined views).
 */
const ImprintContent: React.FC<{
    legal?: CmsLegal | null;
    section?: 'impressum' | 'privacy';
}> = (props) => {
    const { data: legal } = useCmsGlobal<CmsLegal>('legal', props.legal);

    if (!legal) return null;

    if (props.section === 'impressum') {
        return <RichText content={legal.impressum} />;
    }
    if (props.section === 'privacy') {
        return <RichText content={legal.privacyPolicy} />;
    }

    return (
        <>
            <RichText content={legal.impressum} />
            <br />
            <hr style={styles.divider} />
            <br />
            <RichText content={legal.privacyPolicy} />
        </>
    );
};

const styles: StyleSheetCSS = {
    divider: {
        width: '100%',
        border: 'none',
        borderTop: '1px solid #888',
    },
};

export default ImprintContent;
