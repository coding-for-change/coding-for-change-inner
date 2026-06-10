import { credits } from '@/data/credits';

export const metadata = {
    title: 'Credits — Coding for Change',
};

export default function CreditsPage() {
    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                <div className="lp-page__head">
                    <p className="lp-kicker">Colophon</p>
                    <h1 className="lp-page__title">Credits</h1>
                    <p className="lp-lead">
                        The people, projects and technologies behind this site.
                    </p>
                </div>

                <div className="lp-credits">
                    {credits.map((section) => (
                        <section className="lp-credits__section" key={section.title}>
                            <h2 className="lp-credits__heading">{section.title}</h2>
                            <ul className="lp-credits__list">
                                {section.rows.map(([name, role], i) => (
                                    <li className="lp-credits__row" key={`${name}-${i}`}>
                                        <span className="lp-credits__name">{name}</span>
                                        <span className="lp-credits__role">{role}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
