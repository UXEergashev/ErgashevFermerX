import React, { useState } from 'react';
import { update, add } from '../db/operations';
import { initDB, getDB } from '../db/database';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Modal from './Modal';

const WarehouseActionModal = ({ item, actionType, onClose, onComplete }) => {
    const { user } = useAuth();
    const { t } = useLanguage();

    // unit ni aniqlaymiz (tonna uchun kg hisobiga o'tkazish)
    const isTon = item.unit === 'tonna' || item.unit === 'тонна';
    const displayUnit = isTon ? 'kg' : item.unit;
    const quantityInKg = isTon ? item.quantity * 1000 : item.quantity;

    const [formData, setFormData] = useState({
        quantity: '',       // kg (yoki birlik)
        pricePerKg: '',     // narx 1 kg uchun
        buyerName: '',      // xaridor ismi
        buyerPhone: '',     // xaridor telefoni
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const soldQtyKg = parseFloat(formData.quantity) || 0;
    const pricePerKg = parseFloat(formData.pricePerKg) || 0;
    const totalIncome = soldQtyKg * pricePerKg;

    // Ombordagi miqdorni kg ga o'tkazish
    const availableKg = isTon ? item.quantity * 1000 : item.quantity;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!soldQtyKg || soldQtyKg <= 0) {
            setError(t('auth.fillAllFields') + ' (miqdor)');
            return;
        }

        if (actionType === 'sell') {
            if (soldQtyKg > availableKg) {
                setError(`Omborda faqat ${availableKg.toFixed(1)} ${displayUnit} mavjud`);
                return;
            }
            if (!pricePerKg || pricePerKg <= 0) {
                setError('Narxni kiriting (1 kg uchun)');
                return;
            }
        }

        setLoading(true);
        try {
            if (actionType === 'add') {
                // Qo'shish: kg → tonnaga o'tkazamiz
                const addQty = isTon ? soldQtyKg / 1000 : soldQtyKg;
                const newQuantity = item.quantity + addQty;
                await update('warehouse', { ...item, quantity: newQuantity });

                await add('warehouseHistory', {
                    userId: user.id,
                    itemId: item.id,
                    itemName: item.name,
                    itemCategory: item.category,
                    action: 'add',
                    quantityKg: soldQtyKg,
                    quantity: addQty,
                    unit: item.unit,
                    date: formData.date,
                    notes: formData.notes
                });

            } else {
                // Sotish
                const soldQtyUnit = isTon ? soldQtyKg / 1000 : soldQtyKg;
                const newQuantity = item.quantity - soldQtyUnit;
                await update('warehouse', { ...item, quantity: Math.max(0, newQuantity) });

                // Daromad yozuvi
                await add('income', {
                    userId: user.id,
                    date: formData.date,
                    source: `${item.name} sotuvi`,
                    type: 'Sotuv',
                    amount: totalIncome,
                    notes: `💰 ${soldQtyKg} kg × ${pricePerKg.toLocaleString()} so'm/kg = ${totalIncome.toLocaleString()} so'm${formData.buyerName ? ' | Xaridor: ' + formData.buyerName : ''}`,
                    autoCreated: true
                });

                // warehouseHistory ga yozish
                await add('warehouseHistory', {
                    userId: user.id,
                    itemId: item.id,
                    itemName: item.name,
                    itemCategory: item.category,
                    action: 'sell',
                    type: 'sale',
                    quantityKg: soldQtyKg,
                    quantity: soldQtyUnit,
                    unit: item.unit,
                    pricePerKg: pricePerKg,
                    totalPrice: totalIncome,
                    date: formData.date,
                    notes: formData.notes
                });

                // soldItems arxiviga to'liq ma'lumot bilan saqlash
                await initDB(); // DB versiyasini yangilash
                const db = await getDB();
                await db.add('soldItems', {
                    userId: user.id,
                    // Mahsulot
                    warehouseItemId: item.id,
                    itemName: item.name,
                    itemCategory: item.category,
                    itemUnit: item.unit,
                    // Sotuv ma'lumotlari
                    soldDate: formData.date,
                    quantityKg: soldQtyKg,
                    quantityTon: soldQtyUnit,
                    pricePerKg: pricePerKg,
                    pricePerTon: pricePerKg * 1000,
                    totalIncome: totalIncome,
                    // Xaridor
                    buyerName: formData.buyerName || '',
                    buyerPhone: formData.buyerPhone || '',
                    // Qo'shimcha
                    notes: formData.notes || '',
                    // Ombor holati sotuv oldidan
                    stockBefore: item.quantity,
                    stockAfter: Math.max(0, newQuantity),
                    stockBeforeKg: availableKg,
                    stockAfterKg: Math.max(0, availableKg - soldQtyKg),
                    // Arxiv vaqti
                    savedAt: new Date().toISOString()
                });
            }

            onComplete();
            onClose();
        } catch (err) {
            setError('Xatolik yuz berdi: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={actionType === 'add' ? '📦 Mahsulot qo\'shish' : '💰 Mahsulot sotish'}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger mb-md">{error}</div>}

                {/* Joriy holat */}
                <div className="alert alert-info mb-md">
                    <strong>🏪 {item.name}</strong>
                    <span className="badge badge-primary" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>{item.category}</span>
                    <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                        {t('warehouse.currentStock')}: <strong>{item.quantity} {item.unit}</strong>
                        {isTon && <span className="text-muted"> ({availableKg.toFixed(0)} kg)</span>}
                    </div>
                </div>

                {/* Miqdor */}
                <div className="form-group">
                    <label className="form-label">
                        📦 {actionType === 'sell' ? 'Sotiladigan' : 'Qo\'shiladigan'} miqdor ({displayUnit}) *
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        className="form-input"
                        value={formData.quantity}
                        onChange={handleChange}
                        step={isTon ? '0.5' : '0.01'}
                        min="0"
                        max={actionType === 'sell' ? availableKg : undefined}
                        placeholder="0"
                        autoFocus
                        style={{ fontSize: '1.1rem' }}
                    />
                    {isTon && soldQtyKg > 0 && (
                        <small className="text-muted">= {(soldQtyKg / 1000).toFixed(3)} tonna</small>
                    )}
                </div>

                {/* Narx — faqat sotishda */}
                {actionType === 'sell' && (
                    <>
                        <div className="form-group">
                            <label className="form-label">💵 Narx (1 kg uchun, so'm) *</label>
                            <input
                                type="number"
                                name="pricePerKg"
                                className="form-input"
                                value={formData.pricePerKg}
                                onChange={handleChange}
                                min="0"
                                step="10"
                                placeholder="0"
                                style={{ fontSize: '1.1rem' }}
                            />
                            {pricePerKg > 0 && isTon && (
                                <small className="text-muted">
                                    = {(pricePerKg * 1000).toLocaleString()} so'm/tonna
                                </small>
                            )}
                        </div>

                        {/* Jami TO'LOV — real-time */}
                        {soldQtyKg > 0 && pricePerKg > 0 && (
                            <div style={{
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                                border: '2px solid #10b981',
                                borderRadius: '10px',
                                marginBottom: '1rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.8rem', color: '#166534', marginBottom: '4px' }}>💰 Jami to'lov</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#15803d' }}>
                                    {totalIncome.toLocaleString()} so'm
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '4px' }}>
                                    {soldQtyKg} kg × {pricePerKg.toLocaleString()} so'm/kg
                                </div>
                            </div>
                        )}

                        {/* Xaridor ma'lumotlari */}
                        <div style={{
                            padding: '0.75rem',
                            background: 'var(--bg-page)',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                                👤 Xaridor ma'lumotlari (ixtiyoriy)
                            </div>
                            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                                <input
                                    type="text"
                                    name="buyerName"
                                    className="form-input"
                                    value={formData.buyerName}
                                    onChange={handleChange}
                                    placeholder="Xaridor ismi"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <input
                                    type="text"
                                    name="buyerPhone"
                                    className="form-input"
                                    value={formData.buyerPhone}
                                    onChange={handleChange}
                                    placeholder="Telefon raqami"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Sana */}
                <div className="form-group">
                    <label className="form-label">📅 Sana *</label>
                    <input
                        type="date"
                        name="date"
                        className="form-input"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>

                {/* Izoh */}
                <div className="form-group">
                    <label className="form-label">📝 Izoh</label>
                    <textarea
                        name="notes"
                        className="form-textarea"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Qo'shimcha ma'lumot..."
                        rows={2}
                    />
                </div>

                {/* Nima bo'ladi (faqat sotishda) */}
                {actionType === 'sell' && soldQtyKg > 0 && pricePerKg > 0 && (
                    <div style={{
                        fontSize: '0.8rem', color: 'var(--text-muted)',
                        padding: '0.5rem 0.75rem',
                        background: 'var(--bg-page)',
                        borderRadius: '6px',
                        marginBottom: '1rem'
                    }}>
                        <strong style={{ color: 'var(--text-main)' }}>Tasdiqlasangiz:</strong>
                        <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1.2rem', lineHeight: '1.7' }}>
                            <li>📦 Ombordan <strong>{soldQtyKg} kg</strong> ayiriladi</li>
                            <li>💰 Daromad: <strong>{totalIncome.toLocaleString()} so'm</strong></li>
                            <li>🗂️ "Sotilgan mahsulotlar" arxiviga saqlanadi</li>
                        </ul>
                    </div>
                )}

                <div className="modal-footer">
                    <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
                        Bekor qilish
                    </button>
                    <button
                        type="submit"
                        className={`btn ${actionType === 'sell' ? 'btn-secondary' : 'btn-primary'}`}
                        disabled={loading}
                        style={actionType === 'sell' ? { background: '#10b981', color: 'white' } : {}}
                    >
                        {loading ? 'Saqlanmoqda...' : actionType === 'sell'
                            ? `✅ Sotildi — ${totalIncome > 0 ? totalIncome.toLocaleString() + ' so\'m' : '...'}`
                            : '📦 Qo\'shish'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default WarehouseActionModal;
