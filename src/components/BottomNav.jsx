import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
    LayoutDashboard,
    Sprout,
    Map as MapIcon,
    Wallet,
    Package,
    BarChart3,
    PieChart
} from 'lucide-react';

const BottomNav = () => {
    const { t } = useLanguage();

    const navItems = [
        { path: '/', icon: <LayoutDashboard size={22} />, labelKey: 'nav.home' },
        { path: '/crops', icon: <Sprout size={22} />, labelKey: 'nav.crops' },
        { path: '/land', icon: <MapIcon size={22} />, labelKey: 'nav.land' },
        { path: '/finance', icon: <Wallet size={22} />, labelKey: 'nav.finance' },
        { path: '/warehouse', icon: <Package size={22} />, labelKey: 'nav.warehouse' },
        { path: '/reports', icon: <BarChart3 size={22} />, labelKey: 'nav.reports' },
        { path: '/analytics', icon: <PieChart size={22} />, labelKey: 'nav.analytics' }
    ];

    return (
        <nav className="bottom-nav" style={styles.nav}>
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    style={({ isActive }) => ({
                        ...styles.navItem,
                        ...(isActive ? styles.navItemActive : {})
                    })}
                >
                    <span style={styles.icon}>{item.icon}</span>
                    <span style={styles.label}>{t(item.labelKey)}</span>
                </NavLink>
            ))}
        </nav>
    );
};

const styles = {
    nav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        padding: '0.5rem 0',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        zIndex: 100
    },
    navItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.5rem',
        textDecoration: 'none',
        color: 'var(--text-muted)',
        transition: 'all 0.2s',
        flex: 1,
        maxWidth: '80px'
    },
    navItemActive: {
        color: 'var(--primary)'
    },
    icon: {
        fontSize: '1.5rem'
    },
    label: {
        fontSize: '0.625rem',
        fontWeight: '500',
        textAlign: 'center'
    }
};

export default BottomNav;

