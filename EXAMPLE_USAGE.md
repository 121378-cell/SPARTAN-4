# Example Usage of Progress Report Feature

## For Developers

This document shows how to integrate and use the Progress Report feature in your SPARTAN 4 application.

### 1. Basic Integration

First, import the necessary components in your main application file:

```typescript
// index.tsx or main application component
import { lazy, useState } from 'react';
import Dashboard from './components/Dashboard';
import ProgressReportDashboard from './components/ProgressReportDashboard';

// Lazy load the progress report dashboard for better performance
const ProgressReportDashboard = lazy(() => 
  import("./components/ProgressReportDashboard").then(module => ({ default: module.default }))
);
```

### 2. State Management

Add state to manage navigation between views:

```typescript
const [currentView, setCurrentView] = useState<'dashboard' | 'progress'>('dashboard');
const [userId, setUserId] = useState<string>('');

// Get user ID from your authentication system
useEffect(() => {
  const unsubscribe = authManager.subscribe((state) => {
    if (state.user) {
      setUserId(state.user.id);
    }
  });
  
  return () => unsubscribe();
}, []);
```

### 3. Navigation Functions

Implement functions to handle navigation:

```typescript
const handleNavigateToProgress = () => {
  setCurrentView('progress');
};

const handleBackToDashboard = () => {
  setCurrentView('dashboard');
};
```

### 4. Render Logic

Update your render logic to show the appropriate view:

```tsx
{return (
  <div className="app">
    {currentView === 'dashboard' ? (
      <Dashboard 
        // ... existing props
        onNavigateToProgress={handleNavigateToProgress}
      />
    ) : (
      <ProgressReportDashboard 
        userId={userId}
        onBack={handleBackToDashboard}
      />
    )}
  </div>
)}
```

### 5. Using the Progress Report Generator Directly

If you need to generate reports programmatically:

```typescript
import { progressReportGenerator } from './lib/progress-report-generator';

// Generate a weekly report for a user
const generateUserReport = async (userId: string) => {
  try {
    const report = await progressReportGenerator.generateWeeklyReport(userId);
    console.log('Generated report:', report);
    
    // You can now use the report data for:
    // - Sending emails
    // - Creating PDFs
    // - Storing in database
    // - Displaying in custom UI
    
    return report;
  } catch (error) {
    console.error('Error generating report:', error);
  }
};
```

### 6. Customizing Recommendations

You can extend the recommendation system by modifying the `generateRecommendations` method in `progress-report-generator.ts`:

```typescript
private generateRecommendations(
  training: TrainingMetrics,
  nutrition: NutritionalMetrics,
  health: HealthMetrics,
  performance: PerformanceMetrics
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Add your custom recommendation logic here
  if (training.consistencyScore < 70) {
    recommendations.push({
      category: 'training',
      priority: 'high',
      title: 'Improve Training Consistency',
      description: 'Try scheduling your workouts at the same time each day.',
      actionItems: [
        'Set recurring calendar reminders',
        'Prepare workout clothes the night before',
        'Find a workout buddy for accountability'
      ],
      expectedImpact: '20-30% improvement in consistency',
      timeframe: '2 weeks'
    });
  }
  
  // ... more recommendations
  
  return recommendations;
}
```

## For Users

### Accessing Progress Reports

1. Open the SPARTAN 4 application
2. Navigate to your main dashboard
3. Look for the "Informe de Progreso" card
4. Click "Ver Informe Detallado"
5. View your comprehensive progress report

### Understanding the Report

The progress report is organized into several sections:

#### Overall Score
A circular progress indicator showing your overall fitness score (0-100)

#### Key Metrics
Four cards showing your performance in:
- Training
- Nutrition
- Health
- Performance

#### Detailed Sections
Each category has a detailed breakdown:
- **Training**: Workout completion, duration, consistency
- **Nutrition**: Macro adherence, meal frequency, hydration
- **Health**: Sleep quality, heart rate, body composition
- **Performance**: Strength gains, endurance improvements

#### Personalized Insights
- **Strengths**: What you're doing well
- **Areas for Improvement**: Where you can focus efforts

#### Actionable Recommendations
Prioritized suggestions with specific action items to improve your metrics

### Making Use of Recommendations

1. Review the recommendations section
2. Focus on high-priority items first
3. Follow the action items for each recommendation
4. Track your progress in subsequent reports
5. Adjust your approach based on results

## Example Report Data Structure

Here's an example of what a generated report looks like:

```typescript
{
  reportId: "report_user123_1640995200000",
  userId: "user123",
  startDate: new Date("2023-12-25T00:00:00.000Z"),
  endDate: new Date("2023-12-31T23:59:59.999Z"),
  period: "weekly",
  training: {
    totalWorkouts: 5,
    completedWorkouts: 4,
    workoutCompletionRate: 80,
    avgWorkoutDuration: 45,
    totalVolume: 12500,
    consistencyScore: 85,
    intensityScore: 78,
    progressionRate: 5.2,
    favoriteExercises: ["Sentadilla", "Press Banca", "Dominadas"],
    workoutDistribution: {
      strength: 60,
      calisthenics: 20,
      yoga: 10,
      cardio: 10,
      other: 0
    }
  },
  nutrition: {
    adherenceRate: 75,
    macroTargets: {
      calories: 2500,
      protein: 150,
      carbs: 300,
      fats: 80
    },
    actualIntake: {
      calories: 2300,
      protein: 140,
      carbs: 280,
      fats: 75
    },
    macroAdherence: {
      calories: 92,
      protein: 93,
      carbs: 93,
      fats: 94
    },
    mealFrequency: 3.5,
    hydrationLevel: 80,
    micronutrientScore: 70,
    supplementationAdherence: 60
  },
  health: {
    avgHeartRate: 72,
    restingHeartRate: 52,
    heartRateVariability: 65,
    sleepQuality: 85,
    sleepDuration: 7.5,
    stepsPerDay: 8500,
    activeMinutes: 45,
    stressLevel: 30,
    bodyComposition: {
      weight: 75,
      bodyFatPercentage: 15,
      muscleMass: 60
    },
    bloodMarkers: {
      glucose: 95,
      cholesterol: 180,
      bloodPressure: {
        systolic: 120,
        diastolic: 80
      }
    }
  },
  performance: {
    strengthImprovements: {
      squat: 5.2,
      deadlift: 3.8,
      benchPress: 4.1,
      pullUp: 7.3
    },
    enduranceImprovements: {
      vo2max: 3.5,
      lactateThreshold: 2.8
    },
    flexibilityImprovements: {
      shoulderFlexibility: 6.2,
      hipFlexibility: 4.5,
      spineMobility: 5.1
    },
    cognitiveMetrics: {
      focusScore: 82,
      reactionTime: 280,
      memoryScore: 78
    }
  },
  overallScore: 78,
  strengths: [
    "Excellent training consistency",
    "Good sleep quality",
    "Strong performance in pull-ups"
  ],
  areasForImprovement: [
    "Nutrition adherence needs attention",
    "Low supplementation adherence"
  ],
  recommendations: [
    {
      category: "nutrition",
      priority: "high",
      title: "Optimize Nutritional Adherence",
      description: "Implement strategies to better follow your nutritional targets.",
      actionItems: [
        "Meal prep on Sundays",
        "Use a food tracking app",
        "Keep healthy snacks readily available"
      ],
      expectedImpact: "15-25% improvement in adherence",
      timeframe: "2 weeks"
    }
  ],
  trends: {
    trainingTrend: "improving",
    nutritionTrend: "stable",
    healthTrend: "improving",
    performanceTrend: "improving"
  }
}
```

## Troubleshooting

### Common Issues

1. **Blank Dashboard**: Ensure all required props are passed to the Dashboard component
2. **Data Not Loading**: Check Supabase connection and permissions
3. **Incorrect Scores**: Review weighting algorithms in calculateOverallScore
4. **Missing Icons**: Ensure all Lucide React icons are properly imported

### Debugging Tips

1. Use browser dev tools to inspect network requests
2. Check console logs for error messages
3. Verify data structures match expected types
4. Test with different user data scenarios

## Conclusion

The Progress Report feature provides valuable insights into user progress across multiple fitness dimensions. By following the integration guide and examples above, you can seamlessly add this feature to enhance the SPARTAN 4 user experience.