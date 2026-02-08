import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import LanguageSelector from './LanguageSelector';
import SettingsMenu from './SettingsMenu';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, Settings, RefreshCw } from 'lucide-react';

const Layout = () => {
    const { user, logout, isSyncing } = useAuth();
    const { t } = useLanguage();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="icon-container" style={{ padding: '6px', background: 'rgba(255,255,255,0.2)', color: 'white', position: 'relative' }}>
                            <img src="/favicon.png" alt="Logo" style={{ width: '20px', height: '20px' }} />
                            {isSyncing && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    background: 'var(--primary)',
                                    borderRadius: '50%',
                                    padding: '2px',
                                    animation: 'spin 2s linear infinite'
                                }}>
                                    <RefreshCw size={10} />
                                </div>
                            )}
                        </div>
                        <h2 style={styles.appName}>FermerX</h2>
                    </div>
                    <div style={styles.headerRight}>
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                className="icon-container"
                            >
                                <Settings size={20} />
                            </button>
                            <SettingsMenu
                                isOpen={isSettingsOpen}
                                onClose={() => setIsSettingsOpen(false)}
                            />
                        </div>
                        <div style={styles.userInfo}>
                            <button onClick={logout} style={{ ...styles.logoutBtn, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LogOut size={16} />
                                {t('common.logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main style={styles.main}>
                <Outlet />
            </main>

            <BottomNav />
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-page)',
        transition: 'background-color 0.3s'
    },
    header: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '0.75rem 1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '1rem'
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    appName: {
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: 0
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    userName: {
        fontSize: '0.875rem',
        fontWeight: '500',
        display: 'none'
    },
    logoutBtn: {
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background 0.2s'
    },
    main: {
        flex: 1,
        padding: '1rem',
        paddingBottom: '80px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto'
    }
};

export default Layout;

