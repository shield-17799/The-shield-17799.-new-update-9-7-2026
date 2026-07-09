import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  FileText,
  FileCode,
  Plus,
  Send,
  Trash2,
  FolderOpen,
  Terminal,
  Brain,
  Clock,
  Activity,
  User,
  AlertCircle,
  Archive,
  Bookmark,
  Bell,
  Flag,
  MoreVertical
} from "lucide-react";
import { InvestigationCase, ChatAnalysis } from "../types";
import { PRELOADED_CASES } from "../data";

export default function CaseManager() {
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Form states for creating a new case
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newVictim, setNewVictim] = useState("");
  const [newSuspect, setNewSuspect] = useState("");
  const [newChatLog, setNewChatLog] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Load cases from localStorage or preloads
  useEffect(() => {
    const saved = localStorage.getItem("shield_cases");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setCases(parsed);
          setSelectedCaseId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved cases:", e);
      }
    }
    setCases(PRELOADED_CASES);
    setSelectedCaseId(PRELOADED_CASES[0].id);
  }, []);

  // Save cases to localStorage
  const saveCases = (updatedCases: InvestigationCase[]) => {
    setCases(updatedCases);
    localStorage.setItem("shield_cases", JSON.stringify(updatedCases));
  };

  const exportCaseReportPDF = (c: InvestigationCase) => {
    if (!c.analysis) return;
    const { analysis } = c;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const primaryGold = [197, 168, 80]; // #c5a850
    let y = 15;

    // Page margin settings
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - (margin * 2);

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin - 10) {
        doc.addPage();
        y = 20;
        // Draw elegant page header on subsequent pages
        doc.setFillColor(10, 10, 10);
        doc.rect(margin, 10, contentWidth, 1, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text("THE SHIELD-17799 PRE-ATTACK INTELLIGENCE CORE", margin, 8);
        doc.text(`Case: ${c.caseNumber}`, pageWidth - margin - 5, 8, { align: "right" });
      }
    };

    // Header block
    doc.setFillColor(10, 10, 10);
    doc.rect(margin, y, contentWidth, 25, "F");
    
    // Gold stripe under header
    doc.setFillColor(197, 168, 80);
    doc.rect(margin, y + 25, contentWidth, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(245, 158, 11); // Gold-ish
    doc.text("THE SHIELD-17799", margin + 5, y + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text("AI-POWERED PRE-ATTACK INTELLIGENCE & CHILD SAFEGUARDING CORE", margin + 5, y + 16);
    
    doc.setFontSize(8);
    doc.text(`GENERATED: ${new Date().toLocaleString()} (UTC)`, pageWidth - margin - 5, y + 10, { align: "right" });
    doc.text("STATUS: SECURE FORENSIC AUDIT", pageWidth - margin - 5, y + 16, { align: "right" });

    y += 35;

    // Section 1: Case Identity Profile
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("CASE METADATA PROFILE", margin, y);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 8;

    // Metadata Grid
    const metadata = [
      { label: "Case File Name:", value: c.title },
      { label: "Case ID Number:", value: c.caseNumber },
      { label: "Target / Victim Alias:", value: c.victimAlias },
      { label: "Suspect Profiler Tag:", value: `@${c.suspectAlias}` },
      { label: "Date Established:", value: new Date(c.createdAt).toLocaleDateString() }
    ];

    doc.setFontSize(9);
    metadata.forEach((item) => {
      checkPageBreak(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text(item.label, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(20, 20, 20);
      doc.text(String(item.value), margin + 45, y);
      y += 6;
    });

    y += 4;

    // Section 2: Cognitive Threat Evaluation
    checkPageBreak(35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("FORENSIC THREAT ASSESSMENT SUMMARY", margin, y);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 8;

    // Risk Card Frame
    checkPageBreak(40);
    doc.setFillColor(248, 250, 252); // light slate background
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 32, "FD");

    // Gold highlight sidebar
    doc.setFillColor(197, 168, 80);
    doc.rect(margin, y, 3, 32, "F");

    // Risk score percentage & rating
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(197, 168, 80);
    doc.text(`${analysis.riskScore}%`, margin + 10, y + 14);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("SCIENTIFIC THREAT RISK INDEX", margin + 10, y + 22);

    // Phase & Severity info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("Severity Classification:", margin + 55, y + 10);
    doc.setFont("helvetica", "normal");
    doc.text(analysis.riskLevel, margin + 95, y + 10);

    doc.setFont("helvetica", "bold");
    doc.text("Grooming Phase Profile:", margin + 55, y + 16);
    doc.setFont("helvetica", "normal");
    doc.text(analysis.behavioralPhase, margin + 95, y + 16);

    doc.setFont("helvetica", "bold");
    doc.text("Vulnerability Assessment:", margin + 55, y + 22);
    doc.setFont("helvetica", "normal");
    const wrappedVulnerability = doc.splitTextToSize(analysis.childVulnerabilityAssessment, contentWidth - 110);
    let vulnerabilityY = y + 22;
    wrappedVulnerability.forEach((line: string, index: number) => {
      if (index < 2) { // limit to max 2 lines to fit inside card
        doc.text(line, margin + 98, vulnerabilityY);
        vulnerabilityY += 4;
      }
    });

    y += 38;

    // Section 3: Detailed Behavioral Rationale
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("INVESTIGATIVE RATIONALE", margin, y);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    const splitRationale = doc.splitTextToSize(analysis.investigativeRationale, contentWidth);
    
    splitRationale.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, margin, y);
      y += 5;
    });

    y += 5;

    // Section 4: Specific Tactical Evidence
    if (analysis.detectedTactics && analysis.detectedTactics.length > 0) {
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text("IDENTIFIED BEHAVIORAL RED FLAGS & EVIDENCE", margin, y);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 8;

      analysis.detectedTactics.forEach((tactic, idx) => {
        checkPageBreak(25);
        
        // Tactic Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(197, 168, 80);
        doc.text(`Red Flag #${idx + 1}: ${tactic.tacticName}`, margin, y);
        y += 5;

        // Evidence quote block
        const textToWrap = `"${tactic.evidenceSnippet}"`;
        const wrappedQuote = doc.splitTextToSize(textToWrap, contentWidth - 10);
        
        // Light bg for quote block
        doc.setFillColor(252, 252, 253);
        doc.setDrawColor(241, 245, 249);
        const quoteHeight = (wrappedQuote.length * 4.5) + 6;
        
        checkPageBreak(quoteHeight);
        doc.rect(margin, y, contentWidth, quoteHeight, "FD");
        
        // Gold vertical bracket on quote
        doc.setFillColor(197, 168, 80);
        doc.rect(margin, y, 1.5, quoteHeight, "F");

        doc.setFont("courier", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(50, 50, 50);
        
        let quoteY = y + 4.5;
        wrappedQuote.forEach((line: string) => {
          doc.text(line, margin + 5, quoteY);
          quoteY += 4.5;
        });

        y += quoteHeight + 4;
      });
    }

    y += 3;

    // Section 5: Recommended Action Protocol
    if (analysis.recommendedInterventions && analysis.recommendedInterventions.length > 0) {
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text("RECOMMENDED SAFEGUARDING ACTION PROTOCOL", margin, y);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);

      analysis.recommendedInterventions.forEach((item, index) => {
        const wrappedAction = doc.splitTextToSize(`${index + 1}. ${item}`, contentWidth - 5);
        const actionHeight = (wrappedAction.length * 5) + 2;
        
        checkPageBreak(actionHeight);
        
        wrappedAction.forEach((line: string) => {
          doc.text(line, margin, y);
          y += 5;
        });
        y += 1.5;
      });
    }

    // Disclaimer Footer
    checkPageBreak(25);
    y = Math.max(y, pageHeight - margin - 20);
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text(
      "DISCLAIMER: This report is generated automatically by The Shield-17799 as an educational & auxiliary decision-making prototype.",
      margin,
      y
    );
    doc.text(
      "It should not replace professional psychological analysis or immediate child safeguarding agency interventions.",
      margin,
      y + 3.5
    );

    // Save PDF
    const filename = `The-Shield-17799-Report-${c.caseNumber || "Case"}.pdf`;
    doc.save(filename);
  };

  const exportCaseReportJSON = (c: InvestigationCase) => {
    if (!c.analysis) return;
    const { analysis } = c;

    const reportData = {
      documentHeader: {
        system: "THE SHIELD-17799 PRE-ATTACK INTELLIGENCE & CHILD SAFEGUARDING CORE",
        documentType: "FORENSIC THREAT ASSESSMENT REPORT",
        generatedAt: new Date().toISOString(),
        securityClassification: "RESTRICTED // PROFESSIONAL INVESTIGATION INTERNAL USE ONLY",
        status: "SECURE FORENSIC AUDIT"
      },
      caseMetadata: {
        caseId: c.caseNumber,
        title: c.title,
        createdAt: c.createdAt,
        targetVictimAlias: c.victimAlias,
        suspectAlias: `@${c.suspectAlias}`,
        contextNotes: c.notes || "No context notes provided."
      },
      forensicRiskEvaluation: {
        threatRiskIndexPercent: analysis.riskScore,
        severityClassification: analysis.riskLevel,
        groomingPhaseProfile: analysis.behavioralPhase,
        childVulnerabilityAssessment: analysis.childVulnerabilityAssessment,
        investigativeRationale: analysis.investigativeRationale
      },
      behavioralRedFlags: analysis.detectedTactics.map((t, idx) => ({
        index: idx + 1,
        tacticName: t.tacticName,
        evidenceSnippet: t.evidenceSnippet,
        assessment: t.explanation || "Tactic detected with high behavioral correlation."
      })),
      recommendedSafeguardingActionProtocol: analysis.recommendedInterventions,
      rawTranscriptFingerprint: {
        totalLines: c.chatLog.split("\n").length,
        characterCount: c.chatLog.length,
        textSnippet: c.chatLog.slice(0, 150) + (c.chatLog.length > 150 ? "..." : "")
      }
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `The_Shield_Forensic_Report_${c.caseNumber || "Case"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Forensic JSON document successfully exported for Case ${c.caseNumber}.`, "success");
  };

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newChatLog.trim()) {
      alert("Case Title and Chat Log are required to open an investigation.");
      return;
    }

    const newCase: InvestigationCase = {
      id: `case-${Date.now()}`,
      caseNumber: `CASE-17799-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      victimAlias: newVictim || "Anonymous Child",
      suspectAlias: newSuspect || "Unidentified User",
      status: "OPEN",
      chatLog: newChatLog,
      notes: newNotes,
      createdAt: new Date().toISOString(),
    };

    const updated = [newCase, ...cases];
    saveCases(updated);
    setSelectedCaseId(newCase.id);
    setIsCreating(false);

    // Reset fields
    setNewTitle("");
    setNewVictim("");
    setNewSuspect("");
    setNewChatLog("");
    setNewNotes("");
  };

  const handleDeleteCase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to purge this case file from digital records? This action is irreversible.")) {
      const filtered = cases.filter((c) => c.id !== id);
      saveCases(filtered);
      if (selectedCaseId === id && filtered.length > 0) {
        setSelectedCaseId(filtered[0].id);
      } else if (filtered.length === 0) {
        setSelectedCaseId("");
      }
      // Keep bulk selection in sync
      setBulkSelectedIds((prev) => prev.filter((x) => x !== id));
    }
  };

  // Bulk Action Protocols
  const handleBulkPriority = (priority: boolean) => {
    if (bulkSelectedIds.length === 0) return;
    const updated = cases.map((c) => {
      if (bulkSelectedIds.includes(c.id)) {
        return {
          ...c,
          isPriority: priority,
          status: priority ? ("FLAGGED" as const) : c.status
        };
      }
      return c;
    });
    saveCases(updated);
    showToast(
      `Intelligence Priority set to ${priority ? "HIGH" : "STANDARD"} for ${bulkSelectedIds.length} cases.`,
      "info"
    );
    setBulkSelectedIds([]);
  };

  const handleBulkArchive = (archive: boolean) => {
    if (bulkSelectedIds.length === 0) return;
    const updated = cases.map((c) => {
      if (bulkSelectedIds.includes(c.id)) {
        return {
          ...c,
          isArchived: archive
        };
      }
      return c;
    });
    saveCases(updated);
    showToast(
      `Successfully ${archive ? "secured & ARCHIVED" : "restored"} ${bulkSelectedIds.length} case files.`,
      "info"
    );
    setBulkSelectedIds([]);
  };

  const handleBulkNotify = () => {
    if (bulkSelectedIds.length === 0) return;
    showToast(
      `ALERT: Safeguarding dispatch initiated for ${bulkSelectedIds.length} target cases. Full forensics and transcripts routed to local protection authorities.`,
      "success"
    );
    setBulkSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (bulkSelectedIds.length === 0) return;
    if (window.confirm(`Are you absolutely certain you want to permanently purge the ${bulkSelectedIds.length} selected cases from secure storage? This action is completely irreversible.`)) {
      const updated = cases.filter((c) => !bulkSelectedIds.includes(c.id));
      saveCases(updated);
      showToast(`Successfully purged ${bulkSelectedIds.length} files from localized systems.`, "info");
      
      // Select another case if current selected got purged
      if (bulkSelectedIds.includes(selectedCaseId)) {
        if (updated.length > 0) {
          setSelectedCaseId(updated[0].id);
        } else {
          setSelectedCaseId("");
        }
      }
      setBulkSelectedIds([]);
    }
  };

  // Notification / Toast helper
  const showToast = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
  };

  // Autohide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleTogglePriority = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cases.map((c) => {
      if (c.id === id) {
        const nextPriority = !c.isPriority;
        showToast(
          nextPriority 
            ? `Case ${c.caseNumber} marked as HIGH PRIORITY.` 
            : `Priority status removed from ${c.caseNumber}.`,
          "info"
        );
        return {
          ...c,
          isPriority: nextPriority,
          status: nextPriority ? ("FLAGGED" as const) : c.status
        };
      }
      return c;
    });
    saveCases(updated);
  };

  const handleToggleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cases.map((c) => {
      if (c.id === id) {
        const nextArchived = !c.isArchived;
        showToast(
          nextArchived 
            ? `Case ${c.caseNumber} has been secured and ARCHIVED.` 
            : `Case ${c.caseNumber} has been restored to active logs.`,
          "info"
        );
        return {
          ...c,
          isArchived: nextArchived
        };
      }
      return c;
    });
    saveCases(updated);
  };

  const handleNotifyStakeholders = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const c = cases.find((x) => x.id === id);
    if (c) {
      showToast(
        `ALERT: Full Forensic and Safeguarding report with direct citations has been safely dispatched to parental guardians and child protection authorities for Case ${c.caseNumber}.`,
        "success"
      );
    }
  };

  const runGroomingAnalysis = async () => {
    if (!selectedCase) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/analyze-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatText: selectedCase.chatLog }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze chat log.");
      }

      const analysisResult: ChatAnalysis = await response.json();

      const updated = cases.map((c) => {
        if (c.id === selectedCase.id) {
          return {
            ...c,
            status: analysisResult.riskScore > 75 ? "FLAGGED" as const : "UNDER_REVIEW" as const,
            analysis: analysisResult,
          };
        }
        return c;
      });

      saveCases(updated);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err?.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level?: string) => {
    switch (level) {
      case "CRITICAL":
        return {
          bg: "bg-red-950/40",
          border: "border-red-500/50",
          text: "text-red-400",
          badge: "bg-red-500/20 text-red-300 border-red-500/30",
          accent: "#ef4444"
        };
      case "HIGH":
        return {
          bg: "bg-amber-950/40",
          border: "border-amber-500/50",
          text: "text-amber-400",
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          accent: "#f59e0b"
        };
      case "MODERATE":
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
          bg: "bg-slate-900",
          border: "border-slate-800",
          text: "text-slate-400",
          badge: "bg-slate-800 text-slate-300 border-slate-700",
          accent: "#64748b"
        };
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "FLAGGED":
        return "bg-red-500/10 text-red-400 border border-red-500/25";
      case "UNDER_REVIEW":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/25";
      case "OPEN":
        return "bg-[#c5a850]/10 text-[#e6c65e] border border-amber-500/20";
      case "RESOLVED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
      default:
        return "bg-[#121212] text-slate-400 border border-[#222]";
    }
  };

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="case-manager-root">
      {/* LEFT COLUMN: Case File List */}
      <div className="lg:col-span-4 flex flex-col gap-4" id="case-files-sidebar">
        <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#e6c65e]" />
              <h2 className="font-display font-medium text-lg text-slate-100">Active Case Scans</h2>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              id="btn-open-new-case"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#c5a850] to-[#e6c65e] hover:brightness-110 text-black rounded-lg text-xs font-bold transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              New Case
            </button>
          </div>

          {cases.length > 0 && (
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-900 text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cases.length > 0 && bulkSelectedIds.length === cases.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setBulkSelectedIds(cases.map((c) => c.id));
                    } else {
                      setBulkSelectedIds([]);
                    }
                  }}
                  className="w-3.5 h-3.5 rounded border-amber-500/30 text-[#e6c65e] bg-black focus:ring-amber-500/20 accent-amber-500 cursor-pointer"
                />
                <span className="text-slate-400 font-medium">
                  {bulkSelectedIds.length > 0 ? `${bulkSelectedIds.length} cases selected` : "Select All"}
                </span>
              </div>
              {bulkSelectedIds.length > 0 && (
                <button
                  onClick={() => setBulkSelectedIds([])}
                  className="text-amber-500 hover:text-amber-400 font-mono text-[10px] font-semibold uppercase tracking-wider"
                >
                  Clear Selection
                </button>
              )}
            </div>
          )}

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1" id="case-list-container">
            {cases.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No investigations filed. Click "New Case" to start.
              </div>
            ) : (
              cases.map((c) => {
                const colors = getRiskColor(c.analysis?.riskLevel);
                return (
                  <div
                    key={c.id}
                    id={`case-card-${c.id}`}
                    onClick={() => {
                      setSelectedCaseId(c.id);
                      setIsCreating(false);
                      setAnalysisError(null);
                    }}
                    className={`group relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                      c.analysis ? "pl-5" : ""
                    } ${
                      c.isArchived 
                        ? "opacity-60 saturate-75 hover:opacity-100 hover:saturate-100" 
                        : ""
                    } ${
                      selectedCaseId === c.id
                        ? "bg-[#141414] border-amber-500/60 shadow-md shadow-amber-500/10"
                        : c.isPriority 
                          ? "bg-amber-950/10 border-amber-500/40 shadow-sm shadow-amber-500/5 hover:bg-[#101010]"
                          : "bg-black/40 border-amber-500/5 hover:bg-[#101010]"
                    }`}
                  >
                    {/* Severity Left Color-coded accent strip */}
                    {c.analysis && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300"
                        style={{ backgroundColor: colors.accent, boxShadow: `0 0 8px ${colors.accent}40` }}
                      />
                    )}

                    {/* Floating Quick Actions Menu */}
                    <div 
                      className="absolute right-2 top-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 bg-black/95 border border-amber-500/20 px-1.5 py-1 rounded-lg shadow-xl z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleTogglePriority(c.id, e)}
                        className={`p-1.5 rounded transition ${
                          c.isPriority 
                            ? "text-[#e6c65e] bg-amber-500/15" 
                            : "text-slate-400 hover:text-[#e6c65e] hover:bg-zinc-800"
                        }`}
                        title={c.isPriority ? "Remove Priority Flag" : "Flag as Priority"}
                      >
                        <Flag className={`w-3.5 h-3.5 ${c.isPriority ? "fill-[#e6c65e]" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => handleToggleArchive(c.id, e)}
                        className={`p-1.5 rounded transition ${
                          c.isArchived 
                            ? "text-amber-500 bg-amber-500/15" 
                            : "text-slate-400 hover:text-white hover:bg-zinc-800"
                        }`}
                        title={c.isArchived ? "Restore Case" : "Archive Case"}
                      >
                        <Archive className={`w-3.5 h-3.5 ${c.isArchived ? "fill-amber-500/20" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => handleNotifyStakeholders(c.id, e)}
                        className="text-slate-400 hover:text-emerald-400 p-1.5 rounded hover:bg-zinc-800 transition"
                        title="Notify Stakeholder"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-px h-3 bg-zinc-800 mx-0.5" />
                      <button
                        onClick={(e) => handleDeleteCase(c.id, e)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition"
                        title="Purge Case File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={bulkSelectedIds.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkSelectedIds((prev) => [...prev, c.id]);
                            } else {
                              setBulkSelectedIds((prev) => prev.filter((id) => id !== c.id));
                            }
                          }}
                          className="w-3.5 h-3.5 rounded border-amber-500/30 text-[#e6c65e] bg-black focus:ring-amber-500/20 accent-amber-500 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                          {c.caseNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pr-12 lg:pr-0 lg:group-hover:pr-24 transition-all duration-200">
                        {c.isPriority && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/10 text-[#e6c65e] border border-amber-500/20 uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                            <Flag className="w-2.5 h-2.5 fill-[#e6c65e]" />
                            Priority
                          </span>
                        )}
                        {c.isArchived && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider flex items-center gap-0.5">
                            <Archive className="w-2.5 h-2.5" />
                            Archived
                          </span>
                        )}
                        {c.analysis && (
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-wider ${colors.badge}`}>
                            {c.analysis.riskLevel}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-[9px] font-semibold rounded ${getStatusBadgeClass(c.status)}`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-display font-medium text-sm text-slate-200 line-clamp-1 mb-1">{c.title}</h3>
                    <div className="flex flex-col gap-1 text-xs text-slate-400 mb-2.5">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 text-[11px]">Victim (Target):</span>
                        <span className="text-slate-300 font-medium">{c.victimAlias}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 text-[11px]">Suspect Profile:</span>
                        <span className="text-red-400/90 font-mono text-[11px] font-medium">{c.suspectAlias}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-amber-500/5 pt-2 mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                      {c.analysis ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-xs font-bold ${colors.text}`}>
                            {c.analysis.riskScore}% Threat
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">No AI Scan run</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bulk Actions Floating Menu */}
          <AnimatePresence>
            {bulkSelectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-x-0 bottom-0 bg-[#0c0c0d] border-t border-amber-500/30 p-4 flex flex-col gap-2.5 shadow-[0_-12px_30px_rgba(0,0,0,0.95)] backdrop-blur-md z-30"
              >
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs text-slate-200 font-mono font-bold tracking-wider uppercase">
                      Bulk Protocol Module
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-500/15 text-[#e6c65e] font-mono px-2 py-0.5 rounded-full border border-amber-500/20">
                    {bulkSelectedIds.length} Cases Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wide">
                  <button
                    onClick={() => handleBulkPriority(true)}
                    className="flex items-center justify-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-[#e6c65e] border border-amber-500/25 py-2.5 rounded-lg transition cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                    Prioritize
                  </button>
                  <button
                    onClick={() => handleBulkArchive(true)}
                    className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-slate-300 border border-zinc-800 py-2.5 rounded-lg transition cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5 text-amber-500/75" />
                    Archive
                  </button>
                  <button
                    onClick={handleBulkNotify}
                    className="flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 py-2.5 rounded-lg transition col-span-2 cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-emerald-400" />
                    Notify Stakeholders
                  </button>
                  <button
                    onClick={() => handleBulkPriority(false)}
                    className="flex items-center justify-center gap-1 text-slate-400 hover:text-white bg-[#111] hover:bg-zinc-900 border border-zinc-900 py-2 rounded-lg transition cursor-pointer"
                  >
                    Standard Priority
                  </button>
                  <button
                    onClick={() => handleBulkArchive(false)}
                    className="flex items-center justify-center gap-1 text-slate-400 hover:text-white bg-[#111] hover:bg-zinc-900 border border-zinc-900 py-2 rounded-lg transition cursor-pointer"
                  >
                    Restore Cases
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2.5 rounded-lg transition col-span-2 cursor-pointer font-bold tracking-wider"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    Purge Selected Files
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Intelligence Quick Stats */}
        <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-4 shadow-sm" id="case-stats-box">
          <h3 className="font-display font-medium text-sm text-slate-300 mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#e6c65e]" />
            Detection Matrix Summary
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-[#050505] p-2.5 rounded-lg border border-amber-500/5">
              <span className="block text-2xl font-mono font-bold text-slate-200">{cases.length}</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Cases</span>
            </div>
            <div className="bg-[#050505] p-2.5 rounded-lg border border-amber-500/5">
              <span className="block text-2xl font-mono font-bold text-[#e6c65e]">
                {cases.filter((c) => c.analysis?.riskLevel === "CRITICAL" || c.analysis?.riskLevel === "HIGH").length}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">High/Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Case Detail & Active Investigation */}
      <div className="lg:col-span-8 flex flex-col gap-6" id="case-detail-panel">
        <AnimatePresence mode="wait">
          {isCreating ? (
            /* Open New Case Form */
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="new-case-form"
              onSubmit={handleCreateCase}
              className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-6 flex flex-col gap-4 shadow-md"
            >
              <div className="border-b border-amber-500/10 pb-3">
                <h3 className="font-display font-bold text-xl text-slate-100">Initiate Grooming Investigation Case</h3>
                <p className="text-slate-400 text-xs">Enter suspicious chat logs and metadata to establish early detection scans.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300" htmlFor="case-title-input">Investigation Title *</label>
                  <input
                    id="case-title-input"
                    type="text"
                    required
                    placeholder="e.g., Discord Gaming Room #492 Contact"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-black border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div className="flex grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300" htmlFor="case-victim-input">Victim (Target) Alias</label>
                    <input
                      id="case-victim-input"
                      type="text"
                      placeholder="e.g., Emma (12)"
                      value={newVictim}
                      onChange={(e) => setNewVictim(e.target.value)}
                      className="bg-black border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300" htmlFor="case-suspect-input">Suspect Alias/Tag</label>
                    <input
                      id="case-suspect-input"
                      type="text"
                      placeholder="e.g., Xenon_Gamer_99"
                      value={newSuspect}
                      onChange={(e) => setNewSuspect(e.target.value)}
                      className="bg-black border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="case-chatlog-input">Chat Log Transcript (Verbatim Dialogue) *</label>
                <textarea
                  id="case-chatlog-input"
                  required
                  rows={8}
                  placeholder="Paste chat dialogue here. Label lines like 'Suspect: Hey, don't tell your mom.' or 'Child: Okay.'"
                  value={newChatLog}
                  onChange={(e) => setNewChatLog(e.target.value)}
                  className="bg-black border border-amber-500/10 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="case-notes-input">Investigative Notes / Context</label>
                <textarea
                  id="case-notes-input"
                  rows={2}
                  placeholder="Additional context, platforms used, time frame, parental notifications already sent, etc."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="bg-black border border-amber-500/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2 border-t border-amber-500/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-amber-500/10 text-slate-400 hover:text-slate-200 hover:bg-black/50 text-xs font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-case"
                  className="px-4 py-2 bg-gradient-to-r from-[#c5a850] to-[#e6c65e] text-black text-xs font-bold rounded-lg transition hover:brightness-110 shadow-md"
                >
                  Open Case File
                </button>
              </div>
            </motion.form>
          ) : selectedCase ? (
            /* Active Case File details */
            <motion.div
              key={selectedCase.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
              id="active-case-file-wrapper"
            >
              {/* Header Box */}
              <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs text-[#e6c65e] font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        {selectedCase.caseNumber}
                      </span>
                      <span className="text-xs text-slate-500">
                        Opened on {new Date(selectedCase.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-xl text-slate-100">{selectedCase.title}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      id="btn-trigger-ai-scan"
                      disabled={isAnalyzing}
                      onClick={runGroomingAnalysis}
                      className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c5a850] to-[#e6c65e] hover:brightness-110 text-black rounded-lg text-xs font-bold shadow-md transition-all duration-200 ${
                        isAnalyzing ? "opacity-60 cursor-not-allowed animate-pulse" : "hover:shadow-lg hover:-translate-y-0.5"
                      }`}
                    >
                      <Brain className="w-4 h-4 stroke-[2.5]" />
                      {isAnalyzing ? "AI Scanning Dialogue..." : "Execute Forensic AI Scan"}
                    </button>

                    {selectedCase.analysis && (
                      <>
                        <button
                          id="btn-export-pdf-report"
                          onClick={() => exportCaseReportPDF(selectedCase)}
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-amber-500/30 hover:border-amber-500/60 text-[#e6c65e] hover:bg-zinc-800 rounded-lg text-xs font-bold shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                        >
                          <FileText className="w-4 h-4 text-[#e6c65e]" />
                          Export PDF
                        </button>
                        <button
                          id="btn-export-json-report"
                          onClick={() => exportCaseReportJSON(selectedCase)}
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-amber-500/30 hover:border-amber-500/60 text-[#e6c65e] hover:bg-zinc-800 rounded-lg text-xs font-bold shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                        >
                          <FileCode className="w-4 h-4 text-[#e6c65e]" />
                          Export JSON Document
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                  <div className="bg-black p-3 rounded-lg border border-amber-500/5">
                    <span className="text-slate-500 block mb-0.5">Victim Alias / Target</span>
                    <span className="font-medium text-slate-200 text-sm flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#e6c65e]" />
                      {selectedCase.victimAlias}
                    </span>
                  </div>
                  <div className="bg-black p-3 rounded-lg border border-amber-500/5">
                    <span className="text-slate-500 block mb-0.5">Suspect Profiler Tag</span>
                    <span className="font-mono font-medium text-red-400 text-sm">
                      @{selectedCase.suspectAlias}
                    </span>
                  </div>
                  <div className="bg-black p-3 rounded-lg border border-amber-500/5">
                    <span className="text-slate-500 block mb-0.5">Investigation Status</span>
                    <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded font-semibold ${getStatusBadgeClass(selectedCase.status)}`}>
                      {selectedCase.status}
                    </span>
                  </div>
                </div>

                {selectedCase.notes && (
                  <div className="mt-4 bg-black/50 p-3 rounded-lg border border-amber-500/5 text-xs">
                    <span className="text-slate-500 font-semibold block mb-1">Investigative Context:</span>
                    <p className="text-slate-300 leading-relaxed">{selectedCase.notes}</p>
                  </div>
                )}
              </div>

              {/* Chat Log & Analysis grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Chat Log View */}
                <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-amber-500/10 pb-2.5">
                    <span className="font-display font-medium text-sm text-slate-300 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-[#e6c65e]" />
                      Forensic Chat Transcript
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Verbatim Dialogue</span>
                  </div>

                  <div className="bg-black rounded-xl p-4 border border-amber-500/5 flex-1 flex flex-col">
                    <div className="font-mono text-xs text-slate-300 leading-relaxed space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {selectedCase.chatLog.split("\n").map((line, i) => {
                        const isSuspect = line.toLowerCase().startsWith(selectedCase.suspectAlias.toLowerCase()) || 
                                          line.toLowerCase().includes("suspect");
                        return (
                          <div
                            key={i}
                            className={`p-2 rounded-lg ${
                              isSuspect
                                ? "bg-red-500/5 border-l-2 border-red-500/30 text-red-200/95"
                                : "bg-amber-500/5 border-l-2 border-amber-500/20 text-[#e6c65e]/95"
                            }`}
                          >
                            {line}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AI Analysis View */}
                <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-5 flex flex-col gap-4 shadow-sm" id="ai-scan-results-box">
                  <div className="flex items-center justify-between border-b border-amber-500/10 pb-2.5">
                    <span className="font-display font-medium text-sm text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#e6c65e]" />
                      AI Intelligence Evaluation
                    </span>
                    <div className="flex items-center gap-2.5">
                      {selectedCase.analysis && (
                        <div className="flex items-center gap-1.5">
                          <button
                            id="btn-mini-export-pdf"
                            onClick={() => exportCaseReportPDF(selectedCase)}
                            className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-[#e6c65e] px-2 py-1 rounded border border-amber-500/20 text-[10px] font-bold tracking-wide transition cursor-pointer"
                            title="Export PDF forensic report"
                          >
                            <FileText className="w-3 h-3" />
                            PDF
                          </button>
                          <button
                            id="btn-mini-export-json"
                            onClick={() => exportCaseReportJSON(selectedCase)}
                            className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-[#e6c65e] px-2 py-1 rounded border border-amber-500/20 text-[10px] font-bold tracking-wide transition cursor-pointer"
                            title="Export formatted JSON investigation report"
                          >
                            <FileCode className="w-3 h-3" />
                            JSON
                          </button>
                        </div>
                      )}
                      <span className="text-[10px] text-[#e6c65e] font-mono font-bold uppercase tracking-wide">
                        The Shield-17799 Core
                      </span>
                    </div>
                  </div>

                  {isAnalyzing ? (
                    /* Loading State */
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 flex-1">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-amber-400 animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-300">Evaluating Conversational Tactics...</p>
                        <p className="text-xs text-slate-500 mt-1">Applying child grooming psychological vectors</p>
                      </div>
                    </div>
                  ) : analysisError ? (
                    /* Error state */
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 flex-1">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-300 text-sm">Forensic Sweep Failed</h4>
                        <p className="text-xs text-red-400/90 mt-1 leading-relaxed">{analysisError}</p>
                        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                          Please verify your GEMINI_API_KEY in the {"**Settings > Secrets**"} panel or test with another conversation.
                        </p>
                      </div>
                    </div>
                  ) : selectedCase.analysis ? (
                    /* Results displayed */
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-1" id="analysis-report-inner">
                      {/* Risk Score Gauge & Phase */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 bg-black border border-amber-500/10 rounded-xl p-3.5">
                        <div className="sm:col-span-4 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-amber-500/10 pb-3 sm:pb-0 sm:pr-3.5">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide mb-1">Risk Score</span>
                          <div className="relative flex items-center justify-center w-18 h-18">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="36"
                                cy="36"
                                r="30"
                                className="stroke-[#111]"
                                strokeWidth="5"
                                fill="transparent"
                              />
                              <circle
                                cx="36"
                                cy="36"
                                r="30"
                                className="transition-all duration-500 ease-out"
                                strokeWidth="5"
                                fill="transparent"
                                stroke={getRiskColor(selectedCase.analysis.riskLevel).accent}
                                strokeDasharray={2 * Math.PI * 30}
                                strokeDashoffset={2 * Math.PI * 30 * (1 - selectedCase.analysis.riskScore / 100)}
                              />
                            </svg>
                            <span className={`absolute font-mono text-lg font-bold ${getRiskColor(selectedCase.analysis.riskLevel).text}`}>
                              {selectedCase.analysis.riskScore}%
                            </span>
                          </div>
                          <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 border rounded uppercase ${getRiskColor(selectedCase.analysis.riskLevel).badge}`}>
                            {selectedCase.analysis.riskLevel}
                          </span>
                        </div>

                        <div className="sm:col-span-8 flex flex-col justify-center">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Grooming Phase Classification</span>
                          <h4 className="font-display font-semibold text-[#e6c65e] text-sm mt-0.5">
                            {selectedCase.analysis.behavioralPhase}
                          </h4>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide mt-2.5 block">Child Vulnerability Index</span>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                            {selectedCase.analysis.childVulnerabilityAssessment}
                          </p>
                        </div>
                      </div>

                      {/* Investigative Rationale */}
                      <div className="bg-black p-3 rounded-xl border border-amber-500/10">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide flex items-center gap-1.5 mb-1">
                          <AlertCircle className="w-3.5 h-3.5 text-[#e6c65e]" />
                          Investigative Behavioral Rationale
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {selectedCase.analysis.investigativeRationale}
                        </p>
                      </div>

                      {/* Intervention list */}
                      <div className="bg-black p-3 rounded-xl border border-amber-500/10">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide flex items-center gap-1.5 mb-2 text-[#e6c65e]">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Recommended Intervention Protocol
                        </span>
                        <ul className="space-y-1.5">
                           {selectedCase.analysis.recommendedInterventions.map((item, index) => (
                            <li key={index} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                              <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* Empty analysis state */
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-3.5 flex-1 bg-black/40 border border-dashed border-amber-500/20 rounded-xl">
                      <Brain className="w-8 h-8 text-amber-500/30 animate-pulse" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400">No Evaluation Initiated</h4>
                        <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed mx-auto">
                          Click "Execute Forensic AI Scan" in the case header above to deploy cognitive neural screening on this log.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tactic detail breakdown section (Rendered only when active analysis is done) */}
              {selectedCase.analysis && selectedCase.analysis.detectedTactics.length > 0 && (
                <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-5 shadow-sm" id="tactical-evidence-logs">
                  <h3 className="font-display font-medium text-sm text-slate-300 border-b border-amber-500/10 pb-3 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    Specific Tactical Evidence Catalog ({selectedCase.analysis.detectedTactics.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCase.analysis.detectedTactics.map((item, index) => (
                      <div key={index} className="bg-black border border-amber-500/5 rounded-xl p-4 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-red-400 bg-red-950/20 border border-red-900/40 px-2 py-0.5 rounded">
                            {item.tacticName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Tactic #{index + 1}</span>
                        </div>
                        <div className="bg-[#080808] p-2.5 border-l-2 border-[#c5a850] rounded text-xs font-mono text-slate-300">
                          <span className="text-[10px] text-slate-500 block mb-1">LOGGED EVIDENCE:</span>
                          "{item.evidenceSnippet}"
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          <strong className="text-slate-300">Analysis:</strong> {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* Selected Case deleted / Empty Dashboard */
            <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm h-[400px]">
              <Shield className="w-12 h-12 text-amber-500/20 animate-pulse" />
              <div>
                <h3 className="font-display font-bold text-lg text-slate-300">Select an Active Investigation Case</h3>
                <p className="text-slate-500 text-xs max-w-sm mt-1 leading-relaxed mx-auto">
                  Click on any case file in the left sidebar to analyze grooming transcripts, suspect aliases, and compile safety intervention protocol.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* Premium Success/Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-[9999] max-w-md bg-black/95 border border-amber-500/30 p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-start gap-3"
          >
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#e6c65e]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-mono font-bold text-[#e6c65e] tracking-wider uppercase mb-1">
                {notification.type === "success" ? "System Protocol Dispatched" : "Intelligence Updated"}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {notification.message}
              </p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-slate-500 hover:text-slate-300 text-xs p-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
