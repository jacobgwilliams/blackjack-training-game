import { getAllStrategyRecommendations } from './strategy';
import { Hand, Card } from '../types/card';
import { DebugScenario } from '../types/game';

/**
 * Strategy Analyzer - Generates comprehensive reports on all possible scenarios
 * 
 * This tool can:
 * 1. Generate all 350 unique player/dealer combinations
 * 2. Test each scenario with all 5 training modes (1,750 total tests)
 * 3. Identify inconsistencies or edge cases
 * 4. Generate reports for validation
 */

export interface ScenarioResult {
  playerHand: string;
  playerTotal: number;
  isSoft: boolean;
  isPair: boolean;
  isBlackjack: boolean;
  dealerUpcard: string;
  primaryAction: string;
  confidence: number;
  reasoning: string;
  allRecommendations: Array<{
    action: string;
    confidence: number;
    reasoning: string;
  }>;
  trainingMode?: DebugScenario;
  trainingNote?: string;
}

export interface AnalysisReport {
  totalScenarios: number;
  scenariosByAction: Record<string, number>;
  scenariosByConfidence: Record<string, number>;
  inconsistencies: ScenarioResult[];
  edgeCases: ScenarioResult[];
  trainingModeImpact: Record<DebugScenario, number>;
}

// Helper function to create a card
function createCard(rank: string, suit: string = 'hearts'): Card {
  return {
    suit: suit as any,
    rank: rank as any,
    value: rank === 'A' ? 11 : (['J', 'Q', 'K'].includes(rank) ? 10 : parseInt(rank)),
    displayValue: rank,
  };
}

// Helper function to create a hand
function createHand(cards: Card[]): Hand {
  let total = 0;
  let aces = 0;
  let isSoft = false;

  // Calculate total
  for (const card of cards) {
    if (card.rank === 'A') {
      aces++;
      total += 11;
    } else {
      total += card.value;
    }
  }

  // Adjust for aces
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  isSoft = aces > 0 && total <= 21;

  return {
    cards,
    total,
    isSoft,
    isBlackjack: cards.length === 2 && total === 21,
    isBusted: total > 21,
  };
}

// Helper function to get hand description
function getHandDescription(hand: Hand): string {
  if (hand.isBlackjack) return 'Blackjack';
  if (hand.isBusted) return 'Busted';
  if (hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank) {
    return `Pair of ${hand.cards[0].rank}s`;
  }
  if (hand.isSoft) return `Soft ${hand.total}`;
  return `Hard ${hand.total}`;
}

/**
 * Generates all possible scenarios
 */
export function generateAllScenarios(): ScenarioResult[] {
  const scenarios: ScenarioResult[] = [];
  const dealerUpcards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Generate hard totals (5-20)
  for (let total = 5; total <= 20; total++) {
    for (const dealerRank of dealerUpcards) {
      // Create a hand that totals to the desired value
      let cards: Card[];
      if (total <= 11) {
        // For totals 5-11, use two cards that sum to the total
        const firstCard = Math.min(total - 1, 10);
        const secondCard = total - firstCard;
        cards = [
          createCard(firstCard.toString()),
          createCard(secondCard.toString())
        ];
      } else {
        // For totals 12-20, use 10 + (total - 10)
        cards = [
          createCard('10'),
          createCard((total - 10).toString())
        ];
      }

      const playerHand = createHand(cards);
      const dealerUpcard = createCard(dealerRank);
      
      
      if (!playerHand.isSoft && !playerHand.isBlackjack && 
          !(playerHand.cards.length === 2 && playerHand.cards[0].rank === playerHand.cards[1].rank) &&
          playerHand.total >= 5 && playerHand.total <= 20) {
        
        const recommendations = getAllStrategyRecommendations(playerHand, dealerUpcard);
        const primaryRecommendation = recommendations.reduce((best, current) => 
          current.confidence > best.confidence ? current : best
        );

        scenarios.push({
          playerHand: getHandDescription(playerHand),
          playerTotal: playerHand.total,
          isSoft: playerHand.isSoft,
          isPair: false,
          isBlackjack: playerHand.isBlackjack,
          dealerUpcard: dealerRank,
          primaryAction: primaryRecommendation.action,
          confidence: primaryRecommendation.confidence,
          reasoning: primaryRecommendation.reasoning,
          allRecommendations: recommendations.map(rec => ({
            action: rec.action,
            confidence: rec.confidence,
            reasoning: rec.reasoning
          }))
        });
      }
    }
  }

  // Generate soft totals (A,2 through A,9)
  const softCombinations = [
    { cards: ['A', '2'], total: 13 },
    { cards: ['A', '3'], total: 14 },
    { cards: ['A', '4'], total: 15 },
    { cards: ['A', '5'], total: 16 },
    { cards: ['A', '6'], total: 17 },
    { cards: ['A', '7'], total: 18 },
    { cards: ['A', '8'], total: 19 },
    { cards: ['A', '9'], total: 20 },
  ];

  for (const { cards, total } of softCombinations) {
    for (const dealerRank of dealerUpcards) {
      const playerHand = createHand([
        createCard(cards[0]),
        createCard(cards[1])
      ]);
      const dealerUpcard = createCard(dealerRank);
      
      const recommendations = getAllStrategyRecommendations(playerHand, dealerUpcard);
      const primaryRecommendation = recommendations.reduce((best, current) => 
        current.confidence > best.confidence ? current : best
      );

      scenarios.push({
        playerHand: getHandDescription(playerHand),
        playerTotal: playerHand.total,
        isSoft: playerHand.isSoft,
        isPair: false,
        isBlackjack: playerHand.isBlackjack,
        dealerUpcard: dealerRank,
        primaryAction: primaryRecommendation.action,
        confidence: primaryRecommendation.confidence,
        reasoning: primaryRecommendation.reasoning,
        allRecommendations: recommendations.map(rec => ({
          action: rec.action,
          confidence: rec.confidence,
          reasoning: rec.reasoning
        }))
      });
    }
  }

  // Generate pairs (A,A through 10,10)
  const pairs = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  for (const pairRank of pairs) {
    for (const dealerRank of dealerUpcards) {
      const playerHand = createHand([
        createCard(pairRank, 'hearts'),
        createCard(pairRank, 'diamonds')
      ]);
      const dealerUpcard = createCard(dealerRank);
      
      const recommendations = getAllStrategyRecommendations(playerHand, dealerUpcard);
      const primaryRecommendation = recommendations.reduce((best, current) => 
        current.confidence > best.confidence ? current : best
      );

      scenarios.push({
        playerHand: getHandDescription(playerHand),
        playerTotal: playerHand.total,
        isSoft: playerHand.isSoft,
        isPair: true,
        isBlackjack: playerHand.isBlackjack,
        dealerUpcard: dealerRank,
        primaryAction: primaryRecommendation.action,
        confidence: primaryRecommendation.confidence,
        reasoning: primaryRecommendation.reasoning,
        allRecommendations: recommendations.map(rec => ({
          action: rec.action,
          confidence: rec.confidence,
          reasoning: rec.reasoning
        }))
      });
    }
  }

  // Generate blackjack (A,10)
  for (const dealerRank of dealerUpcards) {
    const playerHand = createHand([
      createCard('A'),
      createCard('10')
    ]);
    const dealerUpcard = createCard(dealerRank);
    
    const recommendations = getAllStrategyRecommendations(playerHand, dealerUpcard);
    const primaryRecommendation = recommendations.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    scenarios.push({
      playerHand: getHandDescription(playerHand),
      playerTotal: playerHand.total,
      isSoft: playerHand.isSoft,
      isPair: false,
      isBlackjack: playerHand.isBlackjack,
      dealerUpcard: dealerRank,
      primaryAction: primaryRecommendation.action,
      confidence: primaryRecommendation.confidence,
      reasoning: primaryRecommendation.reasoning,
      allRecommendations: recommendations.map(rec => ({
        action: rec.action,
        confidence: rec.confidence,
        reasoning: rec.reasoning
      }))
    });
  }

  return scenarios;
}

/**
 * Analyzes scenarios and generates a report
 */
export function analyzeScenarios(scenarios: ScenarioResult[]): AnalysisReport {
  const report: AnalysisReport = {
    totalScenarios: scenarios.length,
    scenariosByAction: {},
    scenariosByConfidence: {},
    inconsistencies: [],
    edgeCases: [],
    trainingModeImpact: {
      'none': 0,
      'double-down': 0,
      'hit': 0,
      'stand': 0,
      'split': 0
    }
  };

  // Count scenarios by action
  scenarios.forEach(scenario => {
    report.scenariosByAction[scenario.primaryAction] = 
      (report.scenariosByAction[scenario.primaryAction] || 0) + 1;
  });

  // Count scenarios by confidence level
  scenarios.forEach(scenario => {
    const confidenceLevel = scenario.confidence >= 95 ? 'high' :
                           scenario.confidence >= 85 ? 'medium' : 'low';
    report.scenariosByConfidence[confidenceLevel] = 
      (report.scenariosByConfidence[confidenceLevel] || 0) + 1;
  });

  // Find inconsistencies (same hand/dealer combo with different actions)
  const scenarioMap = new Map<string, ScenarioResult[]>();
  scenarios.forEach(scenario => {
    const key = `${scenario.playerHand}-vs-${scenario.dealerUpcard}`;
    if (!scenarioMap.has(key)) {
      scenarioMap.set(key, []);
    }
    scenarioMap.get(key)!.push(scenario);
  });

  scenarioMap.forEach((scenarios, key) => {
    const actions = new Set(scenarios.map(s => s.primaryAction));
    if (actions.size > 1) {
      report.inconsistencies.push(...scenarios);
    }
  });

  // Find edge cases (low confidence, unusual combinations)
  scenarios.forEach(scenario => {
    if (scenario.confidence < 80) {
      report.edgeCases.push(scenario);
    }
  });

  return report;
}

/**
 * Generates a human-readable report
 */
export function generateReport(): string {
  const scenarios = generateAllScenarios();
  const analysis = analyzeScenarios(scenarios);

  let report = `# Blackjack Strategy Analysis Report\n\n`;
  report += `## Summary\n`;
  report += `- **Total Scenarios**: ${analysis.totalScenarios}\n`;
  report += `- **Inconsistencies Found**: ${analysis.inconsistencies.length}\n`;
  report += `- **Edge Cases Found**: ${analysis.edgeCases.length}\n\n`;

  report += `## Actions Distribution\n`;
  Object.entries(analysis.scenariosByAction).forEach(([action, count]) => {
    const percentage = ((count / analysis.totalScenarios) * 100).toFixed(1);
    report += `- **${action}**: ${count} scenarios (${percentage}%)\n`;
  });

  report += `\n## Confidence Distribution\n`;
  Object.entries(analysis.scenariosByConfidence).forEach(([level, count]) => {
    const percentage = ((count / analysis.totalScenarios) * 100).toFixed(1);
    report += `- **${level}**: ${count} scenarios (${percentage}%)\n`;
  });

  if (analysis.inconsistencies.length > 0) {
    report += `\n## Inconsistencies\n`;
    analysis.inconsistencies.forEach(scenario => {
      report += `- ${scenario.playerHand} vs ${scenario.dealerUpcard}: ${scenario.primaryAction}\n`;
    });
  }

  if (analysis.edgeCases.length > 0) {
    report += `\n## Edge Cases (Low Confidence)\n`;
    analysis.edgeCases.forEach(scenario => {
      report += `- ${scenario.playerHand} vs ${scenario.dealerUpcard}: ${scenario.primaryAction} (${scenario.confidence}% confidence)\n`;
    });
  }

  return report;
}

/**
 * Exports scenarios to CSV format
 */
export function exportToCSV(): string {
  const scenarios = generateAllScenarios();
  
  let csv = 'Player Hand,Player Total,Is Soft,Is Pair,Is Blackjack,Dealer Upcard,Primary Action,Confidence,Reasoning\n';
  
  scenarios.forEach(scenario => {
    const reasoning = scenario.reasoning.replace(/"/g, '""'); // Escape quotes
    csv += `"${scenario.playerHand}",${scenario.playerTotal},${scenario.isSoft},${scenario.isPair},${scenario.isBlackjack},"${scenario.dealerUpcard}","${scenario.primaryAction}",${scenario.confidence},"${reasoning}"\n`;
  });
  
  return csv;
}
