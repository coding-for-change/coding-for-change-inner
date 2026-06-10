export default function NotFound() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                fontFamily: 'MillenniumBold, sans-serif',
                textAlign: 'center',
                padding: 24,
            }}
        >
            <h1>404 — Page not found</h1>
            <p>
                <a href="/">Back to Coding for Change</a>
            </p>
        </div>
    );
}
