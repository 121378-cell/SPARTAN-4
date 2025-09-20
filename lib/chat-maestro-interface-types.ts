// Interface integration types for Chat Maestro

export interface SpartanView {
  id: string;
  name: string;
  path: string;
  icon?: string;
  description: string;
  requiredPermissions?: string[];
}

export interface ViewNavigationRequest {
  targetView: SpartanView;
  contextData?: {
    [key: string]: any;
  };
  returnToConversation?: boolean;
  overlayMode?: boolean;
}

export interface ConversationContext {
  currentTopic: string;
  userIntent: string;
  relevantDataPoints: string[];
  conversationHistory: ConversationMessage[];
  activeView?: SpartanView;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    viewType?: string;
    dataReference?: string;
    actionType?: string;
  };
}

export interface VisualizationRequest {
  type: 'chart' | 'table' | 'dashboard' | 'graph' | 'timeline';
  data: any;
  title: string;
  description?: string;
  interactiveElements?: InteractiveElement[];
}

export interface InteractiveElement {
  id: string;
  type: 'button' | 'link' | 'dropdown' | 'slider';
  label: string;
  action: string;
  data?: any;
}

export interface InterfaceIntegrationSettings {
  enableVisualRedirection: boolean;
  defaultViewMode: 'modal' | 'drawer' | 'fullscreen' | 'inline';
  autoReturnToConversation: boolean;
  conversationOverlayOpacity: number; // 0-1
  quickActionButtons: boolean;
  voiceCommandIntegration: boolean;
}

export interface RedirectionTrigger {
  id: string;
  pattern: RegExp;
  view: SpartanView;
  confidenceThreshold: number; // 0-100
  contextRequirements?: string[];
}

export interface HybridViewComponent {
  id: string;
  componentType: 'chart' | 'graph' | 'table' | 'image' | 'video';
  dataBinding: string; // Reference to conversation data
  position: 'inline' | 'sidebar' | 'overlay';
  size: 'small' | 'medium' | 'large';
  interactive: boolean;
}

export interface UserInterfaceState {
  currentView: SpartanView | null;
  conversationVisible: boolean;
  visualizationVisible: boolean;
  overlayActive: boolean;
  quickActionsVisible: boolean;
  lastInteractionTimestamp: Date;
}

export interface InterfaceEvent {
  type: 'view_opened' | 'view_closed' | 'data_requested' | 'user_interacted' | 'conversation_resumed';
  payload: any;
  timestamp: Date;
  source: 'chat_maestro' | 'user' | 'spartan_interface';
}

export interface InterfaceIntegrationAnalytics {
  redirectionsTriggered: number;
  viewsOpened: {
    [viewId: string]: number;
  };
  userEngagement: {
    conversationTime: number;
    visualizationTime: number;
    hybridInteractionTime: number;
  };
  successMetrics: {
    tasksCompleted: number;
    userSatisfaction: number; // 1-5
    featureAdoption: number; // 0-100
  };
}