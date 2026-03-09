import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { initDB, getDB } from '../db/database';
import {
    ShoppingCart,
    ChevronDown,
    ChevronUp,
    Calendar,
    Package,
    Phone,
    User,
    TrendingUp,
    Trash2,
    Filter
} from 'lucide-react';

const SoldItems = () => {
    const { user } = useAuth();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date_desc');

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        setLoading(true);
        try {
            await initDB(); // DB versiyasini yangilash (soldItems store yaratish)
            const db = await getDB();
            const all = await db.getAllFromIndex('soldItems', 'userId', user.id);
            setSales(all.sort((a, b) => new Date(b.soldDate) - new Date(a.soldDate)));
        } catch (err) {
            console.error(err);
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Bu yozuvni o'chirilsinmi?")) return;
        const db = await getDB();
        await db.delete('soldItems', id);
        loadSales();
    };

    // Statistika
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((s, x) => s + (x.totalIncome || 0), 0);
    const totalKg = sales.reduce((s, x) => s + (x.quantityKg || 0), 0);
    const uniqueProducts = [...new Set(sales.map(s => s.itemName))];
    const avgPricePerKg = totalKg > 0 ? totalRevenue / totalKg : 0;

    // Filterlangan va saralangan
    const filtered = filter === 'all' ? sales : sales.filter(s => s.itemName === filter);

    const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
            case 'date_asc': return new Date(a.soldDate) - new Date(b.soldDate);
            case 'amount_desc': return b.totalIncome - a.totalIncome;
            case 'amount_asc': return a.totalIncome - b.totalIncome;
            case 'date_desc':
            default: return new Date(b.soldDate) - new Date(a.soldDate);
        }
    });

    if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

    return (
        <div>
            {/* Sarlavha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div className="icon-container icon-primary">
                    <ShoppingCart size={24} />
                </div>
                <div>
                    <h1 style={{ margin: 0 }}>Sotilgan mahsulotlar</h1>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Barcha sotuv tarixi va daromad tahlili
                    </div>
                </div>
            </div>

            {/* Umumiy statistikalar */}
            {totalSales > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <StatCard icon="🛒" label="Jami sotuvlar" value={`${totalSales} ta`} color="#3b82f6" />
                    <StatCard icon="💰" label="Jami daromad" value={`${(totalRevenue / 1000000).toFixed(1)} mln`} sub={`${totalRevenue.toLocaleString()} so'm`} color="#10b981" />
                    <StatCard icon="⚖️" label="Jami miqdor" value={totalKg >= 1000 ? `${(totalKg / 1000).toFixed(2)} t` : `${totalKg.toFixed(0)} kg`} color="#8b5cf6" />
                    <StatCard icon="📊" label="O'rtacha narx" value={`${avgPricePerKg.toFixed(0)} so'm`} sub="1 kg uchun" color="#f59e0b" />
                    <StatCard icon="🌾" label="Mahsulot turlari" value={`${uniqueProducts.length} xil`} color="#ec4899" />
                </div>
            )}

            {/* Filter va sort */}
            {sales.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
                        <button onClick={() => setFilter('all')} className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}>
                            Barchasi ({sales.length})
                        </button>
                        {uniqueProducts.map(name => (
                            <button key={name} onClick={() => setFilter(name)} className={`btn btn-sm ${filter === name ? 'btn-primary' : 'btn-outline'}`}>
                                {name} ({sales.filter(s => s.itemName === name).length})
                            </button>
                        ))}
                    </div>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="form-select"
                        style={{ width: 'auto', fontSize: '0.82rem', padding: '0.4rem 0.75rem' }}
                    >
                        <option value="date_desc">📅 Eng yangi</option>
                        <option value="date_asc">📅 Eng eski</option>
                        <option value="amount_desc">💰 Katta summa</option>
                        <option value="amount_asc">💰 Kichik summa</option>
                    </select>
                </div>
            )}

            {sorted.length === 0 ? (
                <div className="empty-state">
                    <div className="icon-container icon-primary" style={{ padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <ShoppingCart size={48} />
                    </div>
                    <div className="empty-state-text">Hali mahsulot sotilmagan</div>
                    <p className="text-muted">Ombor bo'limida "SOTILDI" tugmasini bosing</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sorted.map(sale => (
                        <SaleCard
                            key={sale.id}
                            sale={sale}
                            isExpanded={expandedId === sale.id}
                            onToggle={() => setExpandedId(expandedId === sale.id ? null : sale.id)}
                            onDelete={() => handleDelete(sale.id)}
                        />
                    ))}
                </div>
            )}

            {/* Oylik sotuv jadvali */}
            {sales.length > 0 && (
                <MonthlySummary sales={sales} />
            )}
        </div>
    );
};

// =============================================
// SOTUV KARTASI
// =============================================
const SaleCard = ({ sale, isExpanded, onToggle, onDelete }) => {
    return (
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
            <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={onToggle}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="icon-container icon-primary" style={{ padding: '6px' }}>
                        <Package size={18} />
                    </div>
                    <div>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                            🛒 {sale.itemName}
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '400' }}>
                                {sale.itemCategory}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '2px' }}>
                            <span>📅 {sale.soldDate ? new Date(sale.soldDate).toLocaleDateString('uz-UZ') : '—'}</span>
                            <span>⚖️ {sale.quantityKg} kg</span>
                            <span>💵 {(sale.pricePerKg || 0).toLocaleString()} so'm/kg</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', fontSize: '1.15rem', color: '#10b981' }}>
                            {(sale.totalIncome || 0).toLocaleString()} so'm
                        </div>
                        {sale.buyerName && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                👤 {sale.buyerName}
                            </div>
                        )}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </div>

            {/* Kengaytirilgan tafsilot */}
            {isExpanded && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
                        <MiniStat label="Miqdor" value={`${sale.quantityKg} kg`} sub={sale.quantityTon ? `(${sale.quantityTon.toFixed(3)} t)` : ''} color="#3b82f6" />
                        <MiniStat label="Narx/kg" value={`${(sale.pricePerKg || 0).toLocaleString()} s`} sub={sale.pricePerTon ? `${(sale.pricePerTon).toLocaleString()} s/t` : ''} color="#f59e0b" />
                        <MiniStat label="Jami daromad" value={`${(sale.totalIncome || 0).toLocaleString()}`} sub="so'm" color="#10b981" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        {/* Sotuv ma'lumotlari */}
                        <div style={styles.section}>
                            <div style={styles.sTitle}>📦 Sotuv tafsiloti</div>
                            <InfoRow icon={<Calendar size={12} />} label="Sotuv sanasi" value={sale.soldDate ? new Date(sale.soldDate).toLocaleDateString('uz-UZ') : '—'} />
                            <InfoRow icon={<Package size={12} />} label="Mahsulot" value={sale.itemName} />
                            <InfoRow icon={<Package size={12} />} label="Kategoriya" value={sale.itemCategory || '—'} />
                            <InfoRow label="Sotildi" value={`${sale.quantityKg} kg`} bold />
                            <InfoRow label="Narx (1 kg)" value={`${(sale.pricePerKg || 0).toLocaleString()} so'm`} bold />
                            <InfoRow label="Jami" value={`${(sale.totalIncome || 0).toLocaleString()} so'm`} bold color="#10b981" />
                        </div>

                        {/* Xaridor + Ombor holati */}
                        <div>
                            {(sale.buyerName || sale.buyerPhone) && (
                                <div style={{ ...styles.section, marginBottom: '0.75rem' }}>
                                    <div style={styles.sTitle}>👤 Xaridor</div>
                                    {sale.buyerName && <InfoRow icon={<User size={12} />} label="Ismi" value={sale.buyerName} bold />}
                                    {sale.buyerPhone && <InfoRow icon={<Phone size={12} />} label="Telefon" value={sale.buyerPhone} />}
                                </div>
                            )}
                            <div style={styles.section}>
                                <div style={styles.sTitle}>📊 Ombor holati</div>
                                <InfoRow label="Sotuv oldidan" value={`${(sale.stockBeforeKg || 0).toFixed(0)} kg`} />
                                <InfoRow label="Sotuv sonidan" value={`${(sale.stockAfterKg || 0).toFixed(0)} kg`} bold color="#ef4444" />
                            </div>
                        </div>
                    </div>

                    {sale.notes && (
                        <div style={{ padding: '0.6rem 0.75rem', background: 'var(--bg-page)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                            📝 {sale.notes}
                        </div>
                    )}

                    <div style={{ textAlign: 'right' }}>
                        <button onClick={onDelete} className="btn btn-sm btn-danger" style={{ opacity: 0.7 }}>
                            <Trash2 size={14} /> O'chirish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// =============================================
// OYLIK XULOSA JADVALI
// =============================================
const MonthlySummary = ({ sales }) => {
    const byMonth = {};
    sales.forEach(sale => {
        const d = new Date(sale.soldDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' });
        if (!byMonth[key]) byMonth[key] = { label, revenue: 0, kg: 0, count: 0 };
        byMonth[key].revenue += sale.totalIncome || 0;
        byMonth[key].kg += sale.quantityKg || 0;
        byMonth[key].count += 1;
    });

    const months = Object.entries(byMonth).sort((a, b) => b[0].localeCompare(a[0]));
    if (months.length === 0) return null;

    return (
        <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div className="icon-container icon-primary" style={{ padding: '6px' }}>
                    <TrendingUp size={18} />
                </div>
                <h3 style={{ margin: 0 }}>Oylik sotuv xulosasi</h3>
            </div>
            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-page)' }}>
                            <th style={thStyle}>Oy</th>
                            <th style={thStyle}>Sotuvlar</th>
                            <th style={thStyle}>Miqdor</th>
                            <th style={thStyle}>Daromad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {months.map(([key, m]) => (
                            <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={tdStyle}>{m.label}</td>
                                <td style={tdStyle}>{m.count} ta</td>
                                <td style={tdStyle}>{m.kg >= 1000 ? `${(m.kg / 1000).toFixed(2)} t` : `${m.kg.toFixed(0)} kg`}</td>
                                <td style={{ ...tdStyle, fontWeight: '700', color: '#10b981' }}>
                                    {m.revenue.toLocaleString()} so'm
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={{ background: 'var(--bg-page)', fontWeight: '700' }}>
                            <td style={tdStyle}>JAMI</td>
                            <td style={tdStyle}>{sales.length} ta</td>
                            <td style={tdStyle}>
                                {(() => { const kg = sales.reduce((s, x) => s + (x.quantityKg || 0), 0); return kg >= 1000 ? `${(kg / 1000).toFixed(2)} t` : `${kg.toFixed(0)} kg`; })()}
                            </td>
                            <td style={{ ...tdStyle, color: '#10b981' }}>
                                {sales.reduce((s, x) => s + (x.totalIncome || 0), 0).toLocaleString()} so'm
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

// Mini komponentlar
const StatCard = ({ icon, label, value, sub, color }) => (
    <div className="card" style={{ textAlign: 'center', borderTop: `3px solid ${color}`, padding: '0.9rem' }}>
        <div style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{icon}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: '700', color }}>{value}</div>
        {sub && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
);

const MiniStat = ({ label, value, sub, color }) => (
    <div style={{ textAlign: 'center', padding: '0.6rem', background: 'var(--bg-page)', borderRadius: '8px' }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '1rem', fontWeight: '700', color }}>{value}</div>
        {sub && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
);

const InfoRow = ({ icon, label, value, bold, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.78rem' }}>
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>{icon} {label}</span>
        <span style={{ fontWeight: bold ? '700' : '500', color: color || 'var(--text-main)' }}>{value}</span>
    </div>
);

const thStyle = { padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.78rem' };
const tdStyle = { padding: '0.6rem 0.75rem', color: 'var(--text-main)' };

const styles = {
    section: { background: 'var(--bg-page)', borderRadius: '8px', padding: '0.6rem 0.75rem' },
    sTitle: { fontWeight: '600', fontSize: '0.78rem', color: 'var(--text-main)', marginBottom: '0.4rem' }
};

export default SoldItems;
