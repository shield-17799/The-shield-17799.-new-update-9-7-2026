import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  ShieldAlert,
  Search,
  Plus,
  Trash2,
  Calendar,
  Globe,
  AlertTriangle,
  Brain,
  Eye,
  Settings,
  ShieldCheck,
  Zap,
  Briefcase
} from "lucide-react";
import { SuspectProfile, SuspectAssessment } from "../types";
import { PRELOADED_SUSPECTS } from "../data";

export default function SuspectProfiler() {
  const [suspects, setSuspects] = useState<SuspectProfile[]>([]);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>("");
  const [isProfiling, setIsProfiling] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("");
  const [description, setDescription] = useState("");
  const [behaviors, setBehaviors] = useState("");
  const [notes, setNotes] = useState("");

  // Load suspects
  useEffect(() => {
    const saved = localStorage.getItem("shield_suspects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setSuspects(parsed);
          setSelectedSuspectId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved suspects:", e);
      }
    }
    setSuspects(PRELOADED_SUSPECTS);
    setSelectedSuspectId(PRELOADED_SUSPECTS[0].id);
  }, []);

  const saveSuspects = (updated: SuspectProfile[]) => {
    setSuspects(updated);
    localStorage.setItem("shield_suspects", JSON.stringify(updated));
  };

  const selectedSuspect = suspects.find((s) => s.id === selectedSuspectId);

  const handleAddSuspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !platform.trim()) {
      alert("Username/Alias and Primary Platform are required to establish a suspect record.");
      return;
    }

    const newSuspect: SuspectProfile = {
      id: `suspect-${Date.now()}`,
      username: username,
      platform: platform,
      description: description,
      suspiciousBehaviors: behaviors,
      notes: notes,
      createdAt: new Date().toISOString()
    };

    const updated = [newSuspect, ...suspects];
    saveSuspects(updated);
    setSelectedSuspectId(newSuspect.id);
    setIsAdding(false);

    // Reset fields
    setUsername("");
    setPlatform("");
    setDescription("");
    setBehaviors("");
    setNotes("");
  };

  const handleDeleteSuspect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this suspect profile?")) {
      const filtered = suspects.filter((s) => s.id !== id);
      saveSuspects(filtered);
      if (selectedSuspectId === id && filtered.length > 0) {
        setSelectedSuspectId(filtered[0].id);
      } else if (filtered.length === 0) {
        setSelectedSuspectId("");
      }
    }
  };

  const runSuspectAIAnalysis = async () => {
    if (!selectedSuspect) return;
    setIsProfiling(true);
    setProfileError(null);

    try {
      const response = await fetch("/api/profile-suspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: selectedSuspect.username,
          platform: selectedSuspect.platform,
          description: selectedSuspect.description,
          suspiciousBehaviors: selectedSuspect.suspiciousBehaviors,
          notes: selectedSuspect.notes
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze suspect profile.");
      }

      const assessmentResult: SuspectAssessment = await response.json();

      const updated = suspects.map((s) => {
        if (s.id === selectedSuspect.id) {
          return {
            ...s,
            assessment: assessmentResult
          };
        }
        return s;
      });

      saveSuspects(updated);
    } catch (err: any) {
      console.error(err);
      setProfileError(err?.message || "An unexpected error occurred during profiling.");
    } finally {
      setIsProfiling(false);
    }
  };

  const getThreatColor = (rating?: string) => {
    switch (rating) {
      case "SEVERE":
        return {
          bg: "bg-red-950/40",
          border: "border-red-500/50",
          text: "text-red-400",
          badge: "bg-red-500/20 text-red-300 border-red-500/30",
          accent: "#ef4444"
        };
      case "HIGH":
        return {
          bg: "bg-orange-950/40",
          border: "border-orange-500/50",
          text: "text-orange-400",
          badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
          accent: "#f97316"
        };
      case "MEDIUM":
        return {
          bg: "bg-yellow-950/20",
          border: "border-yellow-500/30",
          text: "text-yellow-400",
          badge: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
          accent: "#eab308"
        };
      case "LOW":
        return {
          bg: "bg-emerald-950/20",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
          badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
          accent: "#10b981"
        };
      default:
        return {
          bg: "bg-[#111]",
          border: "border-amber-500/10",
          text: "text-slate-400",
          badge: "bg-[#222] text-slate-300 border-amber-500/15",
          accent: "#c5a850"
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="suspect-profiler-root">
      {/* LEFT COLUMN: Suspect Directory */}
      <div className="lg:col-span-4 flex flex-col gap-4" id="suspects-sidebar">
        <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#e6c65e]" />
              <h2 className="font-display font-medium text-lg text-slate-100">Suspect Fingerprints</h2>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              id="btn-add-new-suspect"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#c5a850] to-[#e6c65e] hover:brightness-110 text-black rounded-lg text-xs font-bold transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Record
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1" id="suspect-list-container">
            {suspects.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No suspects filed. Click "Add Record" to initialize tracking.
              </div>
            ) : (
              suspects.map((s) => {
                const colors = getThreatColor(s.assessment?.threatRating);
                return (
                  <div
                    key={s.id}
                    id={`suspect-card-${s.id}`}
                    onClick={() => {
                      setSelectedSuspectId(s.id);
                      setIsAdding(false);
                      setProfileError(null);
                    }}
                    className={`p-3.5 rounded-xl border transition duration-150 cursor-pointer ${
                      selectedSuspectId === s.id
                        ? "bg-[#141414] border-amber-500/50 shadow-md shadow-amber-500/5"
                        : "bg-black/40 border-amber-500/5 hover:bg-[#101010]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <span className="font-mono text-[11px] text-[#e6c65e] font-bold">
                        @{s.username}
                      </span>
                      {s.assessment ? (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${colors.badge}`}>
                          {s.assessment.threatRating}
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 bg-amber-500/5 border border-amber-500/20 px-1.5 py-0.5 rounded">
                          Unassessed
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 flex flex-col gap-1 mb-2.5">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-slate-300 font-medium truncate">{s.platform}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                        {s.description || "No account details logged"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-amber-500/5 pt-2 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(s.createdAt).toLocaleDateString()}
                      </div>
                      <button
                        onClick={(e) => handleDeleteSuspect(s.id, e)}
                        className="text-slate-600 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition"
                        title="Purge Suspect Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Suspect Detail & AI Threat Profile */}
      <div className="lg:col-span-8 flex flex-col gap-6" id="suspect-profile-panel">
        <AnimatePresence mode="wait">
          {isAdding ? (
            /* Add suspect form */
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="new-suspect-form"
              onSubmit={handleAddSuspect}
              className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-6 flex flex-col gap-4 shadow-md"
            >
              <div className="border-b border-amber-500/10 pb-3">
                <h3 className="font-display font-bold text-xl text-slate-100">Log Suspect Fingerprint</h3>
                <p className="text-slate-400 text-xs">Establish a new database profile to evaluate cyber-predatory threat levels.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300" htmlFor="suspect-username-input">Suspect Alias / Username *</label>
                  <input
                    id="suspect-username-input"
                    type="text"
                    required
                    placeholder="e.g., Xenon_Gamer_99"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-black border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300" htmlFor="suspect-platform-input">Primary Platforms *</label>
                  <input
                    id="suspect-platform-input"
                    type="text"
                    required
                    placeholder="e.g., Discord / Minecraft chat"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="bg-black border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="suspect-description-input">Visual or Account Bio Description</label>
                <textarea
                  id="suspect-description-input"
                  rows={2}
                  placeholder="Avatar features, claimed age/location, profile text, friends list size, specific game server channels..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-black border border-amber-500/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="suspect-behaviors-input">Reported/Suspicious Behaviors *</label>
                <textarea
                  id="suspect-behaviors-input"
                  required
                  rows={4}
                  placeholder="What specifically makes this profile suspicious? (e.g., offering skin credits, insisting on encrypted chats, asking for child selfies late at night...)"
                  value={behaviors}
                  onChange={(e) => setBehaviors(e.target.value)}
                  className="bg-black border border-amber-500/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="suspect-notes-input">Additional Investigator Notes</label>
                <textarea
                  id="suspect-notes-input"
                  rows={2}
                  placeholder="Associated victim accounts, IP trackers, reported times, police report status if any..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-black border border-amber-500/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2 border-t border-amber-500/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-amber-500/10 text-slate-400 hover:text-slate-200 hover:bg-black/50 text-xs font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-suspect"
                  className="px-4 py-2 bg-gradient-to-r from-[#c5a850] to-[#e6c65e] text-black text-xs font-bold rounded-lg transition hover:brightness-110 shadow-md"
                >
                  Establish Suspect Record
                </button>
              </div>
            </motion.form>
          ) : selectedSuspect ? (
            /* Suspect detail view */
            <motion.div
              key={selectedSuspect.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
              id="active-suspect-wrapper"
            >
              {/* Profile Card Header */}
              <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/10 pb-4">
                  <div>
                    <span className="font-mono text-xs text-[#e6c65e] font-semibold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                      SUSPECT FORENSIC DIRECTORY
                    </span>
                    <h2 className="font-display font-bold text-xl text-slate-100 mt-2">
                      @{selectedSuspect.username}
                    </h2>
                  </div>
                  <button
                    onClick={runSuspectAIAnalysis}
                    id="btn-trigger-suspect-ai"
                    disabled={isProfiling}
                    className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c5a850] to-[#e6c65e] hover:brightness-110 text-black rounded-lg text-xs font-bold shadow-md transition-all duration-200 ${
                      isProfiling ? "opacity-60 cursor-not-allowed animate-pulse" : "hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    <Brain className="w-4 h-4 stroke-[2.5]" />
                    {isProfiling ? "Profiling Behavior..." : "Generate AI Suspect Threat Profile"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                  <div className="bg-black p-3.5 rounded-lg border border-amber-500/5">
                    <span className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">
                      Primary Channels
                    </span>
                    <span className="font-medium text-slate-200 text-sm flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-slate-400" />
                      {selectedSuspect.platform}
                    </span>
                  </div>
                  <div className="bg-black p-3.5 rounded-lg border border-amber-500/5">
                    <span className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">
                      Threat Assessment Class
                    </span>
                    {selectedSuspect.assessment ? (
                      <span className={`inline-block mt-0.5 px-3 py-0.5 rounded font-bold uppercase text-xs border ${
                        getThreatColor(selectedSuspect.assessment.threatRating).badge
                      }`}>
                        {selectedSuspect.assessment.threatRating}
                      </span>
                    ) : (
                      <span className="text-xs text-[#e6c65e] italic font-semibold">PENDING FORENSIC EVALUATION</span>
                    )}
                  </div>
                </div>

                {selectedSuspect.description && (
                  <div className="mt-4 bg-black p-3 rounded-lg border border-amber-500/5">
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
                      Account Features & Bio Details
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{selectedSuspect.description}</p>
                  </div>
                )}
              </div>

              {/* Behavior vs Threat profile grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Reported Behaviors logged */}
                <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
                  <div className="border-b border-amber-500/10 pb-2.5">
                    <h3 className="font-display font-medium text-sm text-slate-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-[#e6c65e]" />
                      Logged Suspect Indicators
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3 flex-1">
                    <div className="bg-black p-3.5 rounded-lg border border-amber-500/5 text-xs flex flex-col gap-2">
                      <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider block">
                        Logged Behavioral Evidence:
                      </span>
                      <p className="text-slate-300 leading-relaxed font-sans">{selectedSuspect.suspiciousBehaviors}</p>
                    </div>

                    {selectedSuspect.notes && (
                      <div className="bg-black/50 p-3.5 rounded-lg border border-amber-500/5 text-xs flex flex-col gap-1.5 mt-auto">
                        <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider block">
                          Technical Case Notes:
                        </span>
                        <p className="text-slate-400 leading-relaxed">{selectedSuspect.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Threat Profile Results */}
                <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-5 flex flex-col gap-4 shadow-sm" id="suspect-profile-assessment-results">
                  <div className="border-b border-amber-500/10 pb-2.5 flex items-center justify-between">
                    <h3 className="font-display font-medium text-sm text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                      AI Forensic Classification
                    </h3>
                    <span className="text-[10px] text-amber-500 font-mono font-bold tracking-wider">
                      COGNITIVE RADAR ENHANCED
                    </span>
                  </div>

                  {isProfiling ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 flex-1">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-amber-400 animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-300">Modeling Suspect Fingerprint...</p>
                        <p className="text-xs text-slate-500 mt-1">Comparing behavioral signatures against lurer typologies</p>
                      </div>
                    </div>
                  ) : profileError ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 flex-1">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-300 text-sm">Forensic Profiling Failed</h4>
                        <p className="text-xs text-red-400/90 mt-1 leading-relaxed">{profileError}</p>
                        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                          Verify that GEMINI_API_KEY is properly saved in AI Studio Secrets.
                        </p>
                      </div>
                    </div>
                  ) : selectedSuspect.assessment ? (
                    /* Assessment is done and rendered! */
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[380px] pr-1">
                      {/* Archetype Card */}
                      <div className="bg-black p-3.5 border border-amber-500/10 rounded-xl">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Groomer Psychological Archetype</span>
                        <h4 className="font-display font-bold text-red-450 text-sm mt-0.5">
                          {selectedSuspect.assessment.suspectArchetype}
                        </h4>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-3 block">Modus Operandi Summary</span>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                          {selectedSuspect.assessment.modusOperandiSummary}
                        </p>
                      </div>

                      {/* Warning Flags */}
                      <div className="bg-black p-3.5 border border-amber-500/10 rounded-xl">
                        <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Identified High-Risk Red Flags
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {selectedSuspect.assessment.highRiskBehaviorIndicators.map((flag, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-red-500 shrink-0 mt-0.5 font-bold">•</span>
                              <span className="leading-relaxed">{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tactical Containment steps */}
                      <div className="bg-black p-3.5 border border-amber-500/10 rounded-xl">
                        <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Recommended Containment / Safeguards
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {selectedSuspect.assessment.recommendedContainmentSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-emerald-500 shrink-0 mt-0.5 font-bold">•</span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Investigation tips */}
                      <div className="bg-black p-3.5 border border-amber-500/10 rounded-xl">
                        <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
                          <Settings className="w-3.5 h-3.5" />
                          Digital Footprint Investigation Tips
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300 font-mono">
                          {selectedSuspect.assessment.digitalFootprintInvestigationTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 bg-[#090909] p-1.5 rounded border border-amber-500/5">
                              <span className="text-amber-500 font-bold font-sans shrink-0">[{idx + 1}]</span>
                              <span className="leading-relaxed text-[10px]">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* Unassessed empty state */
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-3 bg-black/40 border border-dashed border-amber-500/20 rounded-xl flex-1">
                      <Eye className="w-8 h-8 text-amber-500/20 animate-pulse" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400">Threat Intelligence Inactive</h4>
                        <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed mx-auto">
                          Execute "Generate AI Suspect Threat Profile" above to trigger behavioral intelligence algorithms.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Selected Suspect Deleted / Empty Directory */
            <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm h-[400px]">
              <Users className="w-12 h-12 text-amber-500/20 animate-pulse" />
              <div>
                <h3 className="font-display font-bold text-lg text-slate-300">Select Suspect File</h3>
                <p className="text-slate-500 text-xs max-w-sm mt-1 leading-relaxed mx-auto">
                  Click on any suspect alias in the directory rail to view platform accounts, documented behaviors, and map forensic investigation instructions.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
