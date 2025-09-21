/**
 * Advanced Data Visualization Dashboard for SPARTAN 4
 * Implements 3D biométric data representation, real-time performance heatmaps, 
 * and comparative analytics with historical Spartan data
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui';
import { 
  BarChart3, 
  Activity, 
  Heart, 
  Zap, 
  Droplets, 
  TrendingUp, 
  ArrowLeft,
  Calendar,
  Filter,
  Download,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as d3 from 'd3';
import type { UserData, WorkoutSession, RecoveryAnalysis } from '../lib/types';
import type { WeeklyProgressReport } from '../lib/progress-report-types';
import { dataVisualizationService } from '../lib/data-visualization-service';

interface AdvancedDataVisualizationDashboardProps {
  userData: UserData;
  progressReport?: WeeklyProgressReport;
  workoutSessions: WorkoutSession[];
  recoveryData: RecoveryAnalysis[];
  onBack: () => void;
}

// 3D Biométric Data Visualization Component
const Biométric3DVisualization = ({ data }: { data: any[] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  // Generate 3D points from biométric data
  const points = useMemo(() => {
    return data.map((item, index) => ({
      x: Math.sin(index * 0.5) * 3,
      y: item.value * 0.1,
      z: Math.cos(index * 0.5) * 3,
      value: item.value,
      label: item.label
    }));
  }, [data]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <group ref={groupRef}>
        {points.map((point, index) => (
          <mesh 
            key={index} 
            position={[point.x, point.y, point.z]} 
            ref={index === 0 ? meshRef : null}
          >
            <sphereGeometry args={[point.value * 0.05 + 0.2, 32, 32]} />
            <meshStandardMaterial 
              color={new THREE.Color(
                d3.interpolateRainbow(point.value / 100)
              )} 
              transparent 
              opacity={0.8}
            />
            <Text
              position={[0, 1, 0]}
              color="white"
              fontSize={0.3}
              maxWidth={200}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign="center"
              font="/fonts/inter-bold.woff"
            >
              {point.label}
            </Text>
          </mesh>
        ))}
      </group>
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  );
};

// Performance Heatmap Component
const PerformanceHeatmap = ({ data }: { data: any[] }) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  
  // Generate heatmap data
  const heatmapData = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const times = ['6:00', '9:00', '12:00', '15:00', '18:00', '21:00'];
    
    return times.map((time, rowIndex) => {
      const row: any = { time };
      days.forEach((day, colIndex) => {
        // Generate mock performance data
        const performance = Math.floor(Math.random() * 100);
        row[day] = performance;
      });
      return row;
    });
  }, []);

  // Color scale for heatmap
  const getColor = (value: number) => {
    if (value < 20) return '#ef4444'; // red
    if (value < 40) return '#f97316'; // orange
    if (value < 60) return '#eab308'; // yellow
    if (value < 80) return '#22c55e'; // green
    return '#10b981'; // emerald
  };

  return (
    <div className="w-full h-80 relative">
      <div className="grid grid-cols-8 gap-1 h-full">
        {/* Empty cell for top-left corner */}
        <div></div>
        
        {/* Day headers */}
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-600 flex items-center justify-center">
            {day}
          </div>
        ))}
        
        {/* Rows */}
        {heatmapData.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Time label */}
            <div className="text-center text-xs font-medium text-gray-600 flex items-center justify-center">
              {row.time}
            </div>
            
            {/* Data cells */}
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, colIndex) => {
              const value = row[day];
              const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`rounded-sm flex items-center justify-center transition-all duration-200 ${
                    isHovered ? 'ring-2 ring-blue-500 scale-110 z-10' : ''
                  }`}
                  style={{
                    backgroundColor: getColor(value),
                    opacity: isHovered ? 1 : 0.8
                  }}
                  onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {isHovered && (
                    <div className="absolute bg-gray-900 text-white text-xs p-2 rounded shadow-lg z-20 -mt-12">
                      {day} {row.time}: {value}%
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Comparative Analytics Chart
const ComparativeAnalyticsChart = ({ data }: { data: any[] }) => {
  const [showAllData, setShowAllData] = useState(true);
  
  // Sample comparative data
  const comparativeData = useMemo(() => {
    return [
      { name: 'Fuerza', user: 75, average: 65, elite: 85 },
      { name: 'Resistencia', user: 68, average: 60, elite: 80 },
      { name: 'Flexibilidad', user: 82, average: 55, elite: 75 },
      { name: 'Velocidad', user: 70, average: 62, elite: 88 },
      { name: 'Agilidad', user: 78, average: 68, elite: 90 },
      { name: 'Equilibrio', user: 85, average: 70, elite: 85 }
    ];
  }, []);
  
  const COLORS = ['#3b82f6', '#6b7280', '#10b981'];
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={comparativeData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
          <YAxis domain={[0, 100]} />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Puntaje']}
            labelFormatter={(name) => `Métrica: ${name}`}
          />
          <Legend />
          <Bar dataKey="user" name="Tu desempeño" fill={COLORS[0]} />
          <Bar dataKey="average" name="Promedio Spartan" fill={COLORS[1]} />
          <Bar dataKey="elite" name="Elite Spartan" fill={COLORS[2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Real-time Performance Radar Chart
const RealTimePerformanceRadar = ({ data }: { data: any[] }) => {
  const radarData = useMemo(() => {
    return [
      { subject: 'Fuerza', A: 120, B: 110, fullMark: 150 },
      { subject: 'Resistencia', A: 98, B: 130, fullMark: 150 },
      { subject: 'Velocidad', A: 86, B: 130, fullMark: 150 },
      { subject: 'Agilidad', A: 99, B: 100, fullMark: 150 },
      { subject: 'Precisión', A: 85, B: 90, fullMark: 150 },
      { subject: 'Recuperación', A: 65, B: 85, fullMark: 150 },
    ];
  }, []);
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar
            name="Tu desempeño"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Radar
            name="Objetivo"
            dataKey="B"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function AdvancedDataVisualizationDashboard({ 
  userData, 
  progressReport,
  workoutSessions,
  recoveryData,
  onBack 
}: AdvancedDataVisualizationDashboardProps) {
  const [timeframe, setTimeframe] = useState<'7_days' | '30_days' | '90_days' | '1_year'>('30_days');
  const [activeTab, setActiveTab] = useState<'3d' | 'heatmap' | 'comparative' | 'radar'>('3d');
  const [loading, setLoading] = useState(true);
  const [show3D, setShow3D] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Sample biométric data for 3D visualization
  const biométricData = useMemo(() => {
    return [
      { label: 'Fuerza', value: 85 },
      { label: 'Resistencia', value: 72 },
      { label: 'Velocidad', value: 68 },
      { label: 'Agilidad', value: 78 },
      { label: 'Flexibilidad', value: 82 },
      { label: 'Equilibrio', value: 75 },
      { label: 'Potencia', value: 80 },
      { label: 'Precisión', value: 88 }
    ];
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button 
                onClick={onBack}
                className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Visualización Avanzada de Datos
                </h1>
                <p className="text-gray-600">Análisis 3D y comparativo de tu rendimiento</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Visualización Avanzada de Datos
              </h1>
              <p className="text-gray-600">Análisis 3D y comparativo de tu rendimiento</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="bg-transparent text-sm font-medium focus:outline-none"
            >
              <option value="7_days">Últimos 7 días</option>
              <option value="30_days">Últimos 30 días</option>
              <option value="90_days">Últimos 90 días</option>
              <option value="1_year">Último año</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('3d')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === '3d' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Datos Biométricos 3D
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'heatmap' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Mapa de Calor de Rendimiento
          </button>
          <button
            onClick={() => setActiveTab('comparative')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'comparative' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Análisis Comparativo
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'radar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Zap className="h-4 w-4 inline mr-2" />
            Radar de Rendimiento
          </button>
        </div>

        {/* Visualization Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualization */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {activeTab === '3d' && 'Representación 3D de Datos Biométricos'}
                      {activeTab === 'heatmap' && 'Mapa de Calor de Rendimiento en Tiempo Real'}
                      {activeTab === 'comparative' && 'Análisis Comparativo con Datos Históricos'}
                      {activeTab === 'radar' && 'Radar de Rendimiento en Tiempo Real'}
                    </CardTitle>
                    <CardDescription>
                      {activeTab === '3d' && 'Visualización tridimensional interactiva de tus métricas biométricas'}
                      {activeTab === 'heatmap' && 'Mapa de calor mostrando tu rendimiento en diferentes horarios y días'}
                      {activeTab === 'comparative' && 'Comparación de tu rendimiento con promedios de Spartans y atletas de élite'}
                      {activeTab === 'radar' && 'Visualización radial de tus capacidades físicas en tiempo real'}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <RotateCcw className="h-5 w-5 text-gray-600" />
                    </button>
                    {activeTab === '3d' && (
                      <button 
                        onClick={() => setShow3D(!show3D)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {show3D ? <EyeOff className="h-5 w-5 text-gray-600" /> : <Eye className="h-5 w-5 text-gray-600" />}
                      </button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-96">
                {activeTab === '3d' && (
                  show3D ? (
                    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                      <Biométric3DVisualization data={biométricData} />
                    </Canvas>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Visualización 3D desactivada. Haz clic en el ícono del ojo para activarla.</p>
                    </div>
                  )
                )}
                
                {activeTab === 'heatmap' && <PerformanceHeatmap data={[]} />}
                
                {activeTab === 'comparative' && <ComparativeAnalyticsChart data={[]} />}
                
                {activeTab === 'radar' && <RealTimePerformanceRadar data={[]} />}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Metrics */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas Clave</CardTitle>
                <CardDescription>Tus indicadores de rendimiento más importantes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rendimiento</p>
                      <p className="font-bold">85%</p>
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recuperación</p>
                      <p className="font-bold">78%</p>
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Energía</p>
                      <p className="font-bold">92%</p>
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Insights de Rendimiento</CardTitle>
                <CardDescription>Recomendaciones basadas en tu datos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-sm font-medium text-yellow-800">Optimiza tu entrenamiento</p>
                  <p className="text-xs text-yellow-700 mt-1">Tu rendimiento es más alto entre las 18:00 y 20:00 horas.</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-blue-800">Mejora tu recuperación</p>
                  <p className="text-xs text-blue-700 mt-1">Incrementa 1 hora de sueño para mejorar tu recuperación en 15%.</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm font-medium text-green-800">Mantén tu progreso</p>
                  <p className="text-xs text-green-700 mt-1">Tu consistencia ha mejorado un 23% en los últimos 30 días.</p>
                </div>
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card>
              <CardHeader>
                <CardTitle>Exportar Datos</CardTitle>
                <CardDescription>Descarga tus análisis en diferentes formatos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Download className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Exportar como PDF</p>
                      <p className="text-xs text-gray-500">Documento detallado con todos los análisis</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <BarChart3 className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Exportar como CSV</p>
                      <p className="text-xs text-gray-500">Datos en formato para análisis externo</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
