'use client';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

/**
 * Two-series daily line chart (sessions / page views) for the analytics
 * dashboard. Plain SVG — no chart library. One y-axis, 2px round-capped lines,
 * hairline solid gridlines, end-point markers with a surface ring, and a
 * crosshair tooltip that snaps to the nearest day (pointer or arrow keys).
 * All values are also reachable without hover via the card's table view.
 */

export type DayPoint = {
  day: string; // YYYY-MM-DD (local, from the summary endpoint)
  sessions: number;
  pageviews: number;
  conversions: number;
};

const HEIGHT = 240;
const MARGIN = { top: 12, right: 18, bottom: 28, left: 48 };

/** Clean 0-based axis: step from the 1/2/5 ladder, ~4 intervals. */
function niceScale(maxValue: number): { yMax: number; ticks: number[] } {
  const max = Math.max(maxValue, 4);
  const rawStep = max / 4;
  const mag = 10 ** Math.floor(Math.log10(rawStep));
  const norm = rawStep / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const yMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= yMax + step / 2; v += step) ticks.push(v);
  return { yMax, ticks };
}

/** Parse YYYY-MM-DD as a local date (no timezone shifting). */
function parseDay(day: string): Date {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

const tickFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
const tooltipFmt = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const nf = new Intl.NumberFormat('en-GB');

function useContainerWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(720);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width || 720);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

const SERIES = [
  { key: 'sessions' as const, label: 'Sessions', varName: 'var(--cfc-s1)' },
  { key: 'pageviews' as const, label: 'Page views', varName: 'var(--cfc-s2)' },
];

export function TimeSeriesChart({ daily }: { daily: DayPoint[] }) {
  const [wrapRef, width] = useContainerWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const n = daily.length;
  const innerW = Math.max(width - MARGIN.left - MARGIN.right, 50);
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

  const { yMax, ticks } = useMemo(
    () => niceScale(Math.max(...daily.map((d) => Math.max(d.sessions, d.pageviews)), 0)),
    [daily],
  );

  const x = useCallback(
    (i: number) => MARGIN.left + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1)),
    [innerW, n],
  );
  const y = useCallback(
    (v: number) => MARGIN.top + innerH - (v / yMax) * innerH,
    [innerH, yMax],
  );

  const paths = useMemo(
    () =>
      SERIES.map((s) =>
        daily.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[s.key]).toFixed(1)}`).join(''),
      ),
    [daily, x, y],
  );

  // Sparse x ticks: ~6 labels, always ending on the last day.
  const xTicks = useMemo(() => {
    if (n === 0) return [];
    const step = Math.max(1, Math.ceil(n / 6));
    const idx: number[] = [];
    for (let i = 0; i < n; i += step) idx.push(i);
    const last = idx[idx.length - 1];
    if (n - 1 - last < step / 2 && idx.length > 1) idx.pop();
    if (idx[idx.length - 1] !== n - 1) idx.push(n - 1);
    return idx;
  }, [n]);

  const nearestIndex = useCallback(
    (clientX: number) => {
      const svg = svgRef.current;
      if (!svg || n === 0) return null;
      const px = clientX - svg.getBoundingClientRect().left;
      const stepW = n <= 1 ? innerW : innerW / (n - 1);
      return Math.min(n - 1, Math.max(0, Math.round((px - MARGIN.left) / stepW)));
    },
    [innerW, n],
  );

  const onPointerMove = (e: React.PointerEvent) => setHover(nearestIndex(e.clientX));
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const delta = e.key === 'ArrowLeft' ? -1 : 1;
      setHover((h) => Math.min(n - 1, Math.max(0, (h ?? n - 1) + delta)));
    }
    if (e.key === 'Escape') setHover(null);
  };

  if (n === 0) return null;
  const hovered = hover !== null ? daily[hover] : null;

  // Keep the tooltip inside the plot: flip sides past the midpoint.
  const tooltipLeft = hover !== null && hover >= n / 2;

  return (
    <div className="cfc-chart" ref={wrapRef}>
      <div className="cfc-legend" aria-hidden="true">
        {SERIES.map((s) => (
          <span className="cfc-legend__item" key={s.key}>
            <span className="cfc-legend__key" style={{ background: s.varName }} />
            {s.label}
          </span>
        ))}
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height={HEIGHT}
        role="img"
        aria-label={`Sessions and page views per day, ${daily[0].day} to ${daily[n - 1].day}`}
        tabIndex={0}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
        onBlur={() => setHover(null)}
        onKeyDown={onKeyDown}
        style={{ display: 'block', touchAction: 'none', outlineOffset: 4 }}
      >
        {/* gridlines + y ticks */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={MARGIN.left}
              x2={MARGIN.left + innerW}
              y1={y(t)}
              y2={y(t)}
              stroke={t === 0 ? 'var(--cfc-axis)' : 'var(--cfc-grid)'}
              strokeWidth={1}
            />
            <text
              x={MARGIN.left - 8}
              y={y(t)}
              dy="0.32em"
              textAnchor="end"
              className="cfc-chart__tick"
            >
              {nf.format(t)}
            </text>
          </g>
        ))}
        {/* x ticks */}
        {xTicks.map((i) => (
          <text
            key={i}
            x={x(i)}
            y={HEIGHT - 8}
            textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
            className="cfc-chart__tick"
          >
            {tickFmt.format(parseDay(daily[i].day))}
          </text>
        ))}
        {/* crosshair */}
        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={MARGIN.top}
            y2={MARGIN.top + innerH}
            stroke="var(--cfc-axis)"
            strokeWidth={1}
          />
        )}
        {/* series lines */}
        {SERIES.map((s, si) => (
          <path
            key={s.key}
            d={paths[si]}
            fill="none"
            stroke={s.varName}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* hovered-day markers (surface ring keeps them legible on the lines) */}
        {hovered !== null &&
          SERIES.map((s) => (
            <circle
              key={s.key}
              cx={x(hover!)}
              cy={y(hovered[s.key])}
              r={4.5}
              fill={s.varName}
              stroke="var(--cfc-surface)"
              strokeWidth={2}
            />
          ))}
        {/* end-of-series markers */}
        {hover === null &&
          SERIES.map((s) => (
            <circle
              key={s.key}
              cx={x(n - 1)}
              cy={y(daily[n - 1][s.key])}
              r={4.5}
              fill={s.varName}
              stroke="var(--cfc-surface)"
              strokeWidth={2}
            />
          ))}
      </svg>
      {hovered !== null && (
        <div
          className="cfc-tooltip"
          role="status"
          style={{
            left: x(hover!),
            transform: tooltipLeft ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
          }}
        >
          <div className="cfc-tooltip__date">{tooltipFmt.format(parseDay(hovered.day))}</div>
          {SERIES.map((s) => (
            <div className="cfc-tooltip__row" key={s.key}>
              <span className="cfc-tooltip__key" style={{ background: s.varName }} />
              <span className="cfc-tooltip__value">{nf.format(hovered[s.key])}</span>
              <span className="cfc-tooltip__label">{s.label}</span>
            </div>
          ))}
          <div className="cfc-tooltip__row">
            <span className="cfc-tooltip__key" style={{ background: 'transparent' }} />
            <span className="cfc-tooltip__value">{nf.format(hovered.conversions)}</span>
            <span className="cfc-tooltip__label">Conversions</span>
          </div>
        </div>
      )}
    </div>
  );
}
