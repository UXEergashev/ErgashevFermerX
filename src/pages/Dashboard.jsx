import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { calculateDashboardStats } from '../db/calculations';
import {
    Map as MapIcon,
    Sprout,
    Ruler,
    Leaf,
    Package,
    Receipt,
    CircleDollarSign,
    TrendingUp,
    TrendingDown
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        const data = await calculateDashboardStats(user.id);
        setStats(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={styles.pageTitle}>{t('dashboard.title')}</h1>
            <p style={styles.greeting}>{t('dashboard.greeting')}, {user.name}!</p>

            <div className="grid grid-2">
                <StatCard
                    title={t('dashboard.totalLand')}
                    value={stats.totalLandArea}
                    unit={t('common.ha')}
                    icon={<MapIcon size={20} />}
                    variant="secondary"
                    color="#3b82f6"
                />
                <StatCard
                    title={t('dashboard.plantedArea')}
                    value={stats.plantedArea}
                    unit={t('common.ha')}
                    icon={<Sprout size={20} />}
                    variant="primary"
                    color="#10b981"
                />
                <StatCard
                    title={t('dashboard.emptyLand')}
                    value={stats.emptyLandArea}
                    unit={t('common.ha')}
                    icon={<Ruler size={20} />}
                    variant="warning"
                    color="#f59e0b"
                />
                <StatCard
                    title={t('dashboard.activeCrops')}
                    value={stats.activeCropsCount}
                    unit={t('common.piece')}
                    icon={<Leaf size={20} />}
                    variant="purple"
                    color="#8b5cf6"
                />
                <StatCard
                    title={t('dashboard.warehouseItems')}
                    value={stats.warehouseItemsCount}
                    unit={t('common.type')}
                    icon={<Package size={20} />}
                    variant="pink"
                    color="#ec4899"
                />
                <StatCard
                    title={t('dashboard.totalExpenses')}
                    value={Number(stats.totalExpenses).toLocaleString()}
                    unit={t('common.sum')}
                    icon={<Receipt size={20} />}
                    variant="danger"
                    color="#ef4444"
                />
                <StatCard
                    title={t('dashboard.totalIncome')}
                    value={Number(stats.totalIncome).toLocaleString()}
                    unit={t('common.sum')}
                    icon={<CircleDollarSign size={20} />}
                    variant="primary"
                    color="#10b981"
                />
                <StatCard
                    title={t('dashboard.balance')}
                    value={Number(stats.balance).toLocaleString()}
                    unit={t('common.sum')}
                    icon={Number(stats.balance) >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    variant={Number(stats.balance) >= 0 ? "primary" : "danger"}
                    color={Number(stats.balance) >= 0 ? "#10b981" : "#ef4444"}
                />
            </div>


        </div>
    );
};

const StatCard = ({ title, value, unit, icon, color, variant }) => (
    <div className="card" style={{ borderLeft: `4px solid ${color}`, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={styles.statHeader}>
            <div className={`icon-container icon-${variant}`}>
                {icon}
            </div>
            <span className="text-muted text-small" style={{ fontWeight: '500' }}>{title}</span>
        </div>
        <div style={styles.statValue}>
            <span style={{ ...styles.value, color }}>{value}</span>
            <span style={styles.unit}>{unit}</span>
        </div>
    </div>
);

const styles = {
    pageTitle: {
        marginBottom: '0.5rem'
    },
    greeting: {
        color: 'var(--text-muted)',
        marginBottom: '1.5rem'
    },
    statHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem'
    },
    statIcon: {
        fontSize: '1.5rem'
    },
    statValue: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.5rem'
    },
    value: {
        fontSize: '1.75rem',
        fontWeight: '700'
    },
    unit: {
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
    }
};

export default Dashboard;

