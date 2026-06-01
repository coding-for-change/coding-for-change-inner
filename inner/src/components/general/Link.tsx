'use client'
import React, { useState } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

export interface LinkProps {
    text: string;
    to: string;
    containerStyle?: React.CSSProperties;
    outsideTo?: string;
}

const Link: React.FC<LinkProps> = ({ text, to, containerStyle }) => {
    const pathname = usePathname()
    const href = `/${to}`
    const isHere = pathname === href || (to === '' && pathname === '/')
    const [active, setActive] = useState(false)

    return (
        <NextLink
            href={href}
            onMouseDown={() => {
                setActive(true)
                setTimeout(() => setActive(false), 100)
            }}
            style={Object.assign({}, { display: 'flex' }, containerStyle)}
        >
            {isHere && <div style={styles.hereIndicator} />}
            <h4
                className="router-link"
                style={Object.assign({}, styles.link, active && { color: 'red' })}
            >
                {text}
            </h4>
        </NextLink>
    )
}

const styles: StyleSheetCSS = {
    link: { cursor: 'pointer', fontWeight: 'bolder', textDecoration: 'underline' },
    hereIndicator: {
        width: 4, height: 4, borderWidth: 3, borderStyle: 'solid',
        borderColor: 'rgb(85, 26, 139)', alignSelf: 'center', borderRadius: '50%',
        marginRight: 6, textDecoration: 'none',
    },
}

export default Link
