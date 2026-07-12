'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Enter3DButton from '../general/Enter3DButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSiteConfig, useCmsCollection } from '../../api';
import type { CmsEvent, CmsSponsor } from '../../api/types';
import Logo from '../../assets/Logo.webp';
import './landing.css';

// Sections that live on the single-scroll landing page (`/`). Clicking one
// navigates to /#id; the Landing component handles the smooth scroll.
const SECTION_IDS = ['home', 'process', 'sponsors', 'qa'];

const TopNav: React.FC = () => {
    const { t, locale, setLocale } = useLanguage();
    const siteConfig = useSiteConfig();
    const pathname = usePathname() ?? '/';
    const router = useRouter();
    const [active, setActive] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    const onLanding = pathname === '/';

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
        if (id === 'home' && onLanding) {
            document.getElementById('home')?.scrollIntoView({ block: 'start' });
            // Clear any lingering hash so the URL reflects the top of the page.
            router.push('/');
            return;
        }
        router.push(id === 'home' ? '/' : `/#${id}`);
    };

    const sectionLinks = [{ id: 'home', label: t.nav.home }];

    // Events and Sponsors are only advertised in the nav when they actually have
    // content (their pages exist regardless). Fetched client-side; the nav is a
    // persistent layout so this runs once per session, not per navigation.
    const { data: events } = useCmsCollection<CmsEvent>('events');
    const { data: sponsors } = useCmsCollection<CmsSponsor>('sponsors');
    const hasEvents = (events?.length ?? 0) > 0;
    const hasSponsors = (sponsors?.length ?? 0) > 0;

    // Blog moved out of the primary nav (lives in the footer); About and
    // Projects are now standalone pages and Join gets a text link here in
    // addition to the top-right CTA.
    const pageLinks = [
        { to: '/about', label: t.nav.about },
        { to: '/projects', label: t.nav.projects },
        ...(hasEvents ? [{ to: '/events', label: t.nav.events }] : []),
        { to: '/team', label: t.nav.team },
        ...(hasSponsors ? [{ to: '/sponsors', label: t.nav.sponsors }] : []),
        { to: '/join', label: t.nav.join },
        { to: '/contact', label: t.nav.contact },
    ];

    return (
        <nav
            ref={navRef}
            // Transparent only over the homepage hero; solid everywhere else
            // (and once scrolled) so it can never read as "invisible" on a
            // short standalone page — e.g. inside the 3D monitor.
            className={
                'lp-nav' + (scrolled || !onLanding ? ' lp-nav--scrolled' : '')
            }
        >
            <button
                className="lp-nav__brand"
                onClick={() => goToSection('home')}
                aria-label={siteConfig.clubName || 'Home'}
            >
                <img
                    className="lp-nav__logo"
                    src={Logo.src}
                    alt=""
                    width={Logo.width}
                    height={Logo.height}
                />
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
                        href={link.to}
                        className={
                            'lp-nav__link' +
                            (pathname.startsWith(link.to)
                                ? ' lp-nav__link--active'
                                : '')
                        }
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="lp-nav__right">
                <Enter3DButton />
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
                <Link className="lp-nav__cta" href="/join">
                    {t.nav.join}
                </Link>
            </div>
        </nav>
    );
};

export default TopNav;
