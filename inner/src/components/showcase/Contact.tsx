'use client';
import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteConfig, useCmsCollection, submitForm } from '../../api';
import type { CmsForm, CmsFormField } from '../../api';
import { getAttribution } from '../../lib/attribution';
import { trackFormStart, trackConversion } from '../../lib/analytics';
import { useLanguage } from '../../contexts/LanguageContext';
import RichText from '../RichText';
import BookingEmbed from '../general/BookingEmbed';
import './landing.css';

export interface ContactProps {
    forms?: CmsForm[] | null;
}

const validateEmail = (email: string) => {
    const re =
        // eslint-disable-next-line
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

type FormValues = Record<string, string | boolean>;

// Fields that actually capture a value (everything except the static `message`).
const isInputField = (
    field: CmsFormField
): field is Exclude<CmsFormField, { blockType: 'message' }> =>
    field.blockType !== 'message';

const Contact: React.FC<ContactProps> = (props) => {
    const siteConfig = useSiteConfig();
    const { t } = useLanguage();

    // Forms are defined in the CMS (form-builder plugin). The contact page
    // renders the form titled "Contact", falling back to the first form.
    const { data: forms, loading, error } = useCmsCollection<CmsForm>(
        'forms',
        undefined,
        props.forms
    );
    const form = useMemo(
        () => forms?.find((f) => f.title === 'Contact') ?? forms?.[0] ?? null,
        [forms]
    );

    const [values, setValues] = useState<FormValues>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [sendError, setSendError] = useState(false);

    // Funnel: fire `form_start` on first focus in the contact form.
    const formStarted = useRef(false);
    const handleFormFocus = () => {
        if (formStarted.current) return;
        formStarted.current = true;
        trackFormStart('contact');
    };

    const setValue = (name: string, value: string | boolean) =>
        setValues((prev) => ({ ...prev, [name]: value }));

    const inputFields = (form?.fields ?? []).filter(isInputField);

    const fieldValue = (field: CmsFormField & { name: string }) => {
        const v = values[field.name];
        if (v !== undefined) return v;
        if (field.blockType === 'checkbox') return field.defaultValue ?? false;
        if (field.blockType === 'number')
            return field.defaultValue != null ? String(field.defaultValue) : '';
        if ('defaultValue' in field && field.defaultValue != null)
            return String(field.defaultValue);
        return '';
    };

    const isFieldValid = (field: typeof inputFields[number]) => {
        const value = fieldValue(field);
        if (field.blockType === 'email') {
            const str = String(value);
            if (!str) return !field.required;
            return validateEmail(str);
        }
        if (field.blockType === 'checkbox') {
            return field.required ? value === true : true;
        }
        if (!field.required) return true;
        return String(value).trim().length > 0;
    };

    const isFormValid =
        !!form && inputFields.every((field) => isFieldValid(field));

    const handleSubmit = async () => {
        if (!form || !isFormValid || submitting) return;
        setSendError(false);
        setSubmitting(true);
        try {
            const submissionData = inputFields.map((field) => ({
                field: field.name,
                value:
                    field.blockType === 'checkbox'
                        ? fieldValue(field) === true
                            ? 'true'
                            : 'false'
                        : String(fieldValue(field)),
            }));
            await submitForm(form.id, submissionData, getAttribution());
            setSubmitted(true);
            trackConversion('contact');
        } catch (err) {
            setSendError(true);
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (field: typeof inputFields[number], index: number) => {
        const value = fieldValue(field);
        const showRequiredStar =
            field.required &&
            !isFieldValid(field) &&
            field.blockType !== 'checkbox';

        if (field.blockType === 'checkbox') {
            return (
                <label key={field.name ?? index} className="lp-checkbox">
                    <input
                        type="checkbox"
                        name={field.name}
                        checked={value === true}
                        onChange={(e) => setValue(field.name, e.target.checked)}
                    />
                    <span className="lp-label">
                        {field.required && value !== true && (
                            <span className="lp-required">*</span>
                        )}
                        {field.label || field.name}
                    </span>
                </label>
            );
        }

        const label = (
            <span className="lp-label">
                {showRequiredStar && <span className="lp-required">*</span>}
                {field.label || field.name}
            </span>
        );

        if (field.blockType === 'textarea') {
            return (
                <div className="lp-field" key={field.name ?? index}>
                    {label}
                    <textarea
                        className="lp-textarea"
                        name={field.name}
                        value={String(value)}
                        onChange={(e) => setValue(field.name, e.target.value)}
                    />
                </div>
            );
        }

        if (field.blockType === 'select') {
            return (
                <div className="lp-field" key={field.name ?? index}>
                    {label}
                    <select
                        className="lp-select"
                        name={field.name}
                        value={String(value)}
                        onChange={(e) => setValue(field.name, e.target.value)}
                    >
                        <option value="">{field.placeholder || '—'}</option>
                        {(field.options ?? []).map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        return (
            <div className="lp-field" key={field.name ?? index}>
                {label}
                <input
                    className="lp-input"
                    type={
                        field.blockType === 'email'
                            ? 'email'
                            : field.blockType === 'number'
                            ? 'number'
                            : 'text'
                    }
                    name={field.name}
                    value={String(value)}
                    onChange={(e) => setValue(field.name, e.target.value)}
                />
            </div>
        );
    };

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                <motion.div
                    className="lp-page__head"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="lp-kicker">{t.nav.contact}</p>
                    <h1 className="lp-page__title">{t.contact.title}</h1>
                    <p className="lp-lead">{t.contact.intro}</p>
                </motion.div>

                {(siteConfig.socialLinks ?? []).length > 0 && (
                    <div className="lp-socials">
                        {(siteConfig.socialLinks ?? []).map((link) => (
                            <a
                                key={link.platform}
                                className="lp-social"
                                rel="noreferrer"
                                target="_blank"
                                href={link.url}
                            >
                                {link.platform}
                            </a>
                        ))}
                    </div>
                )}

                <div className="lp-contact" onFocus={handleFormFocus}>
                    <p className="lp-contact__intro">
                        <b>Email: </b>
                        <a className="lp-social" href={`mailto:${siteConfig.email}`}>
                            {siteConfig.email}
                        </a>
                    </p>

                    {loading && <p className="lp-loading">{t.contact.loadingForm}</p>}

                    {!loading && (error || !form) && (
                        <p className="lp-empty">{t.contact.formUnavailable}</p>
                    )}

                    {!loading && form && submitted && (
                        <div className="lp-field">
                            {form.confirmationMessage ? (
                                <RichText content={form.confirmationMessage} />
                            ) : (
                                <p>{t.contact.successFallback}</p>
                            )}
                        </div>
                    )}

                    {!loading && form && !submitted && (
                        <>
                            {(form.fields ?? []).map((field, index) =>
                                field.blockType === 'message' ? (
                                    <div
                                        key={`message-${index}`}
                                        className="lp-field"
                                    >
                                        <RichText content={field.message} />
                                    </div>
                                ) : (
                                    renderField(field, index)
                                )
                            )}
                            <button
                                className="lp-submit"
                                type="submit"
                                disabled={!isFormValid || submitting}
                                onMouseDown={handleSubmit}
                            >
                                {submitting
                                    ? t.contact.submitting
                                    : form.submitButtonLabel ||
                                      t.contact.sendMessage}
                            </button>
                            <p className="lp-form-note">
                                {sendError ? (
                                    <span className="lp-required">
                                        {t.contact.sendError}
                                    </span>
                                ) : !isFormValid ? (
                                    <span>
                                        <span className="lp-required">*</span> ={' '}
                                        {t.contact.requiredNote.replace(
                                            '* = ',
                                            ''
                                        )}
                                    </span>
                                ) : (
                                    '\xa0'
                                )}
                            </p>
                        </>
                    )}
                </div>

                <section id="book" className="lp-section--book" style={{ marginTop: 56, paddingTop: 40 }}>
                    <h2 className="lp-page__title" style={{ fontSize: 28 }}>
                        {t.book.title}
                    </h2>
                    <p className="lp-lead" style={{ marginBottom: 24 }}>
                        {t.book.intro}
                    </p>
                    <BookingEmbed />
                </section>
            </div>
        </div>
    );
};

export default Contact;
