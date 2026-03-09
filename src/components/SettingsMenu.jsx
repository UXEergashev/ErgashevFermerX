import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
    Moon,
    Sun,
    Globe,
    Bell,
    User,
    ShieldCheck,
    CircleHelp,
    Trash as TrashIcon,
    RefreshCw,
    Archive,
    ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fullSync } from '../db/sync';

const SettingsMenu = ({ isOpen, onClose }) => {
    const { language, setLanguage, languages, t } = useLanguage();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { isSyncing } = useAuth();
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const handleManualSync = async () => {
        if (isSyncing) return;
        await fullSync();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="settings-dropdown" ref={menuRef}>
            <div className="settings-group">
                <span className="settings-label">{t('settings.appearance') || 'Ko\'rinish'}</span>
                <div className="settings-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                        <span>{isDarkMode ? t('settings.darkMode') || 'Tungi rejim' : t('settings.lightMode') || 'Kungi rejim'}</span>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            <div className="settings-group">
                <span className="settings-label">{t('settings.languageSelection') || 'Tilni tanlash'}</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                border: language === lang.code ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                                background: language === lang.code ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '1.25rem' }}>{lang.flag}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: '600', color: language === lang.code ? 'var(--primary)' : 'var(--text-main)' }}>
                                {lang.code.toUpperCase()}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="settings-group" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <span className="settings-label">{t('common.other') || 'Boshqa'}</span>
                <div className="settings-item" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Bell size={18} />
                        <span>{t('settings.notifications') || 'Bildirishnomalar'}</span>
                    </div>
                    <label className="switch">
                        <input type="checkbox" disabled />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="settings-item" style={{ cursor: 'pointer' }} onClick={handleManualSync}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <RefreshCw size={18} style={{ animation: isSyncing ? 'spin 2s linear infinite' : 'none' }} />
                        <span>{t('settings.syncNow') || 'Bulut bilan sinxronlash'}</span>
                    </div>
                </div>
                <div className="settings-item" style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <User size={18} />
                        <span>{t('auth.profile') || 'Profil'}</span>
                    </div>
                </div>
                <div className="settings-item" style={{ cursor: 'pointer' }} onClick={() => { navigate('/trash'); onClose(); }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <TrashIcon size={18} />
                        <span>{t('settings.trash') || 'Karzinka'}</span>
                    </div>
                </div>
                <div className="settings-item" style={{ cursor: 'pointer' }} onClick={() => { navigate('/harvested-crops'); onClose(); }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Archive size={18} />
                        <span>🌾 Yig'ilgan ekinlar</span>
                    </div>
                </div>
                <div className="settings-item" style={{ cursor: 'pointer' }} onClick={() => { navigate('/sold-items'); onClose(); }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShoppingCart size={18} />
                        <span>🛒 Sotilgan mahsulotlar</span>
                    </div>
                </div>
                <div className="settings-item" style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <CircleHelp size={18} />
                        <span>{t('common.help') || 'Yordam'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsMenu;
