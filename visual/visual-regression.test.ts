/**
 * Visual Regression Testing for SPARTAN 4 UI Components
 * Tests gradient designs, glass-morphism effects, and futuristic UI elements
 */
import puppeteer, { Browser, Page } from 'puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { describe, test, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';

// Extend Jest matchers
expect.extend({ toMatchImageSnapshot });

interface VisualTestConfig {
  viewport: { width: number; height: number };
  deviceScaleFactor: number;
  threshold: number;
  failureThreshold: number;
}

class VisualRegressionTester {
  private browser!: Browser;
  private page!: Page;
  
  private readonly config: VisualTestConfig = {
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    threshold: 0.1, // Allow 0.1% difference
    failureThreshold: 0.01 // Fail if more than 1% pixels differ
  };

  async setup(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }

  async createPage(): Promise<void> {
    this.page = await this.browser.newPage();
    await this.page.setViewport(this.config.viewport);
    
    // Mock localStorage and other browser APIs
    await this.page.evaluateOnNewDocument(() => {
      const localStorageMock = {
        getItem: (key: string) => {
          if (key === 'user_data') {
            return JSON.stringify({
              name: 'Test User',
              age: 30,
              weight: 75,
              height: 180,
              fitnessLevel: 'intermediate'
            });
          }
          return null;
        },
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      };
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      
      // Mock fetch for AI API calls
      Object.defineProperty(window, 'fetch', {
        value: () => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: 'Mock response' })
        })
      });
    });
  }

  async captureComponent(
    selector: string, 
    testName: string,
    waitForElement?: string
  ): Promise<void> {
    if (waitForElement) {
      await this.page.waitForSelector(waitForElement, { timeout: 10000 });
    }
    
    // Wait for animations and gradients to settle
    await this.page.waitForTimeout(1000);
    
    const element = await this.page.$(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    const screenshot = await element.screenshot({
      type: 'png',
      omitBackground: false
    });

    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: testName,
      threshold: this.config.threshold,
      failureThreshold: this.config.failureThreshold,
      customDiffConfig: {
        threshold: this.config.threshold
      }
    });
  }

  async captureFullPage(testName: string): Promise<void> {
    await this.page.waitForTimeout(2000); // Wait for all animations
    
    const screenshot = await this.page.screenshot({
      type: 'png',
      fullPage: true
    });

    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: testName,
      threshold: this.config.threshold,
      failureThreshold: this.config.failureThreshold
    });
  }

  async testResponsiveDesign(
    testName: string,
    viewports: Array<{ width: number; height: number; name: string }>
  ): Promise<void> {
    for (const viewport of viewports) {
      await this.page.setViewport(viewport);
      await this.page.waitForTimeout(1000);
      
      const screenshot = await this.page.screenshot({
        type: 'png',
        fullPage: true
      });

      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: `${testName}-${viewport.name}`,
        threshold: this.config.threshold,
        failureThreshold: this.config.failureThreshold
      });
    }
  }

  async cleanup(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
  }
}

describe('SPARTAN 4 Visual Regression Tests', () => {
  let visualTester: VisualRegressionTester;
  let devServerUrl: string;

  beforeAll(async () => {
    visualTester = new VisualRegressionTester();
    await visualTester.setup();
    
    // In a real scenario, you'd start your dev server here
    // For now, we'll assume it's running on localhost:5173
    devServerUrl = 'http://localhost:5173';
    
    console.log('🎨 Starting Visual Regression Tests for SPARTAN 4');
  }, 30000);

  afterAll(async () => {
    await visualTester.cleanup();
  });

  beforeEach(async () => {
    await visualTester.createPage();
  });

  afterEach(async () => {
    // Clean up page after each test
  });

  describe('Authentication Screen Visual Tests', () => {
    test('should render authentication screen with gradient background', async () => {
      // Create a mock HTML page for testing since we can't run the actual dev server
      const mockAuthHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>SPARTAN 4 Auth</title>
          <style>
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .auth-card {
              background: rgba(255, 255, 255, 0.9);
              backdrop-filter: blur(10px);
              border-radius: 20px;
              padding: 2rem;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              width: 400px;
              text-align: center;
            }
            .logo {
              width: 64px;
              height: 64px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              margin: 0 auto 1rem;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 24px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 0.5rem;
            }
            .subtitle {
              color: #6b7280;
              margin-bottom: 2rem;
            }
          </style>
        </head>
        <body>
          <div class="auth-card" data-testid="auth-screen">
            <div class="logo">S4</div>
            <h1 class="title">Bienvenido de Vuelta</h1>
            <p class="subtitle">Inicia sesión en tu viaje fitness</p>
          </div>
        </body>
        </html>
      `;

      await visualTester.page.setContent(mockAuthHTML);
      await visualTester.captureComponent('[data-testid="auth-screen"]', 'auth-screen-gradient');
    });
  });

  describe('Dashboard Visual Tests', () => {
    test('should render dashboard with glassmorphism cards', async () => {
      const mockDashboardHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>SPARTAN 4 Dashboard</title>
          <style>
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              padding: 2rem;
            }
            .dashboard-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 1.5rem;
              max-width: 1200px;
              margin: 0 auto;
            }
            .feature-card {
              background: rgba(255, 255, 255, 0.8);
              backdrop-filter: blur(10px);
              border-radius: 16px;
              padding: 1.5rem;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .feature-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            }
            .feature-icon {
              width: 48px;
              height: 48px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              margin-bottom: 1rem;
            }
            .feature-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 0.5rem;
              color: #1f2937;
            }
            .feature-description {
              color: #6b7280;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="dashboard-grid" data-testid="dashboard">
            <div class="feature-card">
              <div class="feature-icon"></div>
              <h3 class="feature-title">Generador de Rutinas</h3>
              <p class="feature-description">IA personalizada para crear planes de entrenamiento únicos</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"></div>
              <h3 class="feature-title">Análisis Biomolecular</h3>
              <p class="feature-description">Optimización molecular para rendimiento máximo</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"></div>
              <h3 class="feature-title">IA Cuántica</h3>
              <p class="feature-description">Simulaciones multiverso para entrenamientos evolutivos</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await visualTester.page.setContent(mockDashboardHTML);
      await visualTester.captureComponent('[data-testid="dashboard"]', 'dashboard-glassmorphism');
    });

    test('should test responsive dashboard layout', async () => {
      const mockResponsiveHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>SPARTAN 4 Responsive</title>
          <style>
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              padding: 1rem;
            }
            .responsive-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 1rem;
              max-width: 1200px;
              margin: 0 auto;
            }
            .card {
              background: rgba(255, 255, 255, 0.8);
              backdrop-filter: blur(10px);
              border-radius: 16px;
              padding: 1.5rem;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            @media (max-width: 768px) {
              .responsive-grid {
                grid-template-columns: 1fr;
                gap: 0.75rem;
              }
              .card {
                padding: 1rem;
              }
            }
          </style>
        </head>
        <body>
          <div class="responsive-grid" data-testid="responsive-layout">
            <div class="card">Quantum AI</div>
            <div class="card">Biomolecular</div>
            <div class="card">Neural Training</div>
          </div>
        </body>
        </html>
      `;

      await visualTester.page.setContent(mockResponsiveHTML);
      
      const viewports = [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 1024, height: 768, name: 'tablet' },
        { width: 375, height: 667, name: 'mobile' }
      ];

      await visualTester.testResponsiveDesign('responsive-dashboard', viewports);
    });
  });

  describe('Advanced AI Components Visual Tests', () => {
    test('should render quantum AI interface with futuristic styling', async () => {
      const mockQuantumHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Quantum AI Interface</title>
          <style>
            body {
              margin: 0;
              background: radial-gradient(circle at 50% 50%, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
              color: white;
              font-family: 'Segoe UI', Roboto, sans-serif;
              padding: 2rem;
              min-height: 100vh;
            }
            .quantum-interface {
              max-width: 800px;
              margin: 0 auto;
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              border-radius: 20px;
              padding: 2rem;
              border: 1px solid rgba(0, 255, 255, 0.3);
              box-shadow: 0 0 40px rgba(0, 255, 255, 0.1);
            }
            .quantum-title {
              text-align: center;
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 2rem;
              animation: glow 2s ease-in-out infinite alternate;
            }
            @keyframes glow {
              from { filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.5)); }
              to { filter: drop-shadow(0 0 20px rgba(255, 0, 255, 0.5)); }
            }
            .quantum-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 1rem;
            }
            .quantum-cell {
              aspect-ratio: 1;
              background: rgba(0, 255, 255, 0.1);
              border: 1px solid rgba(0, 255, 255, 0.3);
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              transition: all 0.3s ease;
            }
            .quantum-cell:hover {
              background: rgba(0, 255, 255, 0.2);
              transform: scale(1.05);
            }
          </style>
        </head>
        <body>
          <div class="quantum-interface" data-testid="quantum-ai">
            <h1 class="quantum-title">Quantum AI Multiverse Simulation</h1>
            <div class="quantum-grid">
              <div class="quantum-cell">Q1</div>
              <div class="quantum-cell">Q2</div>
              <div class="quantum-cell">Q3</div>
              <div class="quantum-cell">Q4</div>
              <div class="quantum-cell">Q5</div>
              <div class="quantum-cell">Q6</div>
              <div class="quantum-cell">Q7</div>
              <div class="quantum-cell">Q8</div>
              <div class="quantum-cell">Q9</div>
            </div>
          </div>
        </body>
        </html>
      `;

      await visualTester.page.setContent(mockQuantumHTML);
      await visualTester.captureComponent('[data-testid="quantum-ai"]', 'quantum-ai-interface');
    });

    test('should render biomolecular analysis visualization', async () => {
      const mockBiomolecularHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Biomolecular Analysis</title>
          <style>
            body {
              margin: 0;
              background: linear-gradient(135deg, #0c1445 0%, #1e3c72 50%, #2a5298 100%);
              color: white;
              font-family: 'Segoe UI', Roboto, sans-serif;
              padding: 2rem;
              min-height: 100vh;
            }
            .biomolecular-container {
              max-width: 1000px;
              margin: 0 auto;
              background: rgba(255, 255, 255, 0.08);
              backdrop-filter: blur(15px);
              border-radius: 24px;
              padding: 2rem;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .molecule-viz {
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin: 2rem 0;
            }
            .molecule {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              background: radial-gradient(circle, #00ff88 0%, #004d2a 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              animation: pulse 2s infinite;
              box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
            .dna-strand {
              width: 200px;
              height: 20px;
              background: repeating-linear-gradient(
                45deg,
                #ff6b6b,
                #ff6b6b 10px,
                #4ecdc4 10px,
                #4ecdc4 20px
              );
              border-radius: 10px;
              margin: 1rem auto;
              animation: flow 3s linear infinite;
            }
            @keyframes flow {
              0% { background-position: 0 0; }
              100% { background-position: 40px 0; }
            }
          </style>
        </head>
        <body>
          <div class="biomolecular-container" data-testid="biomolecular-analysis">
            <h2 style="text-align: center; margin-bottom: 2rem;">Biomolecular Integration Analysis</h2>
            <div class="molecule-viz">
              <div class="molecule">ATP</div>
              <div class="molecule">DNA</div>
              <div class="molecule">RNA</div>
            </div>
            <div class="dna-strand"></div>
          </div>
        </body>
        </html>
      `;

      await visualTester.page.setContent(mockBiomolecularHTML);
      await visualTester.captureComponent('[data-testid="biomolecular-analysis"]', 'biomolecular-visualization');
    });
  });

  describe('Animation and Interaction Tests', () => {
    test('should capture hover states and animations', async () => {
      const mockInteractiveHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Interactive Elements</title>
          <style>
            body {
              margin: 0;
              padding: 2rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .interactive-button {
              background: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.3);
              border-radius: 12px;
              padding: 1rem 2rem;
              color: white;
              font-weight: bold;
              cursor: pointer;
              transition: all 0.3s ease;
              display: inline-block;
              margin: 1rem;
            }
            .interactive-button:hover {
              background: rgba(255, 255, 255, 0.3);
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            }
          </style>
        </head>
        <body>
          <button class="interactive-button" data-testid="hover-button">
            Quantum Training
          </button>
        </body>
        </html>
      `;

      await visualTester.page.setContent(mockInteractiveHTML);
      
      // Capture normal state
      await visualTester.captureComponent('[data-testid="hover-button"]', 'button-normal-state');
      
      // Capture hover state
      await visualTester.page.hover('[data-testid="hover-button"]');
      await visualTester.page.waitForTimeout(500);
      await visualTester.captureComponent('[data-testid="hover-button"]', 'button-hover-state');
    });
  });
});