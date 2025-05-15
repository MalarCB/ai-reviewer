import { Config } from '../config';
import * as core from '@actions/core';

// Create manual mocks for core functions
const mockGetInput = jest.fn().mockImplementation(() => '');
const mockGetMultilineInput = jest.fn().mockImplementation(() => []);

// Mock the entire module
jest.mock('@actions/core', () => ({
  getInput: (...args: any[]) => mockGetInput(...args),
  getMultilineInput: (...args: any[]) => mockGetMultilineInput(...args),
  info: jest.fn(),
  warning: jest.fn()
}));

describe('Config', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockGetInput.mockImplementation(() => '');
    mockGetMultilineInput.mockImplementation(() => []);
    
    // Reset environment
    process.env = { ...originalEnv };
  });
  
  afterAll(() => {
    process.env = originalEnv;
  });
  
  test('throws error when GITHUB_TOKEN is not set', () => {
    process.env.GITHUB_TOKEN = '';
    process.env.LLM_API_KEY = 'test-api-key';
    process.env.LLM_MODEL = 'test-model';
    
    expect(() => new Config()).toThrow('GITHUB_TOKEN is not set');
  });
  
  test('throws error when LLM_API_KEY is not set', () => {
    process.env.GITHUB_TOKEN = 'test-token';
    process.env.LLM_API_KEY = '';
    process.env.LLM_MODEL = 'test-model';
    
    expect(() => new Config()).toThrow('LLM_API_KEY is not set');
  });
  
  test('throws error when LLM_MODEL is not set', () => {
    process.env.GITHUB_TOKEN = 'test-token';
    process.env.LLM_API_KEY = 'test-api-key';
    process.env.LLM_MODEL = '';
    
    expect(() => new Config()).toThrow('LLM_MODEL is not set');
  });
  
  test('loads style guide rules from action inputs', () => {
    process.env.GITHUB_TOKEN = 'test-token';
    process.env.LLM_API_KEY = 'test-api-key';
    process.env.LLM_MODEL = 'test-model';
    process.env.DEBUG = '';
    
    const styleGuideRules = ['Rule 1', 'Rule 2', 'Rule 3'];
    mockGetMultilineInput.mockImplementation((name) => {
      if (name === 'style_guide_rules') return styleGuideRules;
      return [];
    });
    
    const config = new Config();
    config.loadInputs();
    
    expect(config.styleGuideRules).toBe(styleGuideRules.join('\n'));
  });
  
//   test('skips loading inputs when DEBUG is set', () => {
//     process.env.GITHUB_TOKEN = 'test-token';
//     process.env.LLM_API_KEY = 'test-api-key';
//     process.env.LLM_MODEL = 'test-model';
//     process.env.DEBUG = 'true';
//     process.env.STYLE_GUIDE_RULES = 'Debug rule';
    
//     const config = new Config();
//     config.loadInputs();
    
//     expect(config.styleGuideRules).toBe('Debug rule');
//     expect(core.getMultilineInput).not.toHaveBeenCalled();
//   });
}); 