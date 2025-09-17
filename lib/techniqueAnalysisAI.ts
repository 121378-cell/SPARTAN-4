/**
 * Advanced Technique Analysis AI System
 * Real-time movement analysis using sensors and computer vision
 */

export interface SensorData {
  timestamp: number;
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
  magnetometer?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface VideoFrame {
  timestamp: number;
  keypoints: Keypoint[];
  confidence: number;
}

export interface Keypoint {
  name: string;
  x: number;
  y: number;
  z?: number;
  confidence: number;
}

export interface BiomechanicsData {
  jointAngles: {
    [jointName: string]: number;
  };
  velocity: {
    x: number;
    y: number;
    z: number;
  };
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  power: number;
  range_of_motion: number;
  symmetry_index: number;
}

export interface TechniqueFeedback {
  id: string;
  timestamp: number;
  exerciseName: string;
  phase: 'eccentric' | 'concentric' | 'isometric' | 'transition';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'safety' | 'performance' | 'efficiency' | 'form';
  title: string;
  description: string;
  correction: string;
  confidence: number;
  data: {
    actual_value: number;
    ideal_range: [number, number];
    deviation_percentage: number;
  };
  prevention_tips: string[];
  muscle_activation?: {
    [muscleName: string]: number; // EMG percentage
  };
}

export interface ExerciseProfile {
  name: string;
  category: 'compound' | 'isolation' | 'functional';
  primary_muscles: string[];
  movement_pattern: 'push' | 'pull' | 'squat' | 'hinge' | 'lunge' | 'rotation';
  critical_points: CriticalPoint[];
  biomechanical_model: BiomechanicalModel;
  injury_risk_factors: InjuryRiskFactor[];
}

export interface CriticalPoint {
  phase: string;
  joint: string;
  optimal_angle_range: [number, number];
  critical_angle_thresholds: [number, number];
  velocity_constraints: [number, number];
  force_patterns: string[];
}

export interface BiomechanicalModel {
  phases: {
    [phaseName: string]: {
      duration_percentage: [number, number];
      key_metrics: string[];
      common_errors: string[];
    };
  };
  force_curves: {
    [phaseName: string]: number[];
  };
  muscle_activation_patterns: {
    [muscleName: string]: number[];
  };
}

export interface InjuryRiskFactor {
  factor: string;
  description: string;
  detection_method: 'kinematics' | 'kinetics' | 'emg' | 'video';
  threshold: number;
  consequences: string[];
  prevention: string[];
}

export class TechniqueAnalysisAI {
  private sensorBuffer: SensorData[] = [];
  private videoBuffer: VideoFrame[] = [];
  private currentExercise: ExerciseProfile | null = null;
  private analysisCallbacks: ((feedback: TechniqueFeedback) => void)[] = [];
  private isAnalyzing = false;
  private bufferSize = 100; // Number of data points to keep

  // Exercise database with biomechanical models
  private exerciseDatabase: ExerciseProfile[] = [
    {
      name: "Squat",
      category: "compound",
      primary_muscles: ["quadriceps", "glutes", "hamstrings", "calves"],
      movement_pattern: "squat",
      critical_points: [
        {
          phase: "descent",
          joint: "knee",
          optimal_angle_range: [90, 135],
          critical_angle_thresholds: [70, 150],
          velocity_constraints: [-2, -0.5],
          force_patterns: ["eccentric_control"]
        },
        {
          phase: "bottom",
          joint: "hip",
          optimal_angle_range: [85, 95],
          critical_angle_thresholds: [70, 110],
          velocity_constraints: [-0.1, 0.1],
          force_patterns: ["isometric_stability"]
        },
        {
          phase: "ascent",
          joint: "knee",
          optimal_angle_range: [90, 180],
          critical_angle_thresholds: [80, 180],
          velocity_constraints: [0.5, 2.5],
          force_patterns: ["concentric_power"]
        }
      ],
      biomechanical_model: {
        phases: {
          descent: {
            duration_percentage: [40, 50],
            key_metrics: ["knee_angle", "hip_angle", "ankle_dorsiflexion"],
            common_errors: ["knee_valgus", "forward_lean", "heel_rise"]
          },
          bottom: {
            duration_percentage: [5, 15],
            key_metrics: ["depth", "stability", "center_of_mass"],
            common_errors: ["insufficient_depth", "forward_shift", "knee_cave"]
          },
          ascent: {
            duration_percentage: [35, 45],
            key_metrics: ["power_output", "symmetry", "timing"],
            common_errors: ["premature_extension", "hip_shift", "knee_valgus"]
          }
        },
        force_curves: {
          descent: [100, 95, 90, 85, 80, 75, 70],
          bottom: [70, 70, 70],
          ascent: [75, 85, 95, 105, 115, 110, 100]
        },
        muscle_activation_patterns: {
          quadriceps: [70, 75, 80, 85, 90, 95, 100, 95, 90, 85],
          glutes: [60, 65, 70, 80, 90, 100, 95, 85, 75, 65],
          hamstrings: [40, 45, 50, 60, 70, 80, 75, 65, 55, 45]
        }
      },
      injury_risk_factors: [
        {
          factor: "knee_valgus",
          description: "Inward collapse of knees during movement",
          detection_method: "video",
          threshold: 15, // degrees
          consequences: ["ACL injury", "patellofemoral pain", "IT band syndrome"],
          prevention: ["glute strengthening", "hip mobility", "proper cueing"]
        },
        {
          factor: "excessive_forward_lean",
          description: "Torso angle exceeds safe range",
          detection_method: "kinematics",
          threshold: 45, // degrees from vertical
          consequences: ["lower back strain", "lumbar disc compression"],
          prevention: ["ankle mobility", "core strengthening", "thoracic extension"]
        }
      ]
    },
    {
      name: "Bench Press",
      category: "compound",
      primary_muscles: ["pectorals", "triceps", "anterior_deltoids"],
      movement_pattern: "push",
      critical_points: [
        {
          phase: "descent",
          joint: "shoulder",
          optimal_angle_range: [45, 75],
          critical_angle_thresholds: [30, 90],
          velocity_constraints: [-1.5, -0.3],
          force_patterns: ["controlled_eccentric"]
        },
        {
          phase: "bottom",
          joint: "elbow",
          optimal_angle_range: [75, 90],
          critical_angle_thresholds: [60, 110],
          velocity_constraints: [-0.1, 0.1],
          force_patterns: ["stretch_reflex"]
        },
        {
          phase: "ascent",
          joint: "shoulder",
          optimal_angle_range: [45, 165],
          critical_angle_thresholds: [30, 180],
          velocity_constraints: [0.3, 2.0],
          force_patterns: ["explosive_concentric"]
        }
      ],
      biomechanical_model: {
        phases: {
          descent: {
            duration_percentage: [45, 55],
            key_metrics: ["shoulder_angle", "elbow_angle", "bar_path"],
            common_errors: ["uneven_descent", "bouncing", "flared_elbows"]
          },
          bottom: {
            duration_percentage: [5, 10],
            key_metrics: ["chest_touch", "pause_duration", "stability"],
            common_errors: ["incomplete_range", "excessive_pause", "shoulder_protraction"]
          },
          ascent: {
            duration_percentage: [35, 50],
            key_metrics: ["power_output", "bar_path", "lockout"],
            common_errors: ["sticking_point", "uneven_press", "incomplete_lockout"]
          }
        },
        force_curves: {
          descent: [100, 95, 90, 85, 80, 75, 70],
          bottom: [70, 72, 75],
          ascent: [80, 90, 100, 110, 105, 100, 95]
        },
        muscle_activation_patterns: {
          pectorals: [80, 85, 90, 95, 100, 95, 85, 75, 65],
          triceps: [60, 65, 70, 80, 90, 100, 95, 85, 75],
          anterior_deltoids: [70, 75, 80, 85, 90, 85, 80, 75, 70]
        }
      },
      injury_risk_factors: [
        {
          factor: "excessive_shoulder_abduction",
          description: "Elbows flared beyond 90 degrees",
          detection_method: "video",
          threshold: 90, // degrees
          consequences: ["shoulder impingement", "rotator cuff tear"],
          prevention: ["proper grip width", "shoulder blade retraction", "external rotation strength"]
        },
        {
          factor: "lumbar_hyperextension",
          description: "Excessive arch in lower back",
          detection_method: "kinematics",
          threshold: 30, // degrees
          consequences: ["lumbar strain", "disc compression"],
          prevention: ["core bracing", "leg positioning", "weight reduction"]
        }
      ]
    }
  ];

  /**
   * Initialize technique analysis for specific exercise
   */
  public startAnalysis(exerciseName: string): boolean {
    const exercise = this.exerciseDatabase.find(ex => 
      ex.name.toLowerCase() === exerciseName.toLowerCase()
    );
    
    if (!exercise) {
      console.warn(`Exercise "${exerciseName}" not found in database`);
      return false;
    }

    this.currentExercise = exercise;
    this.isAnalyzing = true;
    this.sensorBuffer = [];
    this.videoBuffer = [];
    
    console.log(`🎯 Started technique analysis for ${exerciseName}`);
    return true;
  }

  /**
   * Stop technique analysis
   */
  public stopAnalysis(): void {
    this.isAnalyzing = false;
    this.currentExercise = null;
    console.log('⏹️ Technique analysis stopped');
  }

  /**
   * Add sensor data point
   */
  public addSensorData(data: SensorData): void {
    if (!this.isAnalyzing || !this.currentExercise) return;

    this.sensorBuffer.push(data);
    
    // Maintain buffer size
    if (this.sensorBuffer.length > this.bufferSize) {
      this.sensorBuffer.shift();
    }

    // Analyze in real-time
    this.performRealtimeAnalysis();
  }

  /**
   * Add video frame data
   */
  public addVideoFrame(frame: VideoFrame): void {
    if (!this.isAnalyzing || !this.currentExercise) return;

    this.videoBuffer.push(frame);
    
    // Maintain buffer size
    if (this.videoBuffer.length > this.bufferSize) {
      this.videoBuffer.shift();
    }

    // Analyze in real-time
    this.performRealtimeAnalysis();
  }

  /**
   * Subscribe to real-time feedback
   */
  public onFeedback(callback: (feedback: TechniqueFeedback) => void): void {
    this.analysisCallbacks.push(callback);
  }

  /**
   * Perform real-time analysis
   */
  private performRealtimeAnalysis(): void {
    if (!this.currentExercise || this.sensorBuffer.length < 10) return;

    const biomechanics = this.calculateBiomechanics();
    const phase = this.detectMovementPhase();
    const feedback = this.analyzeTechnique(biomechanics, phase);

    if (feedback.length > 0) {
      feedback.forEach(fb => {
        this.analysisCallbacks.forEach(callback => callback(fb));
      });
    }
  }

  /**
   * Calculate biomechanical metrics from sensor data
   */
  private calculateBiomechanics(): BiomechanicsData {
    const recentData = this.sensorBuffer.slice(-10);
    const recentVideo = this.videoBuffer.slice(-5);

    // Calculate joint angles from video keypoints
    const jointAngles = this.calculateJointAngles(recentVideo);
    
    // Calculate velocity and acceleration from sensor data
    const velocity = this.calculateVelocity(recentData);
    const acceleration = this.calculateAcceleration(recentData);
    
    // Calculate power (simplified)
    const power = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2) * 70; // kg * m/s
    
    // Calculate range of motion
    const range_of_motion = this.calculateRangeOfMotion(recentVideo);
    
    // Calculate symmetry index
    const symmetry_index = this.calculateSymmetryIndex(recentVideo);

    return {
      jointAngles,
      velocity,
      acceleration,
      power,
      range_of_motion,
      symmetry_index
    };
  }

  /**
   * Detect current movement phase
   */
  private detectMovementPhase(): string {
    if (this.sensorBuffer.length < 5) return 'unknown';

    const recentVelocity = this.calculateVelocity(this.sensorBuffer.slice(-5));
    const verticalVelocity = recentVelocity.y;

    // Simple phase detection based on vertical velocity
    if (Math.abs(verticalVelocity) < 0.1) {
      return 'isometric';
    } else if (verticalVelocity < -0.1) {
      return 'eccentric';
    } else if (verticalVelocity > 0.1) {
      return 'concentric';
    }

    return 'transition';
  }

  /**
   * Analyze technique and generate feedback
   */
  private analyzeTechnique(biomechanics: BiomechanicsData, phase: string): TechniqueFeedback[] {
    if (!this.currentExercise) return [];

    const feedback: TechniqueFeedback[] = [];
    const criticalPoints = this.currentExercise.critical_points.filter(cp => cp.phase === phase);

    for (const point of criticalPoints) {
      const jointAngle = biomechanics.jointAngles[point.joint];
      if (jointAngle === undefined) continue;

      // Check if angle is within optimal range
      const [minOptimal, maxOptimal] = point.optimal_angle_range;
      const [minCritical, maxCritical] = point.critical_angle_thresholds;

      let severity: TechniqueFeedback['severity'] = 'info';
      let category: TechniqueFeedback['category'] = 'form';
      let title = '';
      let description = '';
      let correction = '';

      if (jointAngle < minCritical || jointAngle > maxCritical) {
        severity = 'critical';
        category = 'safety';
        title = `Critical ${point.joint} angle detected`;
        description = `${point.joint} angle (${jointAngle.toFixed(1)}°) is outside safe range`;
        correction = 'Stop exercise immediately and check form';
      } else if (jointAngle < minOptimal || jointAngle > maxOptimal) {
        severity = jointAngle < minOptimal - 10 || jointAngle > maxOptimal + 10 ? 'high' : 'medium';
        category = 'performance';
        title = `Suboptimal ${point.joint} angle`;
        description = `${point.joint} angle (${jointAngle.toFixed(1)}°) is outside optimal range`;
        correction = this.getAngleCorrectionAdvice(point.joint, jointAngle, point.optimal_angle_range);
      }

      if (title) {
        feedback.push({
          id: `${Date.now()}_${point.joint}_${phase}`,
          timestamp: Date.now(),
          exerciseName: this.currentExercise.name,
          phase: phase as any,
          severity,
          category,
          title,
          description,
          correction,
          confidence: 0.85 + Math.random() * 0.1,
          data: {
            actual_value: jointAngle,
            ideal_range: point.optimal_angle_range,
            deviation_percentage: this.calculateDeviation(jointAngle, point.optimal_angle_range)
          },
          prevention_tips: this.getPreventionTips(point.joint, this.currentExercise.name)
        });
      }
    }

    // Check for injury risk factors
    for (const riskFactor of this.currentExercise.injury_risk_factors) {
      const risk = this.assessInjuryRisk(riskFactor, biomechanics);
      if (risk > riskFactor.threshold) {
        feedback.push({
          id: `${Date.now()}_risk_${riskFactor.factor}`,
          timestamp: Date.now(),
          exerciseName: this.currentExercise.name,
          phase: phase as any,
          severity: 'high',
          category: 'safety',
          title: `Injury Risk: ${riskFactor.factor}`,
          description: riskFactor.description,
          correction: riskFactor.prevention.join(', '),
          confidence: 0.9,
          data: {
            actual_value: risk,
            ideal_range: [0, riskFactor.threshold],
            deviation_percentage: ((risk - riskFactor.threshold) / riskFactor.threshold) * 100
          },
          prevention_tips: riskFactor.prevention
        });
      }
    }

    return feedback;
  }

  /**
   * Calculate joint angles from video keypoints
   */
  private calculateJointAngles(frames: VideoFrame[]): { [jointName: string]: number } {
    if (frames.length === 0) return {};

    const latestFrame = frames[frames.length - 1];
    const keypoints = latestFrame.keypoints;

    // Find relevant keypoints
    const hip = keypoints.find(kp => kp.name === 'hip');
    const knee = keypoints.find(kp => kp.name === 'knee');
    const ankle = keypoints.find(kp => kp.name === 'ankle');
    const shoulder = keypoints.find(kp => kp.name === 'shoulder');
    const elbow = keypoints.find(kp => kp.name === 'elbow');
    const wrist = keypoints.find(kp => kp.name === 'wrist');

    const angles: { [jointName: string]: number } = {};

    // Calculate knee angle (hip-knee-ankle)
    if (hip && knee && ankle) {
      angles.knee = this.calculateAngle(hip, knee, ankle);
    }

    // Calculate hip angle (approximated from torso lean)
    if (hip && knee) {
      const verticalVector = { x: 0, y: 1 };
      const hipKneeVector = { x: knee.x - hip.x, y: knee.y - hip.y };
      angles.hip = this.calculateVectorAngle(verticalVector, hipKneeVector);
    }

    // Calculate elbow angle (shoulder-elbow-wrist)
    if (shoulder && elbow && wrist) {
      angles.elbow = this.calculateAngle(shoulder, elbow, wrist);
    }

    // Calculate shoulder angle (approximated)
    if (shoulder && elbow) {
      const horizontalVector = { x: 1, y: 0 };
      const shoulderElbowVector = { x: elbow.x - shoulder.x, y: elbow.y - shoulder.y };
      angles.shoulder = this.calculateVectorAngle(horizontalVector, shoulderElbowVector);
    }

    return angles;
  }

  /**
   * Calculate angle between three points
   */
  private calculateAngle(p1: Keypoint, p2: Keypoint, p3: Keypoint): number {
    const vector1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const vector2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const dot = vector1.x * vector2.x + vector1.y * vector2.y;
    const mag1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
    const mag2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);
    
    const cosAngle = dot / (mag1 * mag2);
    return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
  }

  /**
   * Calculate angle between two vectors
   */
  private calculateVectorAngle(v1: { x: number; y: number }, v2: { x: number; y: number }): number {
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
    const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
    
    const cosAngle = dot / (mag1 * mag2);
    return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
  }

  /**
   * Calculate velocity from sensor data
   */
  private calculateVelocity(data: SensorData[]): { x: number; y: number; z: number } {
    if (data.length < 2) return { x: 0, y: 0, z: 0 };

    const recent = data.slice(-2);
    const dt = (recent[1].timestamp - recent[0].timestamp) / 1000; // Convert to seconds

    return {
      x: (recent[1].accelerometer.x - recent[0].accelerometer.x) * dt,
      y: (recent[1].accelerometer.y - recent[0].accelerometer.y) * dt,
      z: (recent[1].accelerometer.z - recent[0].accelerometer.z) * dt
    };
  }

  /**
   * Calculate acceleration from sensor data
   */
  private calculateAcceleration(data: SensorData[]): { x: number; y: number; z: number } {
    if (data.length === 0) return { x: 0, y: 0, z: 0 };

    const latest = data[data.length - 1];
    return {
      x: latest.accelerometer.x,
      y: latest.accelerometer.y,
      z: latest.accelerometer.z
    };
  }

  /**
   * Calculate range of motion from video data
   */
  private calculateRangeOfMotion(frames: VideoFrame[]): number {
    if (frames.length < 5) return 0;

    // Simple ROM calculation based on keypoint movement
    const firstFrame = frames[0];
    const lastFrame = frames[frames.length - 1];

    if (firstFrame.keypoints.length === 0 || lastFrame.keypoints.length === 0) return 0;

    // Calculate movement of key joint (e.g., knee)
    const firstKnee = firstFrame.keypoints.find(kp => kp.name === 'knee');
    const lastKnee = lastFrame.keypoints.find(kp => kp.name === 'knee');

    if (!firstKnee || !lastKnee) return 0;

    const distance = Math.sqrt(
      (lastKnee.x - firstKnee.x) ** 2 + (lastKnee.y - firstKnee.y) ** 2
    );

    return distance * 100; // Convert to percentage
  }

  /**
   * Calculate symmetry index from video data
   */
  private calculateSymmetryIndex(frames: VideoFrame[]): number {
    if (frames.length === 0) return 100;

    const latestFrame = frames[frames.length - 1];
    const leftKnee = latestFrame.keypoints.find(kp => kp.name === 'left_knee');
    const rightKnee = latestFrame.keypoints.find(kp => kp.name === 'right_knee');

    if (!leftKnee || !rightKnee) return 100;

    // Simple symmetry calculation
    const heightDifference = Math.abs(leftKnee.y - rightKnee.y);
    const avgHeight = (leftKnee.y + rightKnee.y) / 2;
    
    const asymmetryPercentage = (heightDifference / avgHeight) * 100;
    return Math.max(0, 100 - asymmetryPercentage);
  }

  /**
   * Get correction advice for joint angles
   */
  private getAngleCorrectionAdvice(joint: string, actualAngle: number, optimalRange: [number, number]): string {
    const [min, max] = optimalRange;
    const corrections: { [key: string]: { low: string; high: string } } = {
      knee: {
        low: 'Increase squat depth, work on ankle and hip mobility',
        high: 'Avoid excessive depth, strengthen quadriceps and glutes'
      },
      hip: {
        low: 'Maintain more upright torso, strengthen core',
        high: 'Hinge more at hips, work on posterior chain'
      },
      shoulder: {
        low: 'Improve shoulder mobility, retract shoulder blades',
        high: 'Avoid over-abduction, strengthen rotator cuff'
      },
      elbow: {
        low: 'Complete full range of motion, check grip width',
        high: 'Control the descent, avoid hyperextension'
      }
    };

    const jointCorrections = corrections[joint];
    if (!jointCorrections) return 'Adjust form and consult a trainer';

    return actualAngle < min ? jointCorrections.low : jointCorrections.high;
  }

  /**
   * Get prevention tips for specific joint and exercise
   */
  private getPreventionTips(joint: string, exerciseName: string): string[] {
    const tips: { [key: string]: { [exercise: string]: string[] } } = {
      knee: {
        Squat: [
          'Warm up with dynamic leg swings',
          'Strengthen glute medius',
          'Practice wall sits for form',
          'Use box squats to learn depth'
        ],
        'Bench Press': ['Keep feet planted firmly', 'Avoid leg drive excess']
      },
      shoulder: {
        'Bench Press': [
          'Retract shoulder blades before lifting',
          'Warm up with band pull-aparts',
          'Strengthen rear deltoids',
          'Practice scapular wall slides'
        ]
      }
    };

    return tips[joint]?.[exerciseName] || [
      'Proper warm-up is essential',
      'Progress weight gradually',
      'Focus on movement quality over quantity',
      'Consider working with a qualified trainer'
    ];
  }

  /**
   * Assess injury risk based on risk factor
   */
  private assessInjuryRisk(riskFactor: InjuryRiskFactor, biomechanics: BiomechanicsData): number {
    switch (riskFactor.factor) {
      case 'knee_valgus':
        // Simplified valgus detection based on symmetry
        return 100 - biomechanics.symmetry_index;
      
      case 'excessive_forward_lean':
        // Use hip angle as proxy for forward lean
        const hipAngle = biomechanics.jointAngles.hip || 90;
        return Math.max(0, hipAngle - 30); // 30 degrees is threshold
      
      case 'excessive_shoulder_abduction':
        const shoulderAngle = biomechanics.jointAngles.shoulder || 45;
        return Math.max(0, shoulderAngle - 75); // 75 degrees is threshold
      
      case 'lumbar_hyperextension':
        // Simplified based on acceleration patterns
        return Math.abs(biomechanics.acceleration.y) * 10;
      
      default:
        return 0;
    }
  }

  /**
   * Calculate deviation percentage from optimal range
   */
  private calculateDeviation(actual: number, optimalRange: [number, number]): number {
    const [min, max] = optimalRange;
    const center = (min + max) / 2;
    const range = max - min;
    
    return Math.abs((actual - center) / range) * 100;
  }

  /**
   * Get supported exercises
   */
  public getSupportedExercises(): string[] {
    return this.exerciseDatabase.map(ex => ex.name);
  }

  /**
   * Get exercise profile
   */
  public getExerciseProfile(exerciseName: string): ExerciseProfile | null {
    return this.exerciseDatabase.find(ex => 
      ex.name.toLowerCase() === exerciseName.toLowerCase()
    ) || null;
  }
}

export const techniqueAnalysisAI = new TechniqueAnalysisAI();