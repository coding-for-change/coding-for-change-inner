/**
 * Minimal type surface for the `klaro` package, which ships no types of its own.
 *
 * Only the parts we actually use are declared — deliberately narrow, so a Klaro
 * upgrade that changes something we depend on shows up as a type error rather
 * than silently changing behaviour. (Upstream is quiet: no npm release since
 * v0.7.21 in March 2024, so this is unlikely to move, but the narrowness is
 * cheap insurance either way.)
 */
declare module '@/vendor/klaro/klaro-no-css.js' {
    export interface KlaroManager {
        /** Per-service consent, keyed by service name. */
        consents: Record<string, boolean>;
        /** True once the visitor has actually answered (or a stored answer was loaded). */
        confirmed: boolean;
        /** Klaro's own change notification. `eventType` is e.g. 'saveConsents'. */
        watch(watcher: {
            update: (manager: KlaroManager, eventType: string, data: unknown) => void;
        }): void;
        unwatch(watcher: unknown): void;
    }

    export function setup(config: unknown): void;
    export function show(config?: unknown, opts?: { modal?: boolean }): void;
    export function getManager(config?: unknown): KlaroManager;
}
