import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getAllByUserId, add, update, remove } from '../db/operations';
import Modal from '../components/Modal';
import CropForm from '../components/CropForm';
import { calculateExpectedYield, calculateYieldPerHectare, getYieldWarnings, getYieldHealth } from '../db/yieldPrediction';
import {
    Sprout,
    Droplets,
    Beaker,
    Trash2,
    Edit,
    BarChart3,
    AlertTriangle,
    Info,
    Tractor,
    Users
} from 'lucide-react';

const Crops = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);

    useEffect(() => {
        loadCrops();
    }, []);

    const loadCrops = async () => {
        setLoading(true);
        const data = await getAllByUserId('crops', user.id);
        setCrops(data);
        setLoading(false);
    };

    const handleAdd = () => {
        setEditingCrop(null);
        setShowModal(true);
    };

    const handleEdit = (crop) => {
        setEditingCrop(crop);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm(t('common.confirm') + '?')) {
            await remove('crops', id);
            loadCrops();
        }
    };

    const handleSave = async (cropData) => {
        try {
            // Save crop
            if (editingCrop) {
                await update('crops', { ...cropData, id: editingCrop.id });
            } else {
                await add('crops', { ...cropData, userId: user.id });
            }

            // Auto-create separate expense for each type if amount is provided
            const expenseTypes = [
                { field: 'seedsExpense', type: 'Urug\'', icon: '🌱' },
                { field: 'fertilizerExpense', type: 'O\'g\'it', icon: '🧪' },
                { field: 'machineryExpense', type: 'Texnika', icon: '🚜' },
                { field: 'laborExpense', type: 'Ish haqi', icon: '👷' }
            ];

            for (const expenseType of expenseTypes) {
                const amount = cropData[expenseType.field];
                if (amount && parseFloat(amount) > 0) {
                    await add('expenses', {
                        userId: user.id,
                        date: cropData.plantDate,
                        type: expenseType.type,
                        amount: parseFloat(amount),
                        notes: `${expenseType.icon} ${cropData.name} - ${expenseType.type} `,
                        cropName: cropData.name,
                        autoCreated: true
                    });
                }
            }

            setShowModal(false);
            loadCrops();
        } catch (error) {
            console.error('Error saving crop:', error);
        }
    };

    const handleUpdateCrop = async (updatedCrop) => {
        try {
            await update('crops', updatedCrop);
            loadCrops();
        } catch (error) {
            console.error('Error updating crop:', error);
        }
    };

    if (loading) {
        return <div className="spinner-container"><div className="spinner"></div></div>;
    }

    return (
        <div>
            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="icon-container icon-primary">
                        <Sprout size={24} />
                    </div>
                    <h1>{t('crops.title')}</h1>
                </div>
                <button onClick={handleAdd} className="btn btn-primary">
                    + {t('crops.addCrop')}
                </button>
            </div>

            {crops.length === 0 ? (
                <div className="empty-state">
                    <div className="icon-container icon-primary" style={{ padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <Sprout size={48} />
                    </div>
                    <div className="empty-state-text">{t('common.noData')}</div>
                    <button onClick={handleAdd} className="btn btn-primary mt-md">
                        + {t('crops.addCrop')}
                    </button>
                </div>
            ) : (
                <div className="grid">
                    {crops.map((crop) => (
                        <CropCard
                            key={crop.id}
                            crop={crop}
                            onEdit={() => handleEdit(crop)}
                            onDelete={() => handleDelete(crop.id)}
                            onUpdateCrop={handleUpdateCrop}
                        />
                    ))}
                </div>
            )}

            {showModal && (
                <Modal
                    title={editingCrop ? t('crops.editCrop') : t('crops.addCrop')}
                    onClose={() => setShowModal(false)}
                >
                    <CropForm
                        crop={editingCrop}
                        onSave={handleSave}
                        onCancel={() => setShowModal(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

const CropCard = ({ crop, onEdit, onDelete, onUpdateCrop }) => {
    const { t } = useLanguage();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    const irrigationDate = new Date(crop.irrigationDate);
    irrigationDate.setHours(0, 0, 0, 0); // Normalize irrigationDate to start of day

    const fertilizerDate = new Date(crop.fertilizerDate);
    fertilizerDate.setHours(0, 0, 0, 0); // Normalize fertilizerDate to start of day

    const needsIrrigation = irrigationDate <= today;
    const needsFertilizer = fertilizerDate <= today;

    // Calculate yield prediction
    const expectedYield = calculateExpectedYield(crop);
    const yieldPerHectare = calculateYieldPerHectare(crop);
    const yieldHealth = getYieldHealth(crop);
    const warnings = getYieldWarnings(crop);

    // Determine health color
    const getHealthColor = () => {
        if (yieldHealth >= 90) return '#10b981'; // green
        if (yieldHealth >= 70) return '#f59e0b'; // yellow/orange
        return '#ef4444'; // red
    };

    const getWarningIcon = (type) => {
        switch (type) {
            case 'irrigation': return <Droplets size={16} />;
            case 'fertilizer': return <Beaker size={16} />;
            default: return <AlertTriangle size={16} />;
        }
    };

    const handleUpdateCropDate = async (field, newDate) => {
        const updatedCrop = { ...crop, [field]: newDate.toISOString().split('T')[0] }; // Store as YYYY-MM-DD
        await onUpdateCrop(updatedCrop);
    };

    const handleIrrigate = () => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + crop.irrigationInterval);
        handleUpdateCropDate('irrigationDate', newDate);
    };

    const handlePostponeIrrigation = () => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 1); // Postpone by 1 day
        handleUpdateCropDate('irrigationDate', newDate);
    };

    const handleFertilize = () => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + crop.fertilizerInterval);
        handleUpdateCropDate('fertilizerDate', newDate);
    };

    const handlePostponeFertilizer = () => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 1); // Postpone by 1 day
        handleUpdateCropDate('fertilizerDate', newDate);
    };

    return (
        <div className="card">
            <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="icon-container icon-primary" style={{ padding: '6px' }}>
                        <Sprout size={18} />
                    </div>
                    <h3 className="card-title">{crop.name}</h3>
                </div>
                <div className="flex gap-sm">
                    <button onClick={onEdit} className="btn btn-sm btn-outline">
                        <Edit size={14} />
                    </button>
                    <button onClick={onDelete} className="btn btn-sm btn-danger">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div style={styles.info}>
                    <span className="text-muted">Turi:</span>
                    <span>{crop.type}</span>
                </div>
                <div style={styles.info}>
                    <span className="text-muted">Ekilgan sana:</span>
                    <span>{new Date(crop.plantDate).toLocaleDateString('uz-UZ')}</span>
                </div>
                <div style={styles.info}>
                    <span className="text-muted">Maydon:</span>
                    <span className="text-primary" style={{ fontWeight: '600' }}>{crop.area} ga</span>
                </div>

                {/* Yield Prediction Section */}
                {crop.irrigationInterval && crop.fertilizerInterval && (
                    <div style={{ ...styles.yieldSection, borderColor: getHealthColor() }}>
                        <div style={styles.yieldHeader}>
                            <div className="icon-container" style={{ background: 'var(--bg-page)', padding: '6px' }}>
                                <BarChart3 size={18} />
                            </div>
                            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Hosildorlik prognozi</span>
                        </div>
                        <div style={styles.yieldData}>
                            <div>
                                <div className="text-muted text-small">Taxminiy hosil</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: getHealthColor() }}>
                                    {expectedYield.toFixed(1)} t
                                </div>
                                <div className="text-muted text-small">({yieldPerHectare.toFixed(1)} t/ga)</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="text-muted text-small">Holat</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: getHealthColor() }}>
                                    {yieldHealth.toFixed(0)}%
                                </div>
                                <div style={{
                                    height: '4px',
                                    background: '#e5e7eb',
                                    borderRadius: '2px',
                                    marginTop: '0.25rem',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${yieldHealth}% `,
                                        height: '100%',
                                        background: getHealthColor(),
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {crop.expenseAmount && parseFloat(crop.expenseAmount) > 0 && (
                    <div style={styles.info}>
                        <span className="text-muted">Ekish xarajati:</span>
                        <span style={{ color: '#ef4444', fontWeight: '600' }}>
                            {parseFloat(crop.expenseAmount).toLocaleString()} so'm
                        </span>
                    </div>
                )}

                {/* Yield Impact Warnings */}
                {warnings.length > 0 && (
                    <div style={{ marginTop: '0.75rem' }}>
                        {warnings.map((warning, index) => (
                            <div
                                key={index}
                                className={warning.severity === 'high' ? 'alert alert-danger' : 'alert alert-warning'}
                                style={{ marginTop: index > 0 ? '0.5rem' : 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {getWarningIcon(warning.type)}
                                {warning.message}
                            </div>
                        ))}
                    </div>
                )}

                {/* Original irrigation/fertilizer reminders with action buttons */}
                {needsIrrigation && warnings.filter(w => w.type === 'irrigation').length === 0 && (
                    <div className="alert alert-info mt-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Droplets size={16} /> {t('crops.irrigationTime')}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button onClick={handleIrrigate} className="btn btn-sm btn-primary flex-grow">
                                {t('crops.irrigated')}
                            </button>
                            <button onClick={handlePostponeIrrigation} className="btn btn-sm btn-outline flex-grow">
                                {t('crops.postpone')}
                            </button>
                        </div>
                    </div>
                )}
                {needsFertilizer && warnings.filter(w => w.type === 'fertilizer').length === 0 && (
                    <div className="alert alert-warning mt-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Beaker size={16} /> {t('crops.fertilizerTime')}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button onClick={handleFertilize} className="btn btn-sm btn-primary flex-grow">
                                {t('crops.fertilized')}
                            </button>
                            <button onClick={handlePostponeFertilizer} className="btn btn-sm btn-outline flex-grow">
                                {t('crops.postpone')}
                            </button>
                        </div>
                    </div>
                )}

                {crop.notes && (
                    <div className="text-muted text-small mt-sm" style={{ display: 'flex', gap: '0.5rem' }}>
                        <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>Izoh: {crop.notes}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    info: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid var(--border)'
    },
    yieldSection: {
        marginTop: '1rem',
        padding: '1rem',
        background: 'var(--bg-page)',
        borderRadius: '8px',
        borderLeft: '4px solid',
        border: '1px solid var(--border)',
        borderLeftWidth: '4px'
    },
    yieldHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem'
    },
    yieldData: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
    }
};

export default Crops;
