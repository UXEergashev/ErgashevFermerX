import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import {
    Sprout,
    BarChart3,
    Map as MapIcon,
    Wallet,
    Package,
    TrendingUp,
    Shield,
    Smartphone,
    Check
} from 'lucide-react';

const LandingPage = () => {
    const { t } = useLanguage();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const features = [
        {
            icon: <BarChart3 size={32} />,
            titleKey: 'landing.features.analytics',
            descKey: 'landing.features.analyticsDesc',
            color: '#10b981'
        },
        {
            icon: <Sprout size={32} />,
            titleKey: 'landing.features.crops',
            descKey: 'landing.features.cropsDesc',
            color: '#059669'
        },
        {
            icon: <MapIcon size={32} />,
            titleKey: 'landing.features.land',
            descKey: 'landing.features.landDesc',
            color: '#14b8a6'
        },
        {
            icon: <Wallet size={32} />,
            titleKey: 'landing.features.finance',
            descKey: 'landing.features.financeDesc',
            color: '#3b82f6'
        },
        {
            icon: <Package size={32} />,
            titleKey: 'landing.features.warehouse',
            descKey: 'landing.features.warehouseDesc',
            color: '#8b5cf6'
        },
        {
            icon: <Smartphone size={32} />,
            titleKey: 'landing.features.mobile',
            descKey: 'landing.features.mobileDesc',
            color: '#ec4899'
        }
    ];

    const benefits = [
        'landing.benefits.realtime',
        'landing.benefits.multilang',
        'landing.benefits.offline',
        'landing.benefits.analytics',
        'landing.benefits.reports',
        'landing.benefits.secure'
    ];

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.logo}>
                        <img src="/favicon.png" alt="FermerX" style={styles.logoImage} />
                        <span style={styles.logoText}>FermerX</span>
                    </div>
                    <div style={styles.headerRight}>
                        <LanguageSelector />
                        <Link to="/login" style={styles.loginLink}>{t('auth.login')}</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={{
                    ...styles.heroContent,
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? '2rem' : '4rem',
                    padding: isMobile ? '3rem 1rem' : '0'
                }}>
                    <div style={styles.heroText}>
                        <h1 style={{
                            ...styles.heroTitle,
                            fontSize: isMobile ? '2rem' : '3.5rem'
                        }}>{t('landing.hero.title')}</h1>
                        <p style={styles.heroSubtitle}>{t('landing.hero.subtitle')}</p>
                        <div style={{
                            ...styles.heroCta,
                            flexDirection: isMobile ? 'column' : 'row'
                        }}>
                            <Link to="/register" className="btn btn-primary" style={styles.ctaButton}>
                                {t('landing.hero.getStarted')}
                            </Link>
                            <Link to="/login" className="btn btn-outline" style={styles.ctaButtonSecondary}>
                                {t('auth.login')}
                            </Link>
                        </div>
                    </div>
                    {!isMobile && (
                        <div style={styles.heroImage}>
                            <div style={styles.heroImagePlaceholder}>
                                <Sprout size={120} color="#10b981" />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section style={styles.featuresSection}>
                <div style={styles.sectionContent}>
                    <h2 style={styles.sectionTitle}>{t('landing.features.title')}</h2>
                    <p style={styles.sectionSubtitle}>{t('landing.features.subtitle')}</p>
                    <div style={{
                        ...styles.featuresGrid,
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)'
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={styles.featureCard}>
                                <div style={{ ...styles.featureIcon, background: `${feature.color}15`, color: feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3 style={styles.featureTitle}>{t(feature.titleKey)}</h3>
                                <p style={styles.featureDesc}>{t(feature.descKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={styles.benefitsSection}>
                <div style={styles.sectionContent}>
                    <h2 style={styles.sectionTitle}>{t('landing.benefits.title')}</h2>
                    <div style={{
                        ...styles.benefitsGrid,
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)'
                    }}>
                        {benefits.map((benefit, index) => (
                            <div key={index} style={styles.benefitItem}>
                                <div style={styles.checkIcon}>
                                    <Check size={20} />
                                </div>
                                <span style={styles.benefitText}>{t(benefit)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.ctaSection}>
                <div style={styles.ctaContent}>
                    <h2 style={styles.ctaTitle}>{t('landing.cta.title')}</h2>
                    <p style={styles.ctaSubtitle}>{t('landing.cta.subtitle')}</p>
                    <Link to="/register" className="btn btn-primary" style={styles.ctaButton}>
                        {t('landing.cta.button')}
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <div style={styles.footerBrand}>
                        <img src="/favicon.png" alt="FermerX" style={styles.footerLogo} />
                        <span style={styles.footerText}>FermerX</span>
                    </div>
                    <p style={styles.footerCopy}>© 2026 FermerX. {t('landing.footer.rights')}</p>
                </div>
            </footer>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'var(--bg-page)',
        color: 'var(--text-main)'
    },
    header: {
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(var(--bg-card-rgb), 0.9)'
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    logoImage: {
        width: '40px',
        height: '40px',
        borderRadius: '10px'
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    loginLink: {
        color: 'var(--primary)',
        textDecoration: 'none',
        fontWeight: '600',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        transition: 'all 0.2s'
    },
    hero: {
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
        padding: '6rem 2rem',
        borderBottom: '1px solid var(--border)'
    },
    heroContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center'
    },
    heroText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    heroTitle: {
        fontSize: '3.5rem',
        fontWeight: '800',
        lineHeight: '1.1',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    heroSubtitle: {
        fontSize: '1.25rem',
        color: 'var(--text-muted)',
        lineHeight: '1.6'
    },
    heroCta: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem'
    },
    ctaButton: {
        padding: '1rem 2rem',
        fontSize: '1.125rem',
        textDecoration: 'none',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
    },
    ctaButtonSecondary: {
        padding: '1rem 2rem',
        fontSize: '1.125rem',
        textDecoration: 'none',
        borderRadius: '0.75rem'
    },
    heroImage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    heroImagePlaceholder: {
        width: '400px',
        height: '400px',
        borderRadius: '2rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid rgba(16, 185, 129, 0.2)',
        animation: 'float 3s ease-in-out infinite'
    },
    featuresSection: {
        padding: '6rem 2rem',
        background: 'var(--bg-page)'
    },
    sectionContent: {
        maxWidth: '1200px',
        margin: '0 auto'
    },
    sectionTitle: {
        fontSize: '2.5rem',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '1rem',
        color: 'var(--text-main)'
    },
    sectionSubtitle: {
        fontSize: '1.125rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        marginBottom: '4rem'
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem'
    },
    featureCard: {
        background: 'var(--bg-card)',
        padding: '2.5rem',
        borderRadius: '1.5rem',
        border: '1px solid var(--border)',
        transition: 'all 0.3s',
        cursor: 'pointer'
    },
    featureIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1.5rem'
    },
    featureTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '0.75rem',
        color: 'var(--text-main)'
    },
    featureDesc: {
        color: 'var(--text-muted)',
        lineHeight: '1.6'
    },
    benefitsSection: {
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
    },
    benefitsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
        maxWidth: '800px',
        margin: '0 auto'
    },
    benefitItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: '1rem',
        border: '1px solid var(--border)'
    },
    checkIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0
    },
    benefitText: {
        color: 'var(--text-main)',
        fontWeight: '500'
    },
    ctaSection: {
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white'
    },
    ctaContent: {
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
    },
    ctaTitle: {
        fontSize: '2.5rem',
        fontWeight: '700',
        marginBottom: '1rem'
    },
    ctaSubtitle: {
        fontSize: '1.25rem',
        marginBottom: '2rem',
        opacity: 0.9
    },
    footer: {
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        padding: '2rem'
    },
    footerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    footerBrand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    footerLogo: {
        width: '32px',
        height: '32px',
        borderRadius: '8px'
    },
    footerText: {
        fontWeight: '600',
        color: 'var(--text-main)'
    },
    footerCopy: {
        color: 'var(--text-muted)',
        fontSize: '0.875rem'
    }
};

export default LandingPage;
