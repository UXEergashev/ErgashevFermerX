import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTrashByUserId, restoreFromTrash, deleteFromTrashPermanently, emptyTrash } from '../db/operations';
import { Trash2, RotateCcw, Trash as TrashIcon, Info, AlertTriangle } from 'lucide-react';

const Trash = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [trashItems, setTrashItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrash();
    }, []);

    const loadTrash = async () => {
        setLoading(true);
        const data = await getTrashByUserId(user.id);
        setTrashItems(data.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)));
        setLoading(false);
    };

    const handleRestore = async (id) => {
        await restoreFromTrash(id);
        loadTrash();
    };

    const handleDeletePermanently = async (id) => {
        if (confirm(t('common.confirmPersistently') || 'Haqiqatan ham butunlay o\'chirib tashlamoqchimisiz?')) {
            await deleteFromTrashPermanently(id);
            loadTrash();
        }
    };

    const handleEmptyTrash = async () => {
        if (confirm(t('common.confirmEmptyTrash') || 'Karzinkani butunlay bo\'shatmoqchimisiz?')) {
            await emptyTrash(user.id);
            loadTrash();
        }
    };

    const getStoreLabel = (storeName) => {
        const labels = {
            'crops': t('nav.crops'),
            'land': t('nav.land'),
            'expenses': t('common.totalExpenses'),
            'income': t('common.totalIncome'),
            'warehouse': t('nav.warehouse')
        };
        return labels[storeName] || storeName;
    };

    const getItemName = (item) => {
        return item.name || item.source || item.type || t('common.noData');
    };

    if (loading) {
        return <div className="spinner-container"><div className="spinner"></div></div>;
    }

    return (
        <div>
            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="icon-container icon-danger">
                        <TrashIcon size={24} />
                    </div>
                    <h1>{t('settings.trash') || 'Karzinka'}</h1>
                </div>
                {trashItems.length > 0 && (
                    <button onClick={handleEmptyTrash} className="btn btn-danger btn-sm">
                        <Trash2 size={16} /> {t('common.emptyTrash') || 'Tozalash'}
                    </button>
                )}
            </div>

            <div className="alert alert-info mb-lg" style={{ display: 'flex', gap: '0.75rem' }}>
                <Info size={20} style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    {t('settings.trashInfo') || 'O\'chirilgan ma\'lumotlar bu yerda 30 kun davomida saqlanadi (demo talqinda cheksiz). Ularni qayta tiklashingiz yoki butunlay o\'chirib yuborishingiz mumkin.'}
                </p>
            </div>

            {trashItems.length === 0 ? (
                <div className="empty-state">
                    <div className="icon-container" style={{ padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem', background: 'var(--bg-card)' }}>
                        <TrashIcon size={48} className="text-muted" />
                    </div>
                    <div className="empty-state-text">{t('common.trashEmpty') || 'Karzinka bo\'sh'}</div>
                </div>
            ) : (
                <div className="grid">
                    {trashItems.map((item) => (
                        <div key={item.id} className="card" style={styles.trashCard}>
                            <div style={styles.cardInfo}>
                                <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>
                                    {getItemName(item)}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {getStoreLabel(item.originalStore)} • {new Date(item.deletedAt).toLocaleString('uz-UZ')}
                                </div>
                            </div>
                            <div style={styles.cardActions}>
                                <button
                                    onClick={() => handleRestore(item.id)}
                                    className="btn btn-outline btn-sm"
                                    title={t('common.restore') || 'Tiklash'}
                                >
                                    <RotateCcw size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeletePermanently(item.id)}
                                    className="btn btn-danger btn-sm"
                                    title={t('common.deletePermanently') || 'Butunlay o\'chirish'}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
    },
    trashCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem'
    },
    cardInfo: {
        flex: 1
    },
    cardActions: {
        display: 'flex',
        gap: '0.5rem'
    }
};

export default Trash;
