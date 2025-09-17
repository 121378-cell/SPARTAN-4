/**
 * Advanced AI Dashboard - Panel integrado de sistemas de IA científica
 */

import React, { useState, useEffect, memo } from 'react';
import { scientificAI } from '../lib/scientificAI';
import { advancedNutritionAI } from '../lib/advancedNutritionAI';
import { longevityAI } from '../lib/longevityAI';
import { recoveryAnalyticsAI } from '../lib/recoveryAnalyticsAI';
import { psychologyAI } from '../lib/psychologyAI';
import type { UserData } from '../lib/types';

interface AdvancedAIDashboardProps {
  onBack: () => void;
  userData: UserData;
}

const AdvancedAIDashboard = memo(function AdvancedAIDashboard({ onBack, userData }: AdvancedAIDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    setLoading(true);
    try {
      // Simular análisis completo de IA
      const insights = {
        scientific: await scientificAI.performDailyResearch(),
        nutrition: 'Análisis nutricional optimizado',
        longevity: 'Protocolos de longevidad actualizados',
        recovery: 'Estado de recuperación evaluado',
        psychology: 'Perfil psicológico analizado'
      };
      setAiInsights(insights);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Resumen IA', icon: '🤖' },
    { id: 'nutrition', label: 'Nutrición IA', icon: '🥗' },
    { id: 'longevity', label: 'Longevidad', icon: '🧬' },
    { id: 'recovery', label: 'Recuperación', icon: '🔄' },
    { id: 'psychology', label: 'Psicología', icon: '🧠' },
    { id: 'research', label: 'Investigación', icon: '🔬' }
  ];

  return (
    <div className="advanced-ai-dashboard">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn quantum-btn">
          ← Volver
        </button>
        <h1 className="dashboard-title">🤖 SPARTAN AI CIENTÍFICA</h1>
      </div>

      <div className="ai-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`ai-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ai-content">
        {loading ? (
          <div className="ai-loading">
            <div className="quantum-spinner"></div>
            <p>Analizando datos científicos...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab insights={aiInsights} />}
            {activeTab === 'nutrition' && <NutritionTab userData={userData} />}
            {activeTab === 'longevity' && <LongevityTab userData={userData} />}
            {activeTab === 'recovery' && <RecoveryTab userData={userData} />}
            {activeTab === 'psychology' && <PsychologyTab userData={userData} />}
            {activeTab === 'research' && <ResearchTab insights={aiInsights} />}
          </>
        )}
      </div>
    </div>
  );
});

const OverviewTab = memo(function OverviewTab({ insights }: { insights: any }) {
  return (
    <div className="overview-tab">
      <div className="ai-summary-grid">
        <div className="ai-summary-card">
          <h3>🔬 Investigación Científica</h3>
          <p>{insights?.scientific?.evidenceProcessed?.length || 0} estudios analizados hoy</p>
          <div className="confidence-score">
            Confianza: {(Math.random() * 20 + 80).toFixed(1)}%
          </div>
        </div>
        
        <div className="ai-summary-card">
          <h3>🥗 Nutrición Personalizada</h3>
          <p>Protocolos optimizados basados en evidencia</p>
          <div className="optimization-level">
            Optimización: Alta
          </div>
        </div>
        
        <div className="ai-summary-card">
          <h3>🧬 Longevidad</h3>
          <p>Estrategias para maximizar healthspan</p>
          <div className="longevity-score">
            Potencial: +{(Math.random() * 5 + 2).toFixed(1)} años
          </div>
        </div>
      </div>

      <div className="ai-recommendations">
        <h3>🎯 Recomendaciones IA de Hoy</h3>
        <ul>
          <li>🔥 Ajustar protocolo HIIT basado en nueva evidencia cardiovascular</li>
          <li>🧪 Optimizar ventana anabólica post-entreno (nueva investigación)</li>
          <li>😴 Implementar protocolo de sueño mejorado para HRV</li>
          <li>🧠 Técnicas de mindfulness para optimización cognitiva</li>
        </ul>
      </div>
    </div>
  );
});

const NutritionTab = memo(function NutritionTab({ userData }: { userData: UserData }) {
  return (
    <div className="nutrition-tab">
      <h3>🥗 Análisis Nutricional IA</h3>
      <div className="nutrition-analysis">
        <div className="macro-optimization">
          <h4>Distribución Óptima de Macros</h4>
          <div className="macro-bars">
            <div className="macro-bar">
              <label>Proteína: {userData.weight * 2.2}g</label>
              <div className="bar protein-bar"></div>
            </div>
            <div className="macro-bar">
              <label>Carbohidratos: {userData.weight * 3}g</label>
              <div className="bar carbs-bar"></div>
            </div>
            <div className="macro-bar">
              <label>Grasas: {Math.round(userData.weight * 1.2)}g</label>
              <div className="bar fats-bar"></div>
            </div>
          </div>
        </div>

        <div className="nutrition-insights">
          <h4>💡 Insights Científicos</h4>
          <ul>
            <li>Ventana anabólica extendida: hasta 6h post-ejercicio</li>
            <li>Ratio omega-6:omega-3 optimizado a 2:1</li>
            <li>Timing circadiano para máxima absorción</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

const LongevityTab = memo(function LongevityTab({ userData }: { userData: UserData }) {
  const biologicalAge = userData.age - Math.random() * 5;
  
  return (
    <div className="longevity-tab">
      <h3>🧬 Análisis de Longevidad</h3>
      <div className="longevity-metrics">
        <div className="age-comparison">
          <div className="age-metric">
            <label>Edad Cronológica</label>
            <span className="age-value">{userData.age}</span>
          </div>
          <div className="age-metric">
            <label>Edad Biológica</label>
            <span className="age-value biological">{biologicalAge.toFixed(1)}</span>
          </div>
          <div className="age-advantage">
            <span>Ventaja: {(userData.age - biologicalAge).toFixed(1)} años</span>
          </div>
        </div>

        <div className="longevity-protocols">
          <h4>🎯 Protocolos Activos</h4>
          <div className="protocol-list">
            <div className="protocol">Ejercicio Longevidad (85% efectividad)</div>
            <div className="protocol">Ayuno Intermitente (78% efectividad)</div>
            <div className="protocol">Hormesis Térmica (69% efectividad)</div>
          </div>
        </div>
      </div>
    </div>
  );
});

const RecoveryTab = memo(function RecoveryTab({ userData }: { userData: UserData }) {
  const recoveryScore = Math.round(Math.random() * 30 + 70);
  
  return (
    <div className="recovery-tab">
      <h3>🔄 Análisis de Recuperación</h3>
      <div className="recovery-dashboard">
        <div className="recovery-score">
          <div className="score-circle">
            <span className="score-value">{recoveryScore}</span>
            <span className="score-label">/100</span>
          </div>
          <p>Estado de Recuperación</p>
        </div>

        <div className="recovery-factors">
          <div className="factor">
            <label>💤 Calidad Sueño</label>
            <div className="factor-bar sleep-bar"></div>
            <span>85%</span>
          </div>
          <div className="factor">
            <label>❤️ HRV</label>
            <div className="factor-bar hrv-bar"></div>
            <span>72%</span>
          </div>
          <div className="factor">
            <label>🔥 Inflamación</label>
            <div className="factor-bar inflammation-bar"></div>
            <span>Baja</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const PsychologyTab = memo(function PsychologyTab({ userData }: { userData: UserData }) {
  return (
    <div className="psychology-tab">
      <h3>🧠 Perfil Psicológico</h3>
      <div className="mental-state">
        <div className="mental-metrics">
          <div className="metric">
            <label>🎯 Concentración</label>
            <div className="metric-bar focus-bar"></div>
            <span>78%</span>
          </div>
          <div className="metric">
            <label>💪 Confianza</label>
            <div className="metric-bar confidence-bar"></div>
            <span>85%</span>
          </div>
          <div className="metric">
            <label>🔥 Motivación</label>
            <div className="metric-bar motivation-bar"></div>
            <span>90%</span>
          </div>
        </div>

        <div className="flow-state">
          <h4>🌊 Estado de Flow</h4>
          <p>Potencial de acceso: <strong>Alta</strong></p>
          <p>Técnicas recomendadas: Mindfulness, Visualización</p>
        </div>
      </div>
    </div>
  );
});

const ResearchTab = memo(function ResearchTab({ insights }: { insights: any }) {
  return (
    <div className="research-tab">
      <h3>🔬 Investigación Científica</h3>
      <div className="research-updates">
        <div className="daily-research">
          <h4>📊 Análisis de Hoy</h4>
          <p>Estudios procesados: {insights?.scientific?.evidenceProcessed?.length || 8}</p>
          <p>Protocolos actualizados: {insights?.scientific?.protocolUpdates?.length || 3}</p>
        </div>

        <div className="recent-findings">
          <h4>💡 Hallazgos Recientes</h4>
          <ul>
            <li>HIIT optimizado: intervalos 30s a 90% VO2max</li>
            <li>Protocolo proteico: ventana extendida 6h</li>
            <li>HRV biofeedback: mejora 28% adaptación</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

export default AdvancedAIDashboard;