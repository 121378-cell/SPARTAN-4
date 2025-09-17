# SPARTAN 4 Predictive Analytics System

## Overview

The Predictive Analytics System in SPARTAN 4 projects evolution in strength, muscle mass, and body composition using AI predictive models based on adherence and biometric data. This system helps users understand their potential progress and identify areas for optimization.

## Components

### 1. Predictive Analytics Engine ([lib/predictive-analytics.ts](file:///c:/dev/SPARTAN%204/lib/predictive-analytics.ts))

The core engine that calculates projections based on:

- **Biometric Data**: Weight, body fat percentage, muscle mass, bone density, heart rate metrics, blood pressure, VO2 max, glucose, and cholesterol
- **Adherence Metrics**: Training adherence, nutrition adherence, sleep quality, supplementation adherence, and stress management
- **User Data**: Fitness level, goals, and other personal information

#### Key Features:

- **Multi-timeframe Projections**: Generates projections for 1 month, 3 months, 6 months, and 1 year
- **Strength Projections**: Projects gains in key compound movements (squat, deadlift, bench press, pull-ups)
- **Muscle Mass Projections**: Estimates increases in total and lean muscle mass
- **Body Composition Analysis**: Projects changes in body fat percentage and visceral fat levels
- **Risk Factor Identification**: Identifies potential obstacles to progress
- **Optimization Opportunities**: Suggests areas where users can accelerate their progress
- **Personalized Recommendations**: Provides specific actions based on current metrics

### 2. Predictive Analytics Dashboard ([components/PredictiveAnalyticsDashboard.tsx](file:///c:/dev/SPARTAN%204/components/PredictiveAnalyticsDashboard.tsx))

The user interface component that displays predictive insights:

- **Timeframe Selection**: Allows users to view projections for different time periods
- **Confidence Indicators**: Shows the confidence level of projections based on current adherence
- **Strength Projections**: Visualizes projected gains in key lifts
- **Muscle Mass Projections**: Displays projected increases in muscle mass
- **Body Composition Changes**: Shows projected changes in body fat and visceral fat
- **Key Factors**: Highlights the main drivers of projected progress
- **Risk Factors**: Identifies potential obstacles to progress
- **Optimization Opportunities**: Suggests ways to accelerate progress
- **Personalized Recommendations**: Provides specific actions to maximize results
- **Projection Summary**: Compares projections across all timeframes

## Integration

The predictive analytics system is integrated into the main SPARTAN 4 application through:

1. **Screen Routing**: Added "predictiveAnalytics" to the Screen type and renderScreen function in [index.tsx](file:///c:/dev/SPARTAN%204/index.tsx)
2. **Navigation**: Added a card in the Dashboard component to access the predictive analytics dashboard
3. **Data Flow**: Uses the existing user data structure and passes it to the predictive engine

## Algorithms

The predictive engine uses weighted algorithms to calculate projections:

- **Training Effect** (50% weight): Based on training adherence and fitness level
- **Nutrition Effect** (30% weight): Based on nutrition adherence and current body composition
- **Recovery Effect** (20% weight): Based on sleep quality and stress management

These effects are combined to generate composite projections for different timeframes.

## Usage

Users can access the predictive analytics dashboard from the main dashboard by clicking the "Análisis Predictivo" card. The system will automatically generate projections based on current data and display them in an easy-to-understand interface.

The projections update automatically when new data is available, ensuring users always have the most current predictions for their fitness journey.