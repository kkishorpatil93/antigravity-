import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ScanLine,
  FlaskConical,
  Droplets,
  MessageSquareText,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/common/Button';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-16">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-100 text-agri-900 text-xs font-semibold mb-6 border border-agri-200 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-agri-700" />
          <span>{t.common.karnatakaFocus}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-agri-950 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight mb-6">
          {t.landing.heroTitle}
        </h1>

        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          {t.landing.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              {t.landing.startTrialBtn}
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg">
              {t.landing.exploreFeaturesBtn}
            </Button>
          </a>
        </div>

        {/* Hero Banner Visual Metrics */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-white border border-earth-100 shadow-2xs">
            <span className="text-2xl font-bold text-agri-700 block">30+</span>
            <span className="text-xs text-gray-500 font-medium">Karnataka Districts Supported</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-earth-100 shadow-2xs">
            <span className="text-2xl font-bold text-agri-700 block">95%+</span>
            <span className="text-xs text-gray-500 font-medium">IPM Pathology Matching</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-earth-100 shadow-2xs">
            <span className="text-2xl font-bold text-agri-700 block">25%</span>
            <span className="text-xs text-gray-500 font-medium">Avg Water & Fertilizer Saved</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-earth-100 shadow-2xs">
            <span className="text-2xl font-bold text-agri-700 block">100%</span>
            <span className="text-xs text-gray-500 font-medium">Kannada & English Native</span>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-agri-950 mb-3">
            {t.landing.featuresTitle}
          </h2>
          <p className="text-xs sm:text-base text-gray-600">
            Backed by modern agronomy research and Google Gemini multimodal generative models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white border border-earth-100 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-agri-950 mb-2">
              {t.landing.feature1Title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t.landing.feature1Desc}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white border border-earth-100 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <ScanLine className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-agri-950 mb-2">
              {t.landing.feature2Title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t.landing.feature2Desc}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white border border-earth-100 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-agri-950 mb-2">
              {t.landing.feature3Title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t.landing.feature3Desc}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white border border-earth-100 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-agri-950 mb-2">
              {t.landing.feature4Title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t.landing.feature4Desc}
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-white border border-earth-100 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-agri-100 text-agri-900 flex items-center justify-center mb-4">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-agri-950 mb-2">
              {t.landing.feature5Title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t.landing.feature5Desc}
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-white border border-earth-100 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-agri-950 mb-2">
              IPM Safety First
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Prioritizes organic and cultural methods. Strictly adheres to safe chemical withholding days and PPE protocols.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-agri-900 text-white p-8 sm:p-12 text-center shadow-lg relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Empower Your Farm with Precision AI Today
          </h2>
          <p className="text-agri-200 text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Register your land details in under 2 minutes and begin receiving tailored agronomic advisories.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-agri-950 hover:bg-cream-100 shadow-md">
              Create Free Account &rarr;
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

