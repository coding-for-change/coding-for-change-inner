/**
 * Tiny classnames helper — joins truthy class values into a single string.
 * (The project doesn't use Tailwind/clsx, so this is a minimal stand-in for
 * the `cn` utility some imported components expect.)
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(' ');
}
