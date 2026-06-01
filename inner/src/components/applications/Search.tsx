'use client'
import React, { useState, useCallback } from 'react'
import Window from '../os/Window'
import useInitialWindowSize from '../../hooks/useInitialWindowSize'
import { useRouter } from 'next/navigation'

interface SearchResult {
    id: string | number
    title: string
    doc: {
        relationTo: string
        value: { id: number; title?: string; name?: string; question?: string }
    }
}

const COLLECTION_ICONS: Record<string, string> = {
    team: '👤',
    projects: '📁',
    events: '📄',
    faq: '❓',
    sponsors: '💰',
}

const COLLECTION_ROUTES: Record<string, string> = {
    team: '/team',
    projects: '/projects',
    events: '/events',
    faq: '/qa',
    sponsors: '/sponsors',
}

export interface SearchProps extends WindowAppProps {}

const Search: React.FC<SearchProps> = (props) => {
    const { initWidth, initHeight } = useInitialWindowSize({ margin: 200 })
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = useCallback(async () => {
        if (!query.trim()) return
        setLoading(true)
        try {
            const url = `/api/search?where[or][0][title][like]=${encodeURIComponent(query)}&limit=20`
            const res = await fetch(url)
            const data = await res.json()
            setResults(data.docs ?? [])
        } catch (_) {
            setResults([])
        } finally {
            setLoading(false)
        }
    }, [query])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch()
    }

    const handleResultClick = (result: SearchResult) => {
        const route = COLLECTION_ROUTES[result.doc?.relationTo]
        if (route) {
            router.push(route)
            props.onClose()
        }
    }

    return (
        <Window
            top={80}
            left={120}
            width={Math.min(initWidth, 500)}
            height={Math.min(initHeight, 420)}
            windowTitle="Search"
            windowBarIcon="showcaseIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText=""
        >
            <div style={styles.container}>
                <div style={styles.searchBar}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="site-button"
                        style={styles.button}
                        onMouseDown={handleSearch}
                    >
                        Search
                    </button>
                </div>
                <div style={styles.results}>
                    {loading && <p style={styles.status}>Searching...</p>}
                    {!loading && results.length === 0 && query && (
                        <p style={styles.status}>No results found.</p>
                    )}
                    {!loading && results.map((result) => {
                        const collection = result.doc?.relationTo ?? ''
                        const icon = COLLECTION_ICONS[collection] ?? '📄'
                        const title = result.title
                        return (
                            <div
                                key={`${collection}-${result.id}`}
                                className="big-button-container"
                                style={styles.resultItem}
                                onMouseDown={() => handleResultClick(result)}
                            >
                                <span style={styles.icon}>{icon}</span>
                                <div style={styles.resultText}>
                                    <p style={styles.resultTitle}>{title}</p>
                                    <p style={styles.resultCollection}>{collection}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Window>
    )
}

const styles: StyleSheetCSS = {
    container: { flexDirection: 'column', height: '100%', padding: 12, boxSizing: 'border-box' },
    searchBar: { alignItems: 'center', gap: 8, marginBottom: 12 },
    input: { flex: 1 },
    button: { flexShrink: 0, height: 32, padding: '0 16px' },
    results: { flexDirection: 'column', flex: 1, overflowY: 'auto' },
    status: { fontSize: 14, fontFamily: 'MSSerif', padding: 8 },
    resultItem: { padding: '8px 12px', cursor: 'pointer', marginBottom: 4, alignItems: 'center' },
    icon: { fontSize: 20, marginRight: 12, flexShrink: 0 },
    resultText: { flexDirection: 'column', flex: 1 },
    resultTitle: { fontSize: 14, fontFamily: 'MSSerif' },
    resultCollection: { fontSize: 12, fontFamily: 'MSSerif', color: '#808080' },
}

export default Search
