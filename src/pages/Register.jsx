import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser, getUserByPhone } from '../db/operations';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError(t('auth.fillAllFields'));
            return false;
        }

        if (!formData.phone.trim()) {
            setError(t('auth.fillAllFields'));
            return false;
        }

        // Basic phone validation (Uzbekistan format)
        const phoneRegex = /^\+?998?[0-9]{9}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            setError(t('auth.fillAllFields'));
            return false;
        }

        if (formData.password.length < 6) {
            setError(t('auth.fillAllFields'));
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.passwordMismatch'));
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Check if user already exists
            const existingUser = await getUserByPhone(formData.phone);
            if (existingUser) {
                setError(t('auth.phoneExists'));
                setLoading(false);
                return;
            }

            // Create new user
            await createUser({
                name: formData.name,
                phone: formData.phone,
                password: formData.password
            });

            // Auto-login after registration
            await login(formData.phone, formData.password);
            navigate('/');
        } catch (err) {
            setError(t('auth.fillAllFields'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.decorativeCircle1}></div>
            <div style={styles.decorativeCircle2}></div>

            <div style={styles.langSelector}>
                <LanguageSelector />
            </div>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoWrapper}>
                        <img src="/favicon.png" alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '16px' }} />
                    </div>
                    <h1 style={styles.title}>FermerX</h1>
                    <p style={styles.subtitle}>{t('auth.register')}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">{t('auth.name')}</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t('auth.namePlaceholder')}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('auth.phone')}</label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={t('auth.phonePlaceholder')}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('auth.password')}</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={t('auth.passwordPlaceholder')}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('auth.confirmPassword')}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder={t('auth.passwordPlaceholder')}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? t('auth.waiting') : t('auth.register')}
                    </button>

                    <p style={styles.footer}>
                        {t('auth.hasAccount')}{' '}
                        <Link to="/login" style={styles.link}>{t('auth.login')}</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)',
        position: 'relative',
        overflow: 'hidden'
    },
    langSelector: {
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 10
    },
    decorativeCircle1: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        top: '-100px',
        left: '-100px',
        animation: 'float 6s ease-in-out infinite'
    },
    decorativeCircle2: {
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        bottom: '-50px',
        right: '-50px',
        animation: 'float 8s ease-in-out infinite reverse'
    },
    card: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '2rem',
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'relative',
        zIndex: 1,
        animation: 'slideIn 0.5s ease-out'
    },
    header: {
        textAlign: 'center',
        marginBottom: '2.5rem'
    },
    logoWrapper: {
        display: 'inline-block',
        padding: '0.5rem',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 8px 16px rgba(16, 185, 129, 0.4)'
    },
    title: {
        fontSize: '2.75rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '0.75rem',
        letterSpacing: '-2px'
    },
    subtitle: {
        color: '#6b7280',
        fontSize: '1.125rem',
        fontWeight: '500'
    },
    footer: {
        textAlign: 'center',
        marginTop: '2rem',
        color: '#6b7280',
        fontSize: '0.9375rem'
    },
    link: {
        color: '#10b981',
        fontWeight: '700',
        textDecoration: 'none',
        transition: 'all 0.2s',
        borderBottom: '2px solid transparent'
    }
};

export default Register;

