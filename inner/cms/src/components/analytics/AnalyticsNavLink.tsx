'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Link, useConfig } from '@payloadcms/ui';

/**
 * Sidebar entry for the analytics dashboard, rendered via
 * admin.components.afterNavLinks. Mirrors Payload's own nav-link markup
 * (nav__link / nav__link-indicator / nav__link-label) so it inherits the
 * default nav styling and active state.
 */
export function AnalyticsNavLink() {
  const pathname = usePathname();
  const { config } = useConfig();
  const href = `${config.routes.admin}/analytics`;
  const isActive = pathname === href;

  const label = (
    <>
      {isActive && <div className="nav__link-indicator" />}
      <span className="nav__link-label">Analytics dashboard</span>
    </>
  );

  if (isActive) {
    return (
      <div className="nav__link" id="nav-analytics-dashboard">
        {label}
      </div>
    );
  }
  return (
    <Link className="nav__link" href={href} id="nav-analytics-dashboard" prefetch={false}>
      {label}
    </Link>
  );
}
