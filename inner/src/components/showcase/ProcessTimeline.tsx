'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CmsHomepage } from '../../api/types';
import './landing.css';

/**
 * One step on a vertical progress line. Used for the "how we work with NGOs"
 * process (homepage / partner page) and for case-study timelines, so the same
 * visual language marks a plan on one page and actual progress on another.
 */
export interface TimelineStep {
    title: string;
    /** Body copy under the title. */
    text?: string;
    /** Small badge above the title — a point in time ("Week 0", "≈ 2 weeks in"). */
    timing?: string;
    /** Node label override; defaults to the 1-based position. */
    marker?: string;
    /** Progress state. Steps around a 'current' step are derived automatically. */
    state?: 'done' | 'current' | 'upcoming';
    /** Optional button on this step (e.g. "Book a first talk"). */
    cta?: { label: string; href: string };
    /** Optional screenshot / mock-up shown with this step. */
    media?: { src: string; alt: string };
}

export interface ProcessTimelineProps {
    steps: TimelineStep[];
    className?: string;
}

/**
 * Maps the CMS process-steps override (homepage global) onto timeline steps,
 * falling back to the built-in i18n steps when the CMS array is empty. The
 * i18n first step carries the page's booking CTA; CMS steps opt in per step
 * via `ctaLabel` (with `cta.href` as the target when `ctaHref` is blank).
 */
export const buildProcessSteps = (
    cmsSteps: CmsHomepage['steps'],
    fallback: { timing: string; title: string; text: string }[],
    cta: { label: string; href: string }
): TimelineStep[] =>
    cmsSteps?.length
        ? cmsSteps.map((s) => ({
              title: s.title,
              text: s.text,
              timing: s.timing || undefined,
              cta: s.ctaLabel
                  ? { label: s.ctaLabel, href: s.ctaHref || cta.href }
                  : undefined,
          }))
        : fallback.map((s, i) => ({ ...s, cta: i === 0 ? cta : undefined }));

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
    steps,
    className,
}) => {
    // A single 'current' step implies the others: everything before it is
    // done, everything after still ahead. Explicit states win.
    const currentIdx = steps.findIndex((s) => s.state === 'current');
    const stateOf = (step: TimelineStep, i: number) => {
        if (step.state) return step.state;
        if (currentIdx === -1) return undefined;
        return i < currentIdx ? 'done' : 'upcoming';
    };

    return (
        <ol className={`lp-tl${className ? ` ${className}` : ''}`}>
            {steps.map((step, i) => {
                const state = stateOf(step, i);
                return (
                    <motion.li
                        key={`${step.title}-${i}`}
                        className="lp-tl__step"
                        data-state={state}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{
                            duration: 0.45,
                            delay: Math.min(i * 0.1, 0.4),
                        }}
                    >
                        <div className="lp-tl__rail">
                            <span className="lp-tl__node">
                                {step.marker ?? (state === 'done' ? '✓' : i + 1)}
                            </span>
                            {i < steps.length - 1 && (
                                <motion.span
                                    className="lp-tl__line"
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: Math.min(i * 0.1, 0.4) + 0.2,
                                        ease: 'easeOut',
                                    }}
                                />
                            )}
                        </div>
                        <div className="lp-tl__body">
                            {step.timing && (
                                <span className="lp-tl__timing">
                                    {step.timing}
                                </span>
                            )}
                            <h3 className="lp-tl__title">{step.title}</h3>
                            {step.text && (
                                <p className="lp-tl__text">{step.text}</p>
                            )}
                            {step.cta && (
                                <a
                                    className="lp-btn lp-btn--primary lp-tl__cta"
                                    href={step.cta.href}
                                >
                                    {step.cta.label} →
                                </a>
                            )}
                            {step.media && (
                                <figure className="lp-tl__media">
                                    <img
                                        src={step.media.src}
                                        alt={step.media.alt}
                                        loading="lazy"
                                    />
                                </figure>
                            )}
                        </div>
                    </motion.li>
                );
            })}
        </ol>
    );
};

export default ProcessTimeline;
