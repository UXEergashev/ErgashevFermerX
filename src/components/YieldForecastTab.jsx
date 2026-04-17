import React, { useState, useRef } from 'react';
import { Camera, ImagePlus, Activity, CloudSun, Droplets, Leaf, FlaskConical, ThumbsUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const YieldForecastTab = () => {
    const { t } = useLanguage();
    const fileInputRef = useRef(null);

    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [imageMimeType, setImageMimeType] = useState('image/jpeg');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');

    // Sensor mock values for testing, or user inputs
    const [sensors, setSensors] = useState({
        n: 42,
        p: 28,
        k: 35,
        ph: 6.8,
        moisture: 62,
        irrigation: "Normada",
        fertilizer: "Yetarli"
    });

    const API_KEY = "AIzaSyCkwrujfZQLRKK7kbFuQpqvsEt0jPq29hM";

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setImagePreview(base64String);
            setImageBase64(base64String.split(',')[1]); 
            setImageMimeType(file.type || 'image/jpeg');
            setAnalysisResult('');
        };
        reader.readAsDataURL(file);
    };

    const triggerUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.removeAttribute('capture');
            fileInputRef.current.click();
        }
    };

    const triggerCamera = () => {
        if (fileInputRef.current) {
            fileInputRef.current.setAttribute('capture', 'environment');
            fileInputRef.current.click();
        }
    };

    const analyzeYield = async () => {
        if (!imageBase64) return;
        setIsAnalyzing(true);
        setAnalysisResult('');

        const promptText = `Sen tajribali agronom va qishloq xo'jaligi bo'yicha sun'iy intellektsan.
Menga quyidagi ko'rsatkichlarga asoslanib fotosuratdagi ekin/o'simlik bo'yicha hosildorlikni oshirish uchun batafsil pragnoz va keng qamrovli maslahat ber.

Sensor ko'rsatkichlari:
- N (Azot): ${sensors.n}
- P (Fosfor): ${sensors.p}
- K (Kaliy): ${sensors.k}
- Tuproq pH darajasi: ${sensors.ph}
- Tuproq namligi: ${sensors.moisture}%
- Sug'orish holati: ${sensors.irrigation}
- O'g'itlash holati: ${sensors.fertilizer}

Agar fotosuratda kasallik yoki zararkunanda alomatlari bo'lsa, uni aniqla va hosilni saqlab qolish uchun yechimlar ber. 
Aynan ushbu omillarni o'zaro bog'liqligini hisobga olgan holda hosildorlikni maksimallashtirish uchun aniq va amaliy tavsiyalar yoz. Javobing strukturaviy, tushunarli va chiroyli formatda bo'lsin.`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                { text: promptText },
                                {
                                    inlineData: {
                                        mimeType: imageMimeType,
                                        data: imageBase64
                                    }
                                }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error("Gemini API xatosi:", data);
                setAnalysisResult(`Server xatosi: ${data?.error?.message || response.statusText}`);
                return;
            }

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                setAnalysisResult(data.candidates[0].content.parts[0].text);
            } else {
                setAnalysisResult("Kechirasiz, tahlil qilishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
            }
        } catch (error) {
            console.error(error);
            setAnalysisResult("Kechirasiz, server bilan ulanishda xatolik yuz berdi.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <div className="card mb-lg" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div className="icon-container icon-success" style={{ padding: '1rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
                        <ImagePlus size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        Rasm yuklash
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>O'simlik yoki xosilning aniq rasmini yuklang</p>
                </div>

                {imagePreview ? (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '300px', 
                                borderRadius: '12px', 
                                border: '2px solid var(--border)',
                                objectFit: 'cover'
                            }} 
                        />
                        <div style={{ marginTop: '1rem' }}>
                            <button className="btn btn-outline" onClick={() => { setImagePreview(null); setImageBase64(null); setAnalysisResult(''); }} style={{ marginRight: '0.5rem' }}>
                                Bekor qilish
                            </button>
                            <button className="btn btn-primary" onClick={analyzeYield} disabled={isAnalyzing}>
                                {isAnalyzing ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            style={{ display: 'none' }} 
                        />
                        <button 
                            className="btn btn-outline" 
                            onClick={triggerUpload}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px' }}
                        >
                            <ImagePlus size={20} />
                            Galereyadan yuklash
                        </button>
                        <button 
                            className="btn btn-success" 
                            onClick={triggerCamera}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px' }}
                        >
                            <Camera size={20} />
                            Suratga olish
                        </button>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '1rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={16} />
                Sensor Ko'rsatkichlari
            </div>

            <div className="grid grid-3 mb-lg" style={{ gap: '1rem' }}>
                {/* NPK Tab */}
                <div className="card" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: '#10b981', color: 'white', padding: '8px', borderRadius: '8px' }}>
                                <FlaskConical size={20} />
                            </div>
                            <span style={{ fontWeight: '600', color: '#065f46' }}>NPK Tahlil</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', background: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: '12px' }}>
                            N:{sensors.n} · P:{sensors.p} · K:{sensors.k}
                        </div>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#065f46', marginBottom: '0.2rem' }}>
                            <span>N</span><span>P</span><span>K</span>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
                            <div style={{ flex: sensors.n, background: '#10b981', borderRadius: '3px' }}></div>
                            <div style={{ flex: sensors.p, background: '#10b981', borderRadius: '3px' }}></div>
                            <div style={{ flex: sensors.k, background: '#10b981', borderRadius: '3px' }}></div>
                        </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ThumbsUp size={14} /> Azot, Fosfor, Kaliy — normal
                    </div>
                </div>

                {/* pH Tab */}
                <div className="card" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: '#3b82f6', color: 'white', padding: '8px', borderRadius: '8px' }}>
                                <Activity size={20} />
                            </div>
                            <span style={{ fontWeight: '600', color: '#1e3a8a' }}>pH Tahlil</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1d4ed8' }}>
                            pH {sensors.ph}
                        </div>
                    </div>
                    <div style={{ position: 'relative', height: '8px', background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 30%, #10b981 50%, #3b82f6 70%, #8b5cf6 100%)', borderRadius: '4px', marginBottom: '0.5rem' }}>
                        <div style={{ position: 'absolute', top: '-4px', left: `${(sensors.ph / 14) * 100}%`, width: '16px', height: '16px', background: 'white', borderRadius: '50%', border: '2px solid #3b82f6', transform: 'translateX(-50%)' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#1e3a8a', marginBottom: '0.5rem' }}>
                        <span>Kislotali</span><span>Neytral</span><span>Ishqoriy</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ThumbsUp size={14} /> Tuproq pH ko'rsatkichi maqbul
                    </div>
                </div>

                {/* Namlik Tab */}
                <div className="card" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: '#f59e0b', color: 'white', padding: '8px', borderRadius: '8px' }}>
                                <Droplets size={20} />
                            </div>
                            <span style={{ fontWeight: '600', color: '#92400e' }}>Tuproq Namligi</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '12px' }}>
                            {sensors.moisture}%
                        </div>
                    </div>
                    <div style={{ height: '8px', background: '#fde68a', borderRadius: '4px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                        <div style={{ width: `${sensors.moisture}%`, height: '100%', background: '#f59e0b' }}></div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CloudSun size={14} /> Namlik biroz past — sug'orish tavsiya etiladi
                    </div>
                </div>
            </div>

            {/* Analysis Result */}
            {isAnalyzing && (
                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
                    <h3 style={{ color: 'var(--text-main)' }}>AI tahlil qilmoqda...</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Bu bir necha soniya vaqt oladi. Iltimos kuting!</p>
                </div>
            )}

            {analysisResult && !isAnalyzing && (
                <div className="card" style={{ padding: '1.5rem', border: '1px solid #10b981', borderTop: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Leaf size={24} color="#10b981" />
                        <h3 style={{ margin: 0, color: '#064e3b' }}>Gemini Hosildorlik Pragnozi va Maslahatlar</h3>
                    </div>
                    <div 
                        style={{ lineHeight: '1.6', color: 'var(--text-main)', fontSize: '0.95rem' }} 
                        dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} 
                    />
                </div>
            )}

        </div>
    );
};

export default YieldForecastTab;
