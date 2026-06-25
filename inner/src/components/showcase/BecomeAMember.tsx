'use client';
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useCmsGlobal, useCmsCollection, submitForm } from '../../api';
import type { CmsForm, CmsFormField } from '../../api';
import { CmsMembership } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import RichText from '../RichText';
import './landing.css';

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

const BecomeAMember: React.FC<{
    membership?: CmsMembership | null;
    forms?: CmsForm[] | null;
}> = (props) => {
    const { data: membership, loading } = useCmsGlobal<CmsMembership>(
        'membership',
        props.membership
    );
    const { t } = useLanguage();

    // Forms are defined in the CMS (form-builder plugin). The join page
    // renders the form titled "application", falling back to the first form.
    const {
        data: forms,
        loading: formsLoading,
        error: formsError,
    } = useCmsCollection<CmsForm>('forms', undefined, props.forms);
    const form = useMemo(
        () => forms?.find((f) => f.title === 'application') ?? forms?.[0] ?? null,
        [forms]
    );

    const [values, setValues] = useState<FormValues>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [sendError, setSendError] = useState(false);

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
            await submitForm(form.id, submissionData);
            setSubmitted(true);
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

    if (loading) {
        return (
            <div className="lp lp-page">
                <div className="lp-inner">
                    <p className="lp-loading">Loading…</p>
                </div>
            </div>
        );
    }

    if (!membership) {
        return (
            <div className="lp lp-page">
                <div className="lp-inner">
                    <p className="lp-empty">{t.join.unavailable}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                <motion.div
                    className="lp-page__head"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="lp-kicker">{t.nav.join}</p>
                    <h1 className="lp-page__title">{membership.title}</h1>
                    <p className="lp-lead">{membership.description}</p>
                </motion.div>

                <motion.div
                    className="lp-cols2"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="lp-col">
                        <h3 className="lp-col__head">{t.join.benefits}</h3>
                        <ul className="lp-list">
                            {(membership.benefits ?? []).map((b, i) => (
                                <li key={i}>{b.text}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="lp-col">
                        <h3 className="lp-col__head">{t.join.requirements}</h3>
                        <ul className="lp-list">
                            {(membership.requirements ?? []).map((r, i) => (
                                <li key={i}>{r.text}</li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    className="lp-form"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="lp-col__head" style={{ marginBottom: 16 }}>
                        {t.join.applyNow}
                    </h3>

                    {formsLoading && (
                        <p className="lp-loading">{t.join.loadingForm}</p>
                    )}

                    {!formsLoading && (formsError || !form) && (
                        <p className="lp-empty">{t.join.formUnavailable}</p>
                    )}

                    {!formsLoading && form && submitted && (
                        <div className="lp-field">
                            {form.confirmationMessage ? (
                                <RichText content={form.confirmationMessage} />
                            ) : (
                                <p>{t.join.successFallback}</p>
                            )}
                        </div>
                    )}

                    {!formsLoading && form && !submitted && (
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
                                    ? t.join.submitting
                                    : form.submitButtonLabel ||
                                      t.join.sendApplication}
                            </button>
                            <p className="lp-form-note">
                                {sendError ? (
                                    <span className="lp-required">
                                        {t.join.sendError}
                                    </span>
                                ) : !isFormValid ? (
                                    <span>
                                        <span className="lp-required">*</span> ={' '}
                                        {t.join.requiredNote.replace('* = ', '')}
                                    </span>
                                ) : (
                                    '\xa0'
                                )}
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default BecomeAMember;
