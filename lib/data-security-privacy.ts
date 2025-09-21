/**
 * Data Security and Privacy Service - "La Sangre de Spartan"
 * Ensures all user data is protected and privacy is maintained
 * 
 * This service handles:
 * - Data encryption
 * - Access control
 * - Privacy compliance
 * - Special protections for minors
 * - Data anonymization
 */

import { logger } from './logger';
import { storageManager } from './storage';

// Privacy levels for different types of data
export type PrivacyLevel = 'public' | 'friends' | 'private' | 'sensitive';

// Age groups for special protections
export type AgeGroup = 'minor' | 'adult' | 'senior';

// Data categories that require special handling
export type SensitiveDataCategory = 
  | 'biometric'
  | 'psychological'
  | 'medical'
  | 'behavioral'
  | 'location'
  | 'financial';

export interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  thirdPartySharing: boolean;
  profileVisibility: PrivacyLevel;
  workoutVisibility: PrivacyLevel;
  progressVisibility: PrivacyLevel;
  socialFeatures: boolean;
}

export interface DataProtectionRule {
  category: SensitiveDataCategory;
  requiredAge: number;
  encryptionRequired: boolean;
  anonymizationRequired: boolean;
  consentRequired: boolean;
  retentionPeriod: number; // in days
}

export class DataSecurityPrivacyService {
  private static instance: DataSecurityPrivacyService;
  private privacySettings: Map<string, PrivacySettings> = new Map();
  private protectionRules: DataProtectionRule[];
  
  static getInstance(): DataSecurityPrivacyService {
    if (!DataSecurityPrivacyService.instance) {
      DataSecurityPrivacyService.instance = new DataSecurityPrivacyService();
    }
    return DataSecurityPrivacyService.instance;
  }
  
  constructor() {
    // Initialize protection rules
    this.protectionRules = this.initializeProtectionRules();
  }
  
  /**
   * Initialize protection rules for different data categories
   */
  private initializeProtectionRules(): DataProtectionRule[] {
    return [
      {
        category: 'biometric',
        requiredAge: 18,
        encryptionRequired: true,
        anonymizationRequired: true,
        consentRequired: true,
        retentionPeriod: 365 * 5 // 5 years
      },
      {
        category: 'psychological',
        requiredAge: 18,
        encryptionRequired: true,
        anonymizationRequired: true,
        consentRequired: true,
        retentionPeriod: 365 * 3 // 3 years
      },
      {
        category: 'medical',
        requiredAge: 18,
        encryptionRequired: true,
        anonymizationRequired: true,
        consentRequired: true,
        retentionPeriod: 365 * 10 // 10 years
      },
      {
        category: 'behavioral',
        requiredAge: 13,
        encryptionRequired: true,
        anonymizationRequired: false,
        consentRequired: true,
        retentionPeriod: 365 * 2 // 2 years
      },
      {
        category: 'location',
        requiredAge: 13,
        encryptionRequired: true,
        anonymizationRequired: false,
        consentRequired: true,
        retentionPeriod: 30 // 30 days
      },
      {
        category: 'financial',
        requiredAge: 18,
        encryptionRequired: true,
        anonymizationRequired: true,
        consentRequired: true,
        retentionPeriod: 365 * 7 // 7 years
      }
    ];
  }
  
  /**
   * Determine age group for special protections
   */
  determineAgeGroup(age: number): AgeGroup {
    if (age < 13) {
      throw new Error('Users under 13 are not permitted');
    } else if (age < 18) {
      return 'minor';
    } else if (age >= 65) {
      return 'senior';
    } else {
      return 'adult';
    }
  }
  
  /**
   * Check if user has required age for accessing specific data
   */
  checkAgeRequirement(userId: string, age: number, category: SensitiveDataCategory): boolean {
    const rule = this.protectionRules.find(r => r.category === category);
    if (!rule) return true; // No rule found, allow access
    
    const ageGroup = this.determineAgeGroup(age);
    
    // Special protections for minors
    if (ageGroup === 'minor') {
      // Minors cannot access certain sensitive data
      if (category === 'medical' || category === 'psychological' || category === 'financial') {
        logger.warn(`DataSecurityPrivacy: Minor user ${userId} attempted to access ${category} data`);
        return false;
      }
      
      // Minors need parental consent for other sensitive data
      if (rule.requiredAge > age) {
        logger.warn(`DataSecurityPrivacy: Minor user ${userId} does not meet age requirement for ${category} data`);
        return false;
      }
    }
    
    return age >= rule.requiredAge;
  }
  
  /**
   * Apply encryption to sensitive data
   */
  encryptData(data: any, category: SensitiveDataCategory): string {
    const rule = this.protectionRules.find(r => r.category === category);
    if (!rule || !rule.encryptionRequired) {
      return JSON.stringify(data);
    }
    
    // In a real implementation, we would use proper encryption
    // For now, we'll simulate encryption
    try {
      const jsonString = JSON.stringify(data);
      // Simulate encryption with base64 encoding (NOT secure for real use)
      const encrypted = Buffer.from(jsonString).toString('base64');
      logger.info(`DataSecurityPrivacy: Encrypted ${category} data`);
      return encrypted;
    } catch (error) {
      logger.error(`DataSecurityPrivacy: Error encrypting ${category} data`, error);
      throw error;
    }
  }
  
  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData: string, category: SensitiveDataCategory): any {
    const rule = this.protectionRules.find(r => r.category === category);
    if (!rule || !rule.encryptionRequired) {
      return JSON.parse(encryptedData);
    }
    
    // In a real implementation, we would use proper decryption
    // For now, we'll simulate decryption
    try {
      // Simulate decryption with base64 decoding (NOT secure for real use)
      const decrypted = Buffer.from(encryptedData, 'base64').toString('ascii');
      const data = JSON.parse(decrypted);
      logger.info(`DataSecurityPrivacy: Decrypted ${category} data`);
      return data;
    } catch (error) {
      logger.error(`DataSecurityPrivacy: Error decrypting ${category} data`, error);
      throw error;
    }
  }
  
  /**
   * Anonymize data for privacy protection
   */
  anonymizeData(data: any, category: SensitiveDataCategory): any {
    const rule = this.protectionRules.find(r => r.category === category);
    if (!rule || !rule.anonymizationRequired) {
      return data;
    }
    
    // Create a copy of the data to avoid modifying the original
    const anonymizedData = { ...data };
    
    // Apply anonymization based on category
    switch (category) {
      case 'biometric':
        // Remove identifying information, keep only statistical data
        delete anonymizedData.userId;
        delete anonymizedData.timestamp;
        // Keep only aggregated metrics
        break;
        
      case 'psychological':
        // Remove personal identifiers
        delete anonymizedData.userId;
        delete anonymizedData.timestamp;
        // Generalize responses
        break;
        
      case 'medical':
        // Remove all personal identifiers
        delete anonymizedData.userId;
        delete anonymizedData.timestamp;
        delete anonymizedData.patientId;
        // Generalize medical data
        break;
        
      case 'behavioral':
        // Keep behavioral patterns but remove personal identifiers
        delete anonymizedData.userId;
        delete anonymizedData.timestamp;
        break;
        
      case 'location':
        // Generalize location data
        if (anonymizedData.latitude && anonymizedData.longitude) {
          // Reduce precision to protect exact location
          anonymizedData.latitude = Math.round(anonymizedData.latitude * 1000) / 1000;
          anonymizedData.longitude = Math.round(anonymizedData.longitude * 1000) / 1000;
        }
        delete anonymizedData.userId;
        delete anonymizedData.timestamp;
        break;
        
      case 'financial':
        // Remove all financial identifiers
        delete anonymizedData.userId;
        delete anonymizedData.timestamp;
        delete anonymizedData.accountNumber;
        delete anonymizedData.transactionId;
        // Generalize amounts
        if (anonymizedData.amount) {
          anonymizedData.amount = Math.round(anonymizedData.amount / 10) * 10; // Round to nearest 10
        }
        break;
    }
    
    logger.info(`DataSecurityPrivacy: Anonymized ${category} data`);
    return anonymizedData;
  }
  
  /**
   * Check if user has given consent for data processing
   */
  checkConsent(userId: string, category: SensitiveDataCategory): boolean {
    const rule = this.protectionRules.find(r => r.category === category);
    if (!rule || !rule.consentRequired) {
      return true;
    }
    
    // In a real implementation, we would check actual consent records
    // For now, we'll assume consent is given
    const hasConsent = true; // This would come from actual consent records
    
    if (!hasConsent) {
      logger.warn(`DataSecurityPrivacy: User ${userId} has not given consent for ${category} data processing`);
    }
    
    return hasConsent;
  }
  
  /**
   * Apply special protections for minors
   */
  applyMinorProtections(userId: string, age: number, data: any, category: SensitiveDataCategory): any {
    const ageGroup = this.determineAgeGroup(age);
    
    if (ageGroup !== 'minor') {
      return data;
    }
    
    // Apply additional protections for minors
    logger.info(`DataSecurityPrivacy: Applying minor protections for user ${userId}`);
    
    // Enhanced anonymization for minors
    const anonymizedData = this.anonymizeData(data, category);
    
    // Additional restrictions for minors
    switch (category) {
      case 'biometric':
        // Limit biometric data retention
        // In a real implementation, we would set shorter retention periods
        break;
        
      case 'psychological':
        // Require parental notification for psychological data
        // In a real implementation, we would notify parents
        break;
        
      case 'medical':
        // Minors cannot access medical data directly
        // In a real implementation, we would block access
        break;
        
      case 'financial':
        // Minors cannot access financial data
        // In a real implementation, we would block access
        break;
    }
    
    return anonymizedData;
  }
  
  /**
   * Apply data retention policies
   */
  applyRetentionPolicies(userId: string, data: any, category: SensitiveDataCategory, createdAt: Date): boolean {
    const rule = this.protectionRules.find(r => r.category === category);
    if (!rule) return true; // No rule found, keep data
    
    const now = new Date();
    const dataAge = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)); // in days
    
    if (dataAge > rule.retentionPeriod) {
      logger.info(`DataSecurityPrivacy: Data of category ${category} for user ${userId} has exceeded retention period (${dataAge} days old, max ${rule.retentionPeriod} days)`);
      return false; // Data should be deleted
    }
    
    return true; // Data is within retention period
  }
  
  /**
   * Detect and handle potential eating disorder indicators
   */
  detectEatingDisorderIndicators(userId: string, data: any): boolean {
    // Check for potential eating disorder indicators
    const indicators = [];
    
    // Weight fluctuation patterns
    if (data.weightHistory && Array.isArray(data.weightHistory)) {
      const recentWeights = data.weightHistory.slice(-30); // Last 30 entries
      if (recentWeights.length >= 5) {
        const avgWeight = recentWeights.reduce((sum: number, w: number) => sum + w, 0) / recentWeights.length;
        const variance = recentWeights.reduce((sum: number, w: number) => sum + Math.pow(w - avgWeight, 2), 0) / recentWeights.length;
        const stdDev = Math.sqrt(variance);
        
        // High variance in weight could indicate disordered eating
        if (stdDev > 5) { // More than 5kg standard deviation
          indicators.push('High weight fluctuation');
        }
      }
    }
    
    // Extreme calorie restriction
    if (data.nutrition && data.nutrition.calories) {
      const dailyCalories = data.nutrition.calories;
      const bmrEstimate = data.weight * 24; // Very rough BMR estimate
      
      if (dailyCalories < bmrEstimate * 0.6) { // Less than 60% of estimated BMR
        indicators.push('Severe calorie restriction');
      }
    }
    
    // Excessive exercise patterns
    if (data.workouts && Array.isArray(data.workouts)) {
      const recentWorkouts = data.workouts.filter((w: any) => {
        const workoutDate = new Date(w.date);
        const daysAgo = (Date.now() - workoutDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo <= 7; // Last 7 days
      });
      
      // More than 2 workouts per day or excessive duration
      const dailyWorkoutCounts: Record<string, number> = {};
      recentWorkouts.forEach((workout: any) => {
        const dateStr = new Date(workout.date).toISOString().split('T')[0];
        dailyWorkoutCounts[dateStr] = (dailyWorkoutCounts[dateStr] || 0) + 1;
      });
      
      const hasExcessiveDailyWorkouts = Object.values(dailyWorkoutCounts).some(count => count > 2);
      if (hasExcessiveDailyWorkouts) {
        indicators.push('Excessive daily workout frequency');
      }
      
      const hasExcessiveDuration = recentWorkouts.some((w: any) => w.duration > 300); // More than 5 hours
      if (hasExcessiveDuration) {
        indicators.push('Excessively long workout sessions');
      }
    }
    
    // If indicators are found, take appropriate action
    if (indicators.length > 0) {
      logger.warn(`DataSecurityPrivacy: Potential eating disorder indicators detected for user ${userId}: ${indicators.join(', ')}`);
      
      // In a real implementation, we would:
      // 1. Notify appropriate authorities if required by law
      // 2. Provide resources to the user
      // 3. Restrict certain features
      // 4. Require additional consent or parental involvement
      
      return true; // Indicators detected
    }
    
    return false; // No indicators detected
  }
  
  /**
   * Get or create privacy settings for a user
   */
  getPrivacySettings(userId: string): PrivacySettings {
    if (!this.privacySettings.has(userId)) {
      // Create default privacy settings
      const defaultSettings: PrivacySettings = {
        dataSharing: false,
        analytics: true,
        thirdPartySharing: false,
        profileVisibility: 'friends',
        workoutVisibility: 'friends',
        progressVisibility: 'friends',
        socialFeatures: true
      };
      
      this.privacySettings.set(userId, defaultSettings);
    }
    
    return this.privacySettings.get(userId)!;
  }
  
  /**
   * Update privacy settings for a user
   */
  updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): void {
    const currentSettings = this.getPrivacySettings(userId);
    const updatedSettings = { ...currentSettings, ...settings };
    this.privacySettings.set(userId, updatedSettings);
    
    // Store in persistent storage
    storageManager.setSettings({
      ...storageManager.getSettings(),
      privacy: {
        dataSharing: updatedSettings.dataSharing,
        analytics: updatedSettings.analytics
      }
    });
    
    logger.info(`DataSecurityPrivacy: Updated privacy settings for user ${userId}`);
  }
  
  /**
   * Apply privacy filters to data before sharing
   */
  applyPrivacyFilters(userId: string, data: any, targetVisibility: PrivacyLevel, requesterVisibility: PrivacyLevel): any {
    // If data visibility is more restrictive than requester visibility, filter the data
    const visibilityOrder = ['public', 'friends', 'private', 'sensitive'];
    const dataVisibilityIndex = visibilityOrder.indexOf(targetVisibility);
    const requesterVisibilityIndex = visibilityOrder.indexOf(requesterVisibility);
    
    if (dataVisibilityIndex > requesterVisibilityIndex) {
      // Data is more private than requester can access
      logger.info(`DataSecurityPrivacy: Filtering data for user ${userId} due to privacy restrictions`);
      return null; // Don't share the data
    }
    
    return data;
  }
}

// Export singleton instance
export const dataSecurityPrivacyService = DataSecurityPrivacyService.getInstance();