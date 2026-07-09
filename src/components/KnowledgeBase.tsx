import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Info,
  Shield,
  HelpCircle,
  CheckCircle,
  XCircle,
  Award,
  AlertTriangle,
  Lightbulb,
  GraduationCap
} from "lucide-react";
import { GROOMING_INDICATORS_GUIDE } from "../data";

interface QuizQuestion {
  statement: string;
  source: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tacticName: string;
}

const SIMULATOR_QUESTIONS: QuizQuestion[] = [
  {
    statement: "I have like 50 ultra-rare Roblox skins. I can send you a free $50 gift card right now, you played so well today. You're like my favorite squad mate.",
    source: "Suspect in-game messaging",
    options: [
      "Target Access & Financial Luring",
      "Trust & Friendship Building",
      "Social Alienation & Isolation",
      "Boundary Testing & Normalization"
    ],
    correctIndex: 0,
    explanation: "This statement represents Target Access and Financial Luring. Predators use virtual items (skins, in-game currency, game passes) to bypass child suspicion and establish a sense of reciprocity and debt.",
    tacticName: "Financial Luring"
  },
  {
    statement: "Don't tell your mom about our talks. She's from a different generation, she'll just get overly paranoid and block us from gaming together. It's just our little secret.",
    source: "Suspect chat on gaming portal",
    options: [
      "Target Access & Financial Luring",
      "Trust & Friendship Building",
      "Social Alienation & Isolation",
      "Boundary Testing & Normalization"
    ],
    correctIndex: 2,
    explanation: "This statement represents Social Alienation and Isolation. By demanding secrecy and painting parents/guardians as untrustworthy or paranoid, the suspect attempts to cut off the child's natural support network.",
    tacticName: "Devaluing Parental Authority & Enforcing Secrecy"
  },
  {
    statement: "You are genuinely so much more mature and talented than kids your age. Nobody at your school understands you, but I do. You can tell me anything. We have a special connection.",
    source: "Suspect Direct Message on Instagram",
    options: [
      "Target Access & Financial Luring",
      "Trust & Friendship Building",
      "Social Alienation & Isolation",
      "Boundary Testing & Normalization"
    ],
    correctIndex: 1,
    explanation: "This statement represents Trust and Friendship Building. By praising the child as uniquely mature, the suspect triggers validation-seeking behavior, positioning themselves as the child's sole empathetic confidant.",
    tacticName: "Praise & Artificial Intimacy"
  },
  {
    statement: "Let's FaceTime late tonight around 11 PM so we won't be interrupted. Wear something comfortable like your favorite swimsuit so I can review your shoulder angles.",
    source: "Suspect messaging on private Snapchat",
    options: [
      "Target Access & Financial Luring",
      "Trust & Friendship Building",
      "Social Alienation & Isolation",
      "Boundary Testing & Normalization"
    ],
    correctIndex: 3,
    explanation: "This statement represents Boundary Testing and Normalization. The suspect leverages authority (coaching role), requests night calls without parental interference, and requests state of undress (swimsuit) under clinical pretexts.",
    tacticName: "Abuse of Authority & Compliance Testing"
  }
];

export default function KnowledgeBase() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScoreBadge, setShowScoreBadge] = useState(false);

  const handleAnswerSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || hasSubmitted) return;
    setHasSubmitted(true);
    if (selectedAnswer === SIMULATOR_QUESTIONS[currentQuestionIdx].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setHasSubmitted(false);
    if (currentQuestionIdx < SIMULATOR_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setShowScoreBadge(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setScore(0);
    setShowScoreBadge(false);
  };

  const activeQuestion = SIMULATOR_QUESTIONS[currentQuestionIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="knowledge-base-root">
      {/* LEFT COLUMN: The Grooming Stages Guide */}
      <div className="lg:col-span-7 flex flex-col gap-5" id="indicators-guide-column">
        <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-amber-500/10 pb-3.5 mb-4">
            <BookOpen className="w-5 h-5 text-[#e6c65e]" />
            <h2 className="font-display font-medium text-lg text-slate-100">
              Child Protection Grooming Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Online grooming is a highly systematic, psychological process. It rarely begins with explicit requests. Instead, cyber-predators deploy progressive stages designed to break down a child's natural boundaries over weeks or months. Understanding these stages is critical to enabling early intervention before harm occurs.
          </p>

          <div className="space-y-4" id="stages-guide-list">
            {GROOMING_INDICATORS_GUIDE.map((stage, idx) => {
              const getBadgeColors = (severity: string) => {
                switch (severity) {
                  case "CRITICAL":
                    return "bg-red-500/10 text-red-400 border border-red-500/20";
                  case "HIGH":
                    return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
                  case "MODERATE":
                    return "bg-yellow-500/10 text-yellow-450 border border-yellow-500/20";
                  default:
                    return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                }
              };

              return (
                <div key={idx} className="bg-black border border-amber-500/5 rounded-xl p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b border-[#151515] pb-2">
                    <h3 className="font-display font-bold text-sm text-[#e6c65e]">{stage.phase}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getBadgeColors(stage.severity)}`}>
                      {stage.severity} Risk Indicator
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">{stage.description}</p>
                  
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1.5">
                      Key Warning Signs
                    </span>
                    <ul className="space-y-1.5">
                      {stage.indicators.map((indicator, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Quiz / Simulator */}
      <div className="lg:col-span-5 flex flex-col gap-4" id="simulator-column">
        <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-5 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 border-b border-amber-500/10 pb-3.5 mb-4">
            <GraduationCap className="w-5 h-5 text-[#e6c65e]" />
            <h2 className="font-display font-medium text-lg text-slate-100">
              Tactical Triage Simulator
            </h2>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Test your protective instincts. Analyze real-world conversational statements from digital logs and categorize their psychological grooming tactics.
          </p>

          <AnimatePresence mode="wait">
            {showScoreBadge ? (
              /* Quiz Finished Summary */
              <motion.div
                key="summary"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 text-center gap-4 flex-1 bg-black border border-amber-500/5 rounded-xl p-6"
              >
                <div className="w-16 h-16 bg-amber-500/5 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-400 shadow-md">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-200">Safeguarding Level Unlocked</h3>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                    You scored <strong className="text-amber-400">{score} of {SIMULATOR_QUESTIONS.length}</strong> correct on diagnostic forensic luring benchmarks.
                  </p>
                </div>

                <div className="text-2xl font-mono font-bold text-amber-300 bg-amber-500/5 px-4 py-1.5 rounded border border-amber-500/20 mt-1">
                  {Math.round((score / SIMULATOR_QUESTIONS.length) * 100)}% Proficiency
                </div>

                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Excellent work practicing protective diagnostic benchmarks. Continuing forensic audits enhances community early-detection capabilities.
                </p>

                <button
                  onClick={handleResetQuiz}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-[#c5a850] to-[#e6c65e] hover:brightness-110 text-black rounded-lg text-xs font-bold shadow transition"
                >
                  Restart Simulation
                </button>
              </motion.div>
            ) : (
              /* Active Quiz Question Card */
              <motion.div
                key={currentQuestionIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4 flex-1"
              >
                {/* Statement Quote */}
                <div className="bg-black p-4 rounded-xl border border-amber-500/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded">
                      FORENSIC QUOTE
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Item {currentQuestionIdx + 1} of {SIMULATOR_QUESTIONS.length}
                    </span>
                  </div>
                  <blockquote className="text-xs font-mono text-slate-300 leading-relaxed mt-1">
                    "{activeQuestion.statement}"
                  </blockquote>
                  <span className="text-[10px] text-slate-500 text-right font-medium">
                    — {activeQuestion.source}
                  </span>
                </div>

                {/* Multiple choice options */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                    Select Stage Classification:
                  </span>
                  <div className="space-y-1.5">
                    {activeQuestion.options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      let optionStyle = "border-amber-500/10 bg-black text-slate-300 hover:bg-black/80";
                      
                      if (isSelected) {
                        optionStyle = "border-amber-500 bg-amber-500/5 text-[#e6c65e]";
                      }
                      if (hasSubmitted) {
                        if (idx === activeQuestion.correctIndex) {
                          optionStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-300";
                        } else if (isSelected) {
                          optionStyle = "border-red-500 bg-red-950/20 text-red-300";
                        } else {
                          optionStyle = "border-amber-500/5 bg-black/40 text-slate-500 cursor-not-allowed";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={hasSubmitted}
                          onClick={() => handleAnswerSelect(idx)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{option}</span>
                          {hasSubmitted && idx === activeQuestion.correctIndex && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {hasSubmitted && isSelected && idx !== activeQuestion.correctIndex && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation or Action Button */}
                <div className="mt-auto pt-3 border-t border-amber-500/10">
                  {!hasSubmitted ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={selectedAnswer === null}
                      className={`w-full py-2 bg-gradient-to-r from-[#c5a850] to-[#e6c65e] text-black rounded-lg text-xs font-bold text-center transition hover:brightness-110 shadow ${
                        selectedAnswer === null
                          ? "opacity-50 cursor-not-allowed bg-black text-slate-500 border border-amber-500/10"
                          : ""
                      }`}
                    >
                      Check Triage Classification
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-3.5 bg-black p-3.5 border border-amber-500/10 rounded-xl"
                    >
                      <div className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-300 block mb-0.5">
                            Investigative Feedback:
                          </span>
                          <p>{activeQuestion.explanation}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleNext}
                        className="w-full py-1.5 bg-[#141414] hover:bg-[#1f1f1f] text-[#e6c65e] border border-amber-500/15 rounded-lg text-xs font-semibold transition"
                      >
                        {currentQuestionIdx < SIMULATOR_QUESTIONS.length - 1
                          ? "Proceed to Next Triage Statement"
                          : "Finish Diagnostic Assessment"}
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
