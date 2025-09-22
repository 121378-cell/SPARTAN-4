import { AutonomousLearningEngine } from '../lib/autonomous-learning-engine';
import { spartanNervousSystem } from '../lib/spartan-nervous-system';
import { logger } from '../lib/logger';

// Mock the storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    getItem: jest.fn().mockReturnValue(null),
    setItem: jest.fn()
  }
}));

// Mock the logger
jest.mock('../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

// Mock the Spartan Nervous System
jest.mock('../lib/spartan-nervous-system', () => ({
  spartanNervousSystem: {
    emitEvent: jest.fn()
  }
}));

describe('AutonomousLearningEngine', () => {
  let learningEngine: AutonomousLearningEngine;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance of the learning engine
    learningEngine = AutonomousLearningEngine.getInstance();
  });
  
  afterEach(() => {
    // Reset the singleton instance for each test
    // @ts-ignore - accessing private property for testing
    AutonomousLearningEngine.instance = null;
  });
  
  describe('Initialization', () => {
    it('should initialize with research sources', () => {
      // @ts-ignore - accessing private property for testing
      const sources = learningEngine.researchSources;
      expect(sources.length).toBeGreaterThan(0);
      expect(sources.some(source => source.id === 'pubmed')).toBeTruthy();
      expect(sources.some(source => source.id === 'arxiv')).toBeTruthy();
    });
    
    it('should initialize with connectors', () => {
      // @ts-ignore - accessing private property for testing
      const connectors = learningEngine.connectors;
      expect(connectors.size).toBeGreaterThan(0);
      expect(connectors.has('pubmed')).toBeTruthy();
      expect(connectors.has('arxiv')).toBeTruthy();
    });
  });
  
  describe('Learning Process Control', () => {
    it('should start learning process', () => {
      learningEngine.startLearning();
      // @ts-ignore - accessing private property for testing
      expect(learningEngine.isLearningActive).toBe(true);
    });
    
    it('should stop learning process', () => {
      learningEngine.startLearning();
      learningEngine.stopLearning();
      // @ts-ignore - accessing private property for testing
      expect(learningEngine.isLearningActive).toBe(false);
    });
  });
  
  describe('Knowledge Base Operations', () => {
    it('should extract knowledge from research papers', async () => {
      // @ts-ignore - accessing private method for testing
      const papers = learningEngine.generateSimulatedResearchPapers('test', ['fitness']);
      // @ts-ignore - accessing private method for testing
      const knowledge = await learningEngine.extractKnowledge(papers);
      
      expect(knowledge.length).toBeGreaterThan(0);
      expect(knowledge[0].findings.length).toBeGreaterThan(0);
      expect(knowledge[0].applications.length).toBeGreaterThan(0);
    });
    
    it('should validate knowledge items', async () => {
      // @ts-ignore - accessing private method for testing
      const papers = learningEngine.generateSimulatedResearchPapers('test', ['fitness']);
      // @ts-ignore - accessing private method for testing
      const knowledge = await learningEngine.extractKnowledge(papers);
      // @ts-ignore - accessing private method for testing
      const validated = await learningEngine.validateKnowledge(knowledge);
      
      expect(validated.length).toBeGreaterThan(0);
      expect(['validated', 'rejected']).toContain(validated[0].validationStatus);
    });
    
    it('should integrate validated knowledge', async () => {
      // @ts-ignore - accessing private method for testing
      const papers = learningEngine.generateSimulatedResearchPapers('test', ['fitness']);
      // @ts-ignore - accessing private method for testing
      const knowledge = await learningEngine.extractKnowledge(papers);
      // @ts-ignore - accessing private method for testing
      const validated = await learningEngine.validateKnowledge(knowledge);
      
      // Make all items validated for testing
      validated.forEach(item => {
        item.validationStatus = 'validated';
      });
      
      // @ts-ignore - accessing private method for testing
      const integrated = await learningEngine.integrateKnowledge(validated);
      
      expect(integrated.length).toBeGreaterThan(0);
      expect(integrated[0].integrationStatus).toBe('integrated');
    });
  });
  
  describe('Knowledge Base Search', () => {
    beforeEach(async () => {
      // Add some test knowledge to the knowledge base
      // @ts-ignore - accessing private method for testing
      const papers = learningEngine.generateSimulatedResearchPapers('test', ['fitness']);
      // @ts-ignore - accessing private method for testing
      const knowledge = await learningEngine.extractKnowledge(papers);
      
      // Make all items validated for testing
      knowledge.forEach(item => {
        item.validationStatus = 'validated';
        item.integrationStatus = 'integrated';
      });
      
      // @ts-ignore - accessing private method for testing
      await learningEngine.integrateKnowledge(knowledge);
    });
    
    it('should search knowledge by category', () => {
      const results = learningEngine.searchKnowledgeByCategory('fitness');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].category).toBe('fitness');
    });
    
    it('should search knowledge by keyword', () => {
      const results = learningEngine.searchKnowledgeByKeyword('fitness');
      expect(results.length).toBeGreaterThan(0);
    });
  });
  
  describe('Knowledge Base Statistics', () => {
    it('should return knowledge base statistics', () => {
      const stats = learningEngine.getKnowledgeBaseStats();
      expect(stats).toHaveProperty('totalItems');
      expect(stats).toHaveProperty('validatedItems');
      expect(stats).toHaveProperty('integratedItems');
      expect(stats).toHaveProperty('pendingItems');
      expect(stats).toHaveProperty('rejectedItems');
      expect(stats).toHaveProperty('categories');
    });
  });
  
  describe('Learning History', () => {
    it('should return learning history', () => {
      const history = learningEngine.getLearningHistory();
      expect(Array.isArray(history)).toBeTruthy();
    });
  });
  
  describe('Knowledge Versions', () => {
    it('should return knowledge versions', () => {
      const versions = learningEngine.getKnowledgeVersions('test-id');
      expect(Array.isArray(versions)).toBeTruthy();
    });
  });
  
  describe('External Source Connectors', () => {
    it('should fetch papers from PubMed connector', async () => {
      // @ts-ignore - accessing private property for testing
      const connector = learningEngine.connectors.get('pubmed');
      const papers = await connector!.fetchPapers(['fitness']);
      
      expect(papers.length).toBeGreaterThan(0);
      expect(papers[0]).toHaveProperty('title');
      expect(papers[0]).toHaveProperty('authors');
      expect(papers[0]).toHaveProperty('abstract');
    });
    
    it('should fetch papers from arXiv connector', async () => {
      // @ts-ignore - accessing private property for testing
      const connector = learningEngine.connectors.get('arxiv');
      const papers = await connector!.fetchPapers(['nutrition']);
      
      expect(papers.length).toBeGreaterThan(0);
      expect(papers[0]).toHaveProperty('title');
      expect(papers[0]).toHaveProperty('authors');
      expect(papers[0]).toHaveProperty('abstract');
    });
  });
});