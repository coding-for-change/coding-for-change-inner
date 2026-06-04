'use client';
import React from 'react';
import { useCmsGlobal, CmsLegal } from '../../api';
import RichText from '../RichText';

/**
 * The Impressum + Datenschutzerklärung content, sourced from the CMS `legal`
 * global. Rendered both inside the desktop Imprint window and the mobile
 * imprint page, so the legal text lives in exactly one place.
 */
const ImprintContent: React.FC<{ legal?: CmsLegal | null }> = (props) => {
    const { data: legal } = useCmsGlobal<CmsLegal>('legal', props.legal);

    if (!legal) return null;

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
