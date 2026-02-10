'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({
    settings: {},
    update: () => { },
    toggle: () => { },
    set: () => { },
    resetAll: () => { },
});

const DEFAULT_SETTINGS = {
    // System Features
    registrationsEnabled: true,
    joinRequestsEnabled: true,
    blogPostingEnabled: true,
    eventCreationEnabled: true,
    taskSubmissionsEnabled: true,
    announcementsEnabled: true,

    // Feature Flags (Beta)
    leaderboardEnabled: false,
    projectSystemEnabled: false,
    aiFeaturesEnabled: false,
    certificatesEnabled: false,
    internalChatEnabled: false,

    // Emergency Controls
    maintenanceMode: false,
    loginDisabled: false,
    dashboardsFrozen: false,
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loaded, setLoaded] = useState(false);

    // Persist settings to localStorage
    useEffect(() => {
        const stored = localStorage.getItem('tattva_settings');
        if (stored) {
            try {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem('tattva_settings', JSON.stringify(settings));
        }
    }, [settings, loaded]);

    const update = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const toggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Explicit set method (similar to update but clearer intent for direct setting)
    const set = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    }

    const resetAll = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    return (
        <SettingsContext.Provider value={{ settings, update, toggle, set, resetAll }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
