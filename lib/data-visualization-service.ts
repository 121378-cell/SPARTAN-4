/**
 * Data Visualization Service - "La Sangre de Spartan"
 * Generates interactive dashboards and visual insights from user data
 * 
 * This service handles:
 * - Data visualization generation
 * - Interactive dashboard creation
 * - Trend analysis visualization
 * - Performance metrics visualization
 * - Comparative analysis charts
 */

import { logger } from './logger';
import { dataManagementService } from './data-management-service';
import { 
  UserData, 
  WorkoutPlan, 
  WorkoutSession, 
  RecoveryAnalysis, 
  ProgressionPlan, 
  DailyNutrition 
} from './types';

// Chart data types
export interface ChartDataPoint {
  x: number | string | Date;
  y: number | string;
  label?: string;
  tooltip?: string;
}

export interface TimeSeriesData {
  timestamps: Date[];
  values: number[];
  labels?: string[];
}

export interface ComparativeData {
  categories: string[];
  series: {
    name: string;
    values: number[];
  }[];
}

// Dashboard components
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'summary';
  data: any;
  size: 'small' | 'medium' | 'large';
  priority: 'low' | 'medium' | 'high';
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
}

export interface VisualizationConfig {
  timeframe: '7_days' | '30_days' | '90_days' | '1_year' | 'all_time';
  metrics: string[];
  chartTypes: string[];
  comparisonEnabled: boolean;
  anonymizeData: boolean;
}

export class DataVisualizationService {
  private static instance: DataVisualizationService;
  
  static getInstance(): DataVisualizationService {
    if (!DataVisualizationService.instance) {
      DataVisualizationService.instance = new DataVisualizationService();
    }
    return DataVisualizationService.instance;
  }
  
  /**
   * Generate performance trend visualization
   */
  async generatePerformanceTrendVisualization(userId: string, config: VisualizationConfig): Promise<DashboardWidget> {
    try {
      // Get data from data management service
      const insights = await dataManagementService.generateInsights();
      
      // Generate chart data
      const chartData: ChartDataPoint[] = [];
      
      if (insights?.predictions?.projections) {
        insights.predictions.projections.forEach((projection: any) => {
          chartData.push({
            x: projection.timeframe,
            y: projection.strength.projectedIncrease,
            label: `${projection.strength.projectedIncrease}%`,
            tooltip: `Proyección de aumento de fuerza: ${projection.strength.projectedIncrease}%`
          });
        });
      }
      
      return {
        id: 'performance-trend',
        title: 'Tendencia de Rendimiento',
        type: 'chart',
        data: {
          type: 'line',
          data: chartData,
          xAxisLabel: 'Periodo',
          yAxisLabel: 'Incremento de Fuerza (%)',
          color: '#3b82f6'
        },
        size: 'large',
        priority: 'high'
      };
    } catch (error) {
      logger.error('DataVisualizationService: Error generating performance trend visualization', error);
      throw error;
    }
  }
  
  /**
   * Generate adherence metrics visualization
   */
  async generateAdherenceVisualization(userId: string, config: VisualizationConfig): Promise<DashboardWidget> {
    try {
      // Get data from data management service
      const insights = await dataManagementService.generateInsights();
      
      // Generate chart data
      const chartData: ChartDataPoint[] = [];
      
      if (insights?.currentStatus) {
        chartData.push(
          { x: 'Entrenamiento', y: insights.currentStatus.trainingReadiness === 'ready' ? 90 : insights.currentStatus.trainingReadiness === 'caution' ? 60 : 30 },
          { x: 'Recuperación', y: insights.currentStatus.recoveryStatus === 'optimal' ? 90 : insights.currentStatus.recoveryStatus === 'good' ? 75 : insights.currentStatus.recoveryStatus === 'fair' ? 50 : 25 },
          { x: 'Energía', y: insights.currentStatus.energyLevel === 'high' ? 90 : insights.currentStatus.energyLevel === 'moderate' ? 70 : insights.currentStatus.energyLevel === 'low' ? 40 : 20 }
        );
      }
      
      return {
        id: 'adherence-metrics',
        title: 'Métricas de Adherencia',
        type: 'chart',
        data: {
          type: 'radar',
          data: chartData,
          color: '#10b981'
        },
        size: 'medium',
        priority: 'medium'
      };
    } catch (error) {
      logger.error('DataVisualizationService: Error generating adherence visualization', error);
      throw error;
    }
  }
  
  /**
   * Generate recovery trend visualization
   */
  async generateRecoveryTrendVisualization(userId: string, config: VisualizationConfig): Promise<DashboardWidget> {
    try {
      // Get data from data management service
      const insights = await dataManagementService.generateInsights();
      
      // Generate chart data
      const chartData: ChartDataPoint[] = [];
      
      if (insights?.trends?.recovery) {
        chartData.push(
          { x: 'Tendencia', y: insights.trends.recovery === 'improving' ? 80 : insights.trends.recovery === 'stable' ? 60 : 40 },
          { x: 'Calidad del Sueño', y: 70 }, // Placeholder
          { x: 'HRV', y: 65 }, // Placeholder
          { x: 'Estrés', y: 55 } // Placeholder
        );
      }
      
      return {
        id: 'recovery-trend',
        title: 'Tendencia de Recuperación',
        type: 'chart',
        data: {
          type: 'bar',
          data: chartData,
          xAxisLabel: 'Métrica',
          yAxisLabel: 'Puntaje',
          color: '#8b5cf6'
        },
        size: 'medium',
        priority: 'medium'
      };
    } catch (error) {
      logger.error('DataVisualizationService: Error generating recovery trend visualization', error);
      throw error;
    }
  }
  
  /**
   * Generate biometric data visualization
   */
  async generateBiometricVisualization(userId: string, config: VisualizationConfig): Promise<DashboardWidget> {
    try {
      // Get data from data management service
      const insights = await dataManagementService.generateInsights();
      
      // Generate chart data
      const chartData: ChartDataPoint[] = [];
      
      if (insights?.predictions) {
        // This would be more complex in a real implementation with actual biometric data
        chartData.push(
          { x: 'Peso', y: 75 }, // Placeholder
          { x: 'Grasa Corporal', y: 20 }, // Placeholder
          { x: 'Masa Muscular', y: 80 } // Placeholder
        );
      }
      
      return {
        id: 'biometric-data',
        title: 'Datos Biométricos',
        type: 'chart',
        data: {
          type: 'pie',
          data: chartData,
          color: '#f59e0b'
        },
        size: 'small',
        priority: 'low'
      };
    } catch (error) {
      logger.error('DataVisualizationService: Error generating biometric visualization', error);
      throw error;
    }
  }
  
  /**
   * Generate key metrics widget
   */
  async generateKeyMetricsWidget(userId: string, config: VisualizationConfig): Promise<DashboardWidget> {
    try {
      // Get data from data management service
      const insights = await dataManagementService.generateInsights();
      
      // Generate metrics data
      const metrics = {
        trainingAdherence: 85, // Placeholder - would come from adherence metrics
        nutritionAdherence: 78, // Placeholder - would come from adherence metrics
        sleepQuality: 72, // Placeholder - would come from adherence metrics
        recoveryScore: 75, // Placeholder
        energyLevel: insights?.currentStatus?.energyLevel === 'high' ? 90 : 
                    insights?.currentStatus?.energyLevel === 'moderate' ? 70 : 
                    insights?.currentStatus?.energyLevel === 'low' ? 40 : 20
      };
      
      return {
        id: 'key-metrics',
        title: 'Métricas Clave',
        type: 'metric',
        data: metrics,
        size: 'large',
        priority: 'high'
      };
    } catch (error) {
      logger.error('DataVisualizationService: Error generating key metrics widget', error);
      throw error;
    }
  }
  
  /**
   * Generate workout summary widget
   */
  async generateWorkoutSummaryWidget(userId: string, config: VisualizationConfig): Promise<DashboardWidget> {
    try {
      // Get data from data management service
      const data = await dataManagementService.generateVisualizations();
      
      // Generate summary data
      const summary = {
        totalWorkouts: 24, // Placeholder
        avgDuration: 65, // Placeholder in minutes
        favoriteExercise: 'Sentadilla', // Placeholder
        consistencyRate: 85 // Placeholder
      };
      
      return {
        id: 'workout-summary',
        title: 'Resumen de Entrenamiento',
        type: 'summary',
        data: summary,
        size: 'medium',
        priority: 'medium'
      };
    } catch (error) {
      logger.error('DataVisualizationService: Error generating workout summary widget', error);
      throw error;
    }
  }
  
  /**
   * Generate nutrition summary widget
   */
  async generateNutritionSummaryWidget(userId: string, config: VisualizationConfig): Promise<DashboardWidget> {
    try {
      // Get data from data management service
      const data = await dataManagementService.generateVisualizations();
      
      // Generate summary data
      const summary = {
        dailyCalories: 2450, // Placeholder
        proteinIntake: 180, // Placeholder in grams
        carbIntake: 320, // Placeholder in grams
        fatIntake: 85, // Placeholder in grams
        hydration: 2.8 // Placeholder in liters
      };
      
      return {
        id: 'nutrition-summary',
        title: 'Resumen Nutricional',
        type: 'summary',
        data: summary,
        size: 'medium',
        priority: 'medium'
      };
    } catch (error) {
      logger.error('DataVisualizationService: Error generating nutrition summary widget', error);
      throw error;
    }
  }
  
  /**
   * Generate comprehensive dashboard
   */
  async generateDashboard(userId: string, config: VisualizationConfig): Promise<DashboardLayout> {
    try {
      // Generate all widgets
      const widgets: DashboardWidget[] = [];
      
      // Add key metrics widget
      widgets.push(await this.generateKeyMetricsWidget(userId, config));
      
      // Add performance trend visualization
      widgets.push(await this.generatePerformanceTrendVisualization(userId, config));
      
      // Add adherence visualization
      widgets.push(await this.generateAdherenceVisualization(userId, config));
      
      // Add recovery trend visualization
      widgets.push(await this.generateRecoveryTrendVisualization(userId, config));
      
      // Add workout summary widget
      widgets.push(await this.generateWorkoutSummaryWidget(userId, config));
      
      // Add nutrition summary widget
      widgets.push(await this.generateNutritionSummaryWidget(userId, config));
      
      // Add biometric visualization
      widgets.push(await this.generateBiometricVisualization(userId, config));
      
      // Sort widgets by priority
      widgets.sort((a, b) => {
        const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      
      return {
        id: `dashboard-${userId}-${Date.now()}`,
        name: 'Dashboard Personal',
        widgets
      };
    } catch (error) {
      logger.error('DataVisualizationService: Error generating dashboard', error);
      throw error;
    }
  }
  
  /**
   * Generate time series data for trend analysis
   */
  generateTimeSeriesData(data: any[], property: string, timeframe: '7_days' | '30_days' | '90_days' | '1_year'): TimeSeriesData {
    // This would be implemented to extract time series data from the provided data
    // For now, returning placeholder data
    return {
      timestamps: [],
      values: [],
      labels: []
    };
  }
  
  /**
   * Generate comparative analysis data
   */
  generateComparativeData(categories: string[], seriesData: Record<string, number[]>): ComparativeData {
    return {
      categories,
      series: Object.keys(seriesData).map(key => ({
        name: key,
        values: seriesData[key]
      }))
    };
  }
  
  /**
   * Export visualization data in various formats
   */
  exportVisualizationData(data: any, format: 'json' | 'csv' | 'png' | 'pdf'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      
      case 'csv':
        // Convert data to CSV format
        return this.convertToCSV(data);
      
      case 'png':
      case 'pdf':
        // In a real implementation, this would generate image/PDF files
        return `Export to ${format} not implemented in this mock`;
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
  
  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: any): string {
    // Simple CSV conversion - in a real implementation, this would be more robust
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      
      // Get headers from first object
      const headers = Object.keys(data[0]);
      const csvRows = [];
      
      // Add header row
      csvRows.push(headers.join(','));
      
      // Add data rows
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvRows.push(values.join(','));
      }
      
      return csvRows.join('\n');
    }
    
    return JSON.stringify(data);
  }
}

// Export singleton instance
export const dataVisualizationService = DataVisualizationService.getInstance();