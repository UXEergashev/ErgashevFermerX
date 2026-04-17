import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
    calculateCropProfitAnalysis,
    calculateLandProfitAnalysis,
    getSeasonalTrends,
    getAnalyticsSummary
} from '../db/analytics';
import { getAllByUserId } from '../db/operations';
import { getYieldAnalysisForAllCrops } from '../db/yieldPrediction';
import YieldForecastTab from '../components/YieldForecastTab';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
    PieChart,
    LayoutDashboard,
    Sprout,
    Map as MapIcon,
    TrendingUp,
    CircleDollarSign,
    Receipt,
    Wallet,
    Trophy,
    AlertTriangle,
    BarChart3,
    ArrowUpCircle,
    ArrowDownCircle,
    Leaf,
    FlaskConical,
    Droplets,
    Sun,
    Bug,
    Tractor,
    Wheat,
    Info
} from 'lucide-react';

const Analytics = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [summary, setSummary] = useState(null);
    const [cropData, setCropData] = useState([]);
    const [landData, setLandData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [yieldData, setYieldData] = useState([]);
    const [selectedCropYield, setSelectedCropYield] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const [summaryData, crops, lands, trends, allCrops, allLands] = await Promise.all([
                getAnalyticsSummary(user.id),
                calculateCropProfitAnalysis(user.id),
                calculateLandProfitAnalysis(user.id),
                getSeasonalTrends(user.id, 12),
                getAllByUserId('crops', user.id),
                getAllByUserId('land', user.id)
            ]);

            setSummary(summaryData);
            setCropData(crops);
            setLandData(lands);
            setTrendData(trends);

            // Hosildorlik tahlili
            const yieldAnalysis = getYieldAnalysisForAllCrops(allCrops, allLands);
            setYieldData(yieldAnalysis);
            if (yieldAnalysis.length > 0) setSelectedCropYield(yieldAnalysis[0]);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('uz-UZ').format(value);
    };

    const tabs = [
        { id: 'overview', label: t('analytics.overview'), icon: <LayoutDashboard size={18} /> },
        { id: 'crops', label: t('nav.crops'), icon: <Sprout size={18} /> },
        { id: 'lands', label: t('nav.land'), icon: <MapIcon size={18} /> },
        { id: 'trends', label: t('analytics.trends'), icon: <TrendingUp size={18} /> },
        { id: 'yield', label: 'Hosil Pragnozi', icon: <Wheat size={18} /> }
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div className="icon-container icon-primary">
                    <PieChart size={24} />
                </div>
                <h1 style={{ margin: 0 }}>{t('analytics.title')}</h1>
            </div>

            {/* Tab Navigation */}
            <div style={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            ...styles.tab,
                            ...(activeTab === tab.id ? styles.activeTab : {}),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div>
                    <div className="grid grid-2 mb-lg">
                        <SummaryCard
                            icon={<Wallet size={24} />}
                            variant="primary"
                            title={t('analytics.profit')}
                            value={formatCurrency(summary?.totalProfit || 0)}
                            unit={t('common.sum')}
                            color={summary?.totalProfit >= 0 ? '#10b981' : '#ef4444'}
                        />
                        <SummaryCard
                            icon={<CircleDollarSign size={24} />}
                            variant="primary"
                            title={t('common.totalIncome')}
                            value={formatCurrency(summary?.totalIncome || 0)}
                            unit={t('common.sum')}
                            color="#3b82f6"
                        />
                        <SummaryCard
                            icon={<Receipt size={24} />}
                            variant="warning"
                            title={t('common.totalExpenses')}
                            value={formatCurrency(summary?.totalExpenses || 0)}
                            unit={t('common.sum')}
                            color="#f59e0b"
                        />
                        <SummaryCard
                            icon={<Sprout size={24} />}
                            variant="secondary"
                            title={t('common.profitableCrops')}
                            value={summary?.profitableCropsCount || 0}
                            unit="ta"
                            color="#10b981"
                        />
                    </div>

                    {/* Top Performer & Worst */}
                    <div className="grid grid-2 mb-lg">
                        {summary?.topCrop && (
                            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <div className="icon-container icon-primary" style={{ padding: '6px' }}>
                                        <Trophy size={18} />
                                    </div>
                                    <h3 style={{ ...styles.cardTitle, margin: 0 }}>{t('analytics.mostProfitable')}</h3>
                                </div>
                                <div style={styles.highlightName}>{summary.topCrop.name}</div>
                                <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: '700' }}>
                                    +{formatCurrency(summary.topCrop.profit)} {t('common.sum')}
                                </div>
                            </div>
                        )}
                        {summary?.worstLand && (
                            <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <div className="icon-container icon-danger" style={{ padding: '6px' }}>
                                        <AlertTriangle size={18} />
                                    </div>
                                    <h3 style={{ ...styles.cardTitle, margin: 0 }}>{t('analytics.leastProfitable')}</h3>
                                </div>
                                <div style={styles.highlightName}>{summary.worstLand.name}</div>
                                <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: '700' }}>
                                    -{formatCurrency(summary.worstLand.loss)} {t('common.sum')}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mini Trend Chart */}
                    {trendData.length > 0 && (
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div className="icon-container icon-secondary" style={{ padding: '6px' }}>
                                    <TrendingUp size={18} />
                                </div>
                                <h3 style={{ ...styles.cardTitle, margin: 0 }}>{t('analytics.last12MonthsDynamics')}</h3>
                            </div>
                            <div style={{ height: '300px', marginTop: '1rem' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="shortMonth" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value) + " so'm", '']}
                                            labelFormatter={(label) => `Oy: ${label}`}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="income" name={t('finance.income')} stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                                        <Line type="monotone" dataKey="expenses" name={t('finance.expenses')} stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                                        <Line type="monotone" dataKey="profit" name={t('analytics.profit')} stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Crops Tab */}
            {activeTab === 'crops' && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div className="icon-container icon-primary" style={{ padding: '8px' }}>
                            <Sprout size={20} />
                        </div>
                        <h2 style={{ ...styles.sectionTitle, margin: 0 }}>{t('analytics.profitAnalysisByCrops')}</h2>
                    </div>

                    {cropData.length > 0 ? (
                        <>
                            <div className="card mb-lg">
                                <h3 style={styles.cardTitle}>{t('analytics.cropProfitability')}</h3>
                                <div style={{ height: '350px', marginTop: '1rem' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={cropData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis type="number" tick={{ fontSize: 12 }} />
                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value) => [formatCurrency(value) + " " + t('common.sum'), t('analytics.profit')]} />
                                            <Bar dataKey="profit" name={t('analytics.profit')}>
                                                {cropData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="card">
                                <h3 style={styles.cardTitle}>{t('analytics.detailedData')}</h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>{t('crops.cropName')}</th>
                                                <th>{t('crops.area')}</th>
                                                <th>{t('finance.income')}</th>
                                                <th>{t('finance.expenses')}</th>
                                                <th>{t('analytics.profit')}</th>
                                                <th>{t('analytics.profitPerHa')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cropData.map(crop => (
                                                <tr key={crop.id}>
                                                    <td style={{ fontWeight: '600' }}>
                                                        {crop.isProfitable ? '✅' : '❌'} {crop.name}
                                                    </td>
                                                    <td>{crop.area.toFixed(2)} ga</td>
                                                    <td style={{ color: '#10b981' }}>{formatCurrency(crop.totalIncome)}</td>
                                                    <td style={{ color: '#ef4444' }}>{formatCurrency(crop.totalExpenses)}</td>
                                                    <td style={{ color: crop.profit >= 0 ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                                                        {crop.profit >= 0 ? '+' : ''}{formatCurrency(crop.profit)}
                                                    </td>
                                                    <td>{formatCurrency(crop.profitPerHectare)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="icon-container icon-primary" style={{ padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                <Sprout size={48} />
                            </div>
                            <div className="empty-state-text">{t('analytics.noDataYet')}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Lands Tab */}
            {activeTab === 'lands' && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div className="icon-container icon-primary" style={{ padding: '8px' }}>
                            <MapIcon size={20} />
                        </div>
                        <h2 style={{ ...styles.sectionTitle, margin: 0 }}>{t('analytics.landsAnalysis')}</h2>
                    </div>

                    {landData.length > 0 ? (
                        <>
                            <div className="card mb-lg">
                                <h3 style={styles.cardTitle}>{t('analytics.landProfitability')}</h3>
                                <div style={{ height: '350px', marginTop: '1rem' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={landData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value) => [formatCurrency(value) + " " + t('common.sum'), t('analytics.profit')]} />
                                            <Bar dataKey="profit" name={t('analytics.profit')}>
                                                {landData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="grid grid-2 mb-lg">
                                <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div className="icon-container icon-primary" style={{ padding: '6px' }}><ArrowUpCircle size={16} /></div>
                                        <div style={styles.statLabel}>{t('common.profitableLands')}</div>
                                    </div>
                                    <div style={{ ...styles.statValue, color: '#10b981' }}>{landData.filter(l => l.isProfitable).length} ta</div>
                                </div>
                                <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div className="icon-container icon-danger" style={{ padding: '6px' }}><ArrowDownCircle size={16} /></div>
                                        <div style={styles.statLabel}>{t('common.losingLands')}</div>
                                    </div>
                                    <div style={{ ...styles.statValue, color: '#ef4444' }}>{landData.filter(l => l.isLosing).length} ta</div>
                                </div>
                            </div>

                            <div className="card">
                                <h3 style={styles.cardTitle}>{t('analytics.detailedData')}</h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>{t('land.landName')}</th>
                                                <th>{t('land.landArea')}</th>
                                                <th>{t('nav.crops')}</th>
                                                <th>{t('finance.income')}</th>
                                                <th>{t('finance.expenses')}</th>
                                                <th>{t('analytics.profit')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {landData.map(land => (
                                                <tr key={land.id} style={land.isLosing ? { background: '#fef2f2' } : {}}>
                                                    <td style={{ fontWeight: '600' }}>{land.isProfitable ? '✅' : '❌'} {land.name}</td>
                                                    <td>{land.totalArea.toFixed(2)} ga</td>
                                                    <td>{land.cropsCount} ta</td>
                                                    <td style={{ color: '#10b981' }}>{formatCurrency(land.totalIncome)}</td>
                                                    <td style={{ color: '#ef4444' }}>{formatCurrency(land.totalExpenses)}</td>
                                                    <td style={{ color: land.profit >= 0 ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                                                        {land.profit >= 0 ? '+' : ''}{formatCurrency(land.profit)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="icon-container icon-primary" style={{ padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                <MapIcon size={48} />
                            </div>
                            <div className="empty-state-text">{t('analytics.noDataYet')}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Trends Tab */}
            {activeTab === 'trends' && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div className="icon-container icon-primary" style={{ padding: '8px' }}>
                            <TrendingUp size={20} />
                        </div>
                        <h2 style={{ ...styles.sectionTitle, margin: 0 }}>{t('analytics.seasonalDynamics')}</h2>
                    </div>

                    {trendData.length > 0 ? (
                        <>
                            <div className="card mb-lg">
                                <h3 style={styles.cardTitle}>{t('analytics.last12MonthsDynamics')}</h3>
                                <div style={{ height: '400px', marginTop: '1rem' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="shortMonth" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value) => [formatCurrency(value) + " so'm", '']} />
                                            <Legend />
                                            <Line type="monotone" dataKey="income" name={t('finance.income')} stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} activeDot={{ r: 8 }} />
                                            <Line type="monotone" dataKey="expenses" name={t('finance.expenses')} stroke="#ef4444" strokeWidth={3} dot={{ r: 6, fill: '#ef4444' }} activeDot={{ r: 8 }} />
                                            <Line type="monotone" dataKey="profit" name={t('analytics.profit')} stroke="#3b82f6" strokeWidth={4} dot={{ r: 7, fill: '#3b82f6' }} activeDot={{ r: 10 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="card">
                                <h3 style={styles.cardTitle}>{t('analytics.monthlyData')}</h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>{t('analytics.month')}</th>
                                                <th>{t('finance.income')}</th>
                                                <th>{t('finance.expenses')}</th>
                                                <th>{t('analytics.profit')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trendData.map((month, index) => (
                                                <tr key={index}>
                                                    <td style={{ fontWeight: '600' }}>{month.month}</td>
                                                    <td style={{ color: '#10b981' }}>{formatCurrency(month.income)} so'm</td>
                                                    <td style={{ color: '#ef4444' }}>{formatCurrency(month.expenses)} so'm</td>
                                                    <td style={{ color: month.profit >= 0 ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                                                        {month.profit >= 0 ? '+' : ''}{formatCurrency(month.profit)} so'm
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="icon-container icon-primary" style={{ padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                <TrendingUp size={48} />
                            </div>
                            <div className="empty-state-text">{t('analytics.noDataAvailable')}</div>
                            <p className="text-muted">{t('analytics.analysisHint')}</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'yield' && (
                <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                    <YieldForecastTab />
                </div>
            )}
        </div>
    );
};

// O'sish bosqichi nomlarini tarjima qilish
const translateStage = (stage) => {
    const stages = {
        'GERMINATION': 'Unib chiqish',
        'EARLY_GROWTH': 'Erta o\'sish',
        'MID_GROWTH': 'O\'rta o\'sish',
        'FLOWERING': 'Gullash',
        'FRUIT_SET': 'Meva hosil',
        'MATURATION': 'Pishoqlash',
        'DEFAULT': 'O\'rta o\'sish'
    };
    return stages[stage] || stage;
};

// Summary Card Component
const SummaryCard = ({ icon, title, value, unit, color, variant }) => (
    <div className="card" style={{ borderLeft: `4px solid ${color}`, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className={`icon-container icon-${variant}`} style={{ padding: '8px' }}>
                {icon}
            </div>
            <div className="text-muted text-small" style={{ fontWeight: '500' }}>{title}</div>
        </div>
        <div style={{ color, fontSize: '1.75rem', fontWeight: '700', marginLeft: '0.25rem' }}>
            {value} <span style={{ fontSize: '0.875rem' }}>{unit}</span>
        </div>
    </div>
);

const styles = {
    tabs: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        background: 'var(--bg-card)',
        padding: '0.5rem',
        borderRadius: '0.75rem',
        flexWrap: 'wrap',
        border: '1px solid var(--border)'
    },
    tab: {
        flex: 1,
        minWidth: '80px',
        padding: '0.75rem 1rem',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        borderRadius: '0.5rem',
        fontWeight: '500',
        fontSize: '0.875rem',
        transition: 'all 0.2s',
        color: 'var(--text-muted)'
    },
    activeTab: {
        background: 'var(--primary)',
        color: 'white'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: 'var(--text-main)'
    },
    cardTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--text-main)',
        marginBottom: '0.5rem'
    },
    highlightName: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        color: 'var(--text-main)'
    },
    statLabel: {
        color: 'var(--text-muted)',
        fontSize: '0.875rem'
    },
    statValue: {
        fontSize: '1.75rem',
        fontWeight: '700'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.875rem'
    },
    yieldStatBox: {
        background: 'var(--bg-page)',
        padding: '0.75rem',
        borderRadius: '8px',
        textAlign: 'center'
    },
    yieldStatLabel: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginBottom: '0.25rem'
    },
    yieldStatValue: {
        fontSize: '1.4rem',
        fontWeight: '700'
    },
    yieldStatSub: {
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        marginTop: '0.15rem'
    }
};

export default Analytics;
