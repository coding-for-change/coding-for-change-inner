import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ExperienceToggle } from '../general';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSiteConfig } from '../../api';
import Logo from '../../assets/Logo.png';
import './landing.css';

// Sections that live on the single-scroll landing page (`/`). Clicking one
// navigates to /#id; the Landing component handles the smooth scroll.
const SECTION_IDS = ['home', 'about', 'process', 'events', 'projects', 'sponsors', 'qa'];

const TopNav: React.FC = () => {
    const { t, locale, setLocale } = useLanguage();
    const siteConfig = useSiteConfig();
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    const onLanding = location.pathname === '/';

    // The nav sits transparent over the hero gradient at the top of the
    // page and fades to a solid background once the content scrolls beneath
    // it. The scroll happens inside the sibling `.site-scroll` container, so
    // we listen there rather than on the window.
    useEffect(() => {
        const scroller = navRef.current?.parentElement?.querySelector(
            '.site-scroll'
        ) as HTMLElement | null;
        if (!scroller) return;
        const onScroll = () => setScrolled(scroller.scrollTop > 8);
        onScroll();
        scroller.addEventListener('scroll', onScroll, { passive: true });
        return () => scroller.removeEventListener('scroll', onScroll);
    }, []);

    // Highlight the section currently in view while on the landing page.
    useEffect(() => {
        if (!onLanding) return;
        const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
            (el): el is HTMLElement => !!el
        );
        if (els.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [onLanding]);

    const goToSection = (id: string) => {
        navigate(id === 'home' ? '/' : `/#${id}`);
        if (id === 'home' && onLanding) {
            document.getElementById('home')?.scrollIntoView({ block: 'start' });
        }
    };

    const sectionLinks = [{ id: 'home', label: t.nav.home }];

    const pageLinks = [
        { to: '/team', label: t.nav.team },
        { to: '/blog', label: t.nav.blog },
        { to: '/contact', label: t.nav.contact },
    ];

    return (
        <nav
            ref={navRef}
            className={'lp-nav' + (scrolled ? ' lp-nav--scrolled' : '')}
        >
            <button
                className="lp-nav__brand"
                onClick={() => goToSection('home')}
                aria-label={siteConfig.clubName || 'Home'}
            >
                <img className="lp-nav__logo" src={Logo} alt="" />
                <span className="lp-nav__name">
                    {siteConfig.clubName || 'Coding for Change'}
                </span>
            </button>

            <div className="lp-nav__links">
                {sectionLinks.map((link) => (
                    <button
                        key={link.id}
                        className={
                            'lp-nav__link' +
                            (onLanding &&
                            (link.id === 'home' || active === link.id)
                                ? ' lp-nav__link--active'
                                : '')
                        }
                        onClick={() => goToSection(link.id)}
                    >
                        {link.label}
                    </button>
                ))}
                {pageLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={
                            'lp-nav__link' +
                            (location.pathname.startsWith(link.to)
                                ? ' lp-nav__link--active'
                                : '')
                        }
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="lp-nav__right">
                <ExperienceToggle />
                <div className="lp-lang">
                    {(['en', 'de'] as const).map((code) => (
                        <button
                            key={code}
                            className={
                                'lp-lang__btn' +
                                (locale === code ? ' lp-lang__btn--active' : '')
                            }
                            onClick={() => setLocale(code)}
                        >
                            {code}
                        </button>
                    ))}
                </div>
                <Link className="lp-nav__cta" to="/join">
                    {t.nav.join}
                </Link>
            </div>
        </nav>
    );
};

export default TopNav;
