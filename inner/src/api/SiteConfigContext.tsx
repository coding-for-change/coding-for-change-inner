'use client'
import React, { createContext, useContext } from 'react'
import { CmsSiteConfig } from './types'

interface SiteConfigState {
    config: CmsSiteConfig | null
}

const SiteConfigContext = createContext<SiteConfigState>({ config: null })

export const useSiteConfig = (): CmsSiteConfig & { loading: boolean } => {
    const { config } = useContext(SiteConfigContext)
    return {
        clubName: config?.clubName ?? '',
        tagline: config?.tagline ?? '',
        description: config?.description ?? '',
        email: config?.email ?? '',
        socialLinks: config?.socialLinks ?? [],
        copyrightText: config?.copyrightText ?? '',
        windowTitle: config?.windowTitle ?? '',
        loading: false,
    }
}

export const useSiteConfigLoading = (): boolean => false

export const SiteConfigProvider: React.FC<{
    children: React.ReactNode
    initialConfig: CmsSiteConfig | null
}> = ({ children, initialConfig }) => {
    return (
        <SiteConfigContext.Provider value={{ config: initialConfig }}>
            {children}
        </SiteConfigContext.Provider>
    )
}
