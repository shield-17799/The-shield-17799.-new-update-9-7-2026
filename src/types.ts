export interface Tactic {
  tacticName: string;
  evidenceSnippet: string;
  explanation: string;
}

export interface ChatAnalysis {
  riskScore: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  behavioralPhase: string;
  detectedTactics: Tactic[];
  childVulnerabilityAssessment: string;
  investigativeRationale: string;
  recommendedInterventions: string[];
}

export interface SuspectAssessment {
  threatRating: "LOW" | "MEDIUM" | "HIGH" | "SEVERE";
  suspectArchetype: string;
  modusOperandiSummary: string;
  highRiskBehaviorIndicators: string[];
  digitalFootprintInvestigationTips: string[];
  recommendedContainmentSteps: string[];
}

export interface SuspectProfile {
  id: string;
  username: string;
  platform: string;
  description: string;
  suspiciousBehaviors: string;
  notes: string;
  createdAt: string;
  assessment?: SuspectAssessment;
}

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  victimAlias: string;
  suspectAlias: string;
  status: "OPEN" | "UNDER_REVIEW" | "FLAGGED" | "RESOLVED";
  chatLog: string;
  analysis?: ChatAnalysis;
  notes: string;
  createdAt: string;
  isPriority?: boolean;
  isArchived?: boolean;
}
