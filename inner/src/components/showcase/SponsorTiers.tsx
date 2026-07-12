'use client';
import React from 'react';
import { mediaUrl } from '../../api';
import { CmsSponsor } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import './landing.css';

// Highest tier first. Only tiers with at least one sponsor render a section.
const TIER_ORDER = ['platinum', 'gold', 'silver', 'bronze', 'partner'] as const;

const SponsorLogo: React.FC<{ sponsor: CmsSponsor }> = ({ sponsor }) => {
    const logo = mediaUrl(sponsor.logo);
    const inner = logo ? (
        <img src={logo} alt={sponsor.name} />
    ) : (
        <span className="lp-sponsor__name">{sponsor.name}</span>
    );
    return sponsor.url ? (
        <a
            className="lp-sponsor"
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
        >
            {inner}
        </a>
    ) : (
        <div className="lp-sponsor">{inner}</div>
    );
};

/**
 * Renders sponsors grouped into tier sections (Platinum → Partner). Shared by
 * the homepage sponsors section and the standalone /sponsors page. When only a
 * single tier has sponsors, the tier heading is omitted (it would be noise).
 */
const SponsorTiers: React.FC<{ sponsors?: CmsSponsor[] | null }> = ({
    sponsors,
}) => {
    const { t } = useLanguage();
    const list = sponsors ?? [];
    const groups = TIER_ORDER.map((tier) => ({
        tier,
        items: list.filter((s) => s.tier === tier),
    })).filter((g) => g.items.length > 0);

    const showHeadings = groups.length > 1;

    return (
        <div className="lp-tiers">
            {groups.map(({ tier, items }) => (
                <div className="lp-tier" key={tier}>
                    {showHeadings && (
                        <h3 className="lp-tier__head">{t.sponsors.tiers[tier]}</h3>
                    )}
                    <div className="lp-sponsors">
                        {items.map((sponsor) => (
                            <SponsorLogo key={sponsor.id} sponsor={sponsor} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SponsorTiers;
