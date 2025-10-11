import { generateAllScenarios, analyzeScenarios, generateReport, exportToCSV } from '../strategyAnalyzer';

/**
 * Tests the comprehensive strategy analysis
 * 
 * This test validates that our strategy analyzer can:
 * 1. Generate all 350 unique scenarios
 * 2. Analyze them for inconsistencies
 * 3. Generate reports
 * 4. Export to CSV
 */

describe('Strategy Analysis', () => {
  it('should generate all possible scenarios', () => {
    const scenarios = generateAllScenarios();
    
    // Should have approximately 350 scenarios
    expect(scenarios.length).toBeGreaterThan(300);
    expect(scenarios.length).toBeLessThan(400);
    
    // Should have all dealer upcards
    const dealerUpcards = new Set(scenarios.map(s => s.dealerUpcard));
    expect(dealerUpcards.size).toBe(10);
    expect(dealerUpcards.has('A')).toBe(true);
    expect(dealerUpcards.has('10')).toBe(true);
    
    // Should have various hand types
    const handTypes = new Set(scenarios.map(s => s.playerHand.split(' ')[0]));
    expect(handTypes.has('Hard')).toBe(true);
    expect(handTypes.has('Soft')).toBe(true);
    expect(handTypes.has('Pair')).toBe(true);
    expect(handTypes.has('Blackjack')).toBe(true);
  });

  it('should analyze scenarios correctly', () => {
    const scenarios = generateAllScenarios();
    const analysis = analyzeScenarios(scenarios);
    
    expect(analysis.totalScenarios).toBe(scenarios.length);
    expect(analysis.scenariosByAction).toBeDefined();
    expect(analysis.scenariosByConfidence).toBeDefined();
    expect(analysis.inconsistencies).toBeDefined();
    expect(analysis.edgeCases).toBeDefined();
    
    // Should have all major actions
    expect(analysis.scenariosByAction['hit']).toBeGreaterThan(0);
    expect(analysis.scenariosByAction['stand']).toBeGreaterThan(0);
    expect(analysis.scenariosByAction['double-down']).toBeGreaterThan(0);
    expect(analysis.scenariosByAction['split']).toBeGreaterThan(0);
    
    // Should have confidence levels
    expect(analysis.scenariosByConfidence['high']).toBeGreaterThan(0);
    expect(analysis.scenariosByConfidence['medium']).toBeGreaterThan(0);
  });

  it('should generate a readable report', () => {
    const report = generateReport();
    
    expect(report).toContain('# Blackjack Strategy Analysis Report');
    expect(report).toContain('## Summary');
    expect(report).toContain('## Actions Distribution');
    expect(report).toContain('## Confidence Distribution');
    expect(report).toContain('Total Scenarios');
    expect(report).toContain('hit');
    expect(report).toContain('stand');
    expect(report).toContain('double-down');
    expect(report).toContain('split');
  });

  it('should export to CSV format', () => {
    const csv = exportToCSV();
    
    expect(csv).toContain('Player Hand,Player Total,Is Soft,Is Pair,Is Blackjack,Dealer Upcard,Primary Action,Confidence,Reasoning');
    expect(csv.split('\n').length).toBeGreaterThan(300); // Should have many rows
    
    // Should contain various actions
    expect(csv).toContain('hit');
    expect(csv).toContain('stand');
    expect(csv).toContain('double-down');
    expect(csv).toContain('split');
  });

  it('should identify edge cases and inconsistencies', () => {
    const scenarios = generateAllScenarios();
    const analysis = analyzeScenarios(scenarios);
    
    // Log some statistics for debugging
    console.log(`Total scenarios: ${analysis.totalScenarios}`);
    console.log(`Actions:`, analysis.scenariosByAction);
    console.log(`Confidence:`, analysis.scenariosByConfidence);
    console.log(`Inconsistencies: ${analysis.inconsistencies.length}`);
    console.log(`Edge cases: ${analysis.edgeCases.length}`);
    
    // Should have reasonable distribution
    expect(analysis.scenariosByAction['hit']).toBeGreaterThan(50);
    expect(analysis.scenariosByAction['stand']).toBeGreaterThan(50);
    expect(analysis.scenariosByAction['double-down']).toBeGreaterThan(10);
    expect(analysis.scenariosByAction['split']).toBeGreaterThan(10);
    
    // Most scenarios should have high confidence
    expect(analysis.scenariosByConfidence['high']).toBeGreaterThan(analysis.scenariosByConfidence['low']);
  });

  it('should handle all hand types correctly', () => {
    const scenarios = generateAllScenarios();
    
    // Check for hard totals
    const hardTotals = scenarios.filter(s => s.playerHand.startsWith('Hard'));
    expect(hardTotals.length).toBeGreaterThan(100);
    
    // Check for soft totals
    const softTotals = scenarios.filter(s => s.playerHand.startsWith('Soft'));
    expect(softTotals.length).toBeGreaterThan(50);
    
    // Check for pairs
    const pairs = scenarios.filter(s => s.playerHand.startsWith('Pair'));
    expect(pairs.length).toBeGreaterThan(50);
    
    // Check for blackjack
    const blackjacks = scenarios.filter(s => s.playerHand === 'Blackjack');
    expect(blackjacks.length).toBe(10); // Should have exactly 10 (one for each dealer upcard)
  });

  it('should have reasonable confidence scores', () => {
    const scenarios = generateAllScenarios();
    
    scenarios.forEach(scenario => {
      expect(scenario.confidence).toBeGreaterThan(0);
      expect(scenario.confidence).toBeLessThanOrEqual(100);
      expect(scenario.reasoning).toBeTruthy();
      expect(scenario.reasoning.length).toBeGreaterThan(10);
    });
    
    // Most scenarios should have high confidence
    const highConfidence = scenarios.filter(s => s.confidence >= 90);
    expect(highConfidence.length).toBeGreaterThan(scenarios.length * 0.7);
  });
});
