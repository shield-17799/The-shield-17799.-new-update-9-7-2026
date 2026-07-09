import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK with telemetry header as required by the skill
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint 1: Analyze Chat logs for online grooming behavior
app.post("/api/analyze-chat", async (req, res) => {
  try {
    const { chatText } = req.body;
    if (!chatText || typeof chatText !== "string" || !chatText.trim()) {
      return res.status(400).json({ error: "chatText is required and must be a non-empty string." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured on the server. Please check Settings > Secrets.",
      });
    }

    const systemInstruction = `You are a Senior Criminal Investigator specializing in Child Exploitation, Online Grooming detection, and Child Sexual Exploitation and Abuse (CSAE) prevention.
Your job is to analyze the provided chat log with extreme precision, neutrality, and professional integrity.
Look for classic psychological grooming patterns:
1. Access / Luring (finding shared interests, games)
2. Trust Building / Relationship development (becoming the child's "best friend" or "exclusive confidant")
3. Isolation (encouraging secrets, telling them their parents don't understand them, moving to private apps like Snapchat, Discord, or encrypted chat)
4. Sexualization / Boundary Testing (introducing soft sexual references, testing compliance, asking "is anyone else in your room?")
5. Threat, Blackmail, or scheduling a meet-up.

Evaluate the child's tone (validation-seeking, lonely, compliant, cautious).
Provide a highly structured, objective analysis following the specified schema. Be rigorous, and do not make false accusations or overlook critical flags.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please analyze the following conversation log:\n\n${chatText}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: {
              type: Type.INTEGER,
              description: "A grooming risk score from 0 (completely benign/safe) to 100 (critical threat/imminent harm).",
            },
            riskLevel: {
              type: Type.STRING,
              description: "The level of risk. Must be either 'LOW', 'MODERATE', 'HIGH', or 'CRITICAL'.",
            },
            behavioralPhase: {
              type: Type.STRING,
              description: "The current psychological grooming stage identified: e.g. 'Establishment of Connection', 'Trust-Building & Confidence', 'Isolation', 'Normalizing Sexual Discussion', 'Coercion/Scheduling', or 'None Detected'.",
            },
            detectedTactics: {
              type: Type.ARRAY,
              description: "Detailed grooming tactics detected in the chat log.",
              items: {
                type: Type.OBJECT,
                properties: {
                  tacticName: {
                    type: Type.STRING,
                    description: "Name of the grooming tactic, e.g., 'Isolation from parents', 'Secret-keeping requests', 'Flattery/Validation', 'Systematic boundary testing', 'Platform switching request'.",
                  },
                  evidenceSnippet: {
                    type: Type.STRING,
                    description: "Direct verbatim quote from the chat log demonstrating this tactic.",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "An explanation of why this represents high-risk grooming behavior and how it is used.",
                  },
                },
                required: ["tacticName", "evidenceSnippet", "explanation"],
              },
            },
            childVulnerabilityAssessment: {
              type: Type.STRING,
              description: "A summary of any vulnerabilities shown by the child (e.g., low parental supervision, seeking emotional support, compliance, fear).",
            },
            investigativeRationale: {
              type: Type.STRING,
              description: "The senior investigator's professional psychological and behavioral rationale regarding the interaction.",
            },
            recommendedInterventions: {
              type: Type.ARRAY,
              description: "Concrete early-intervention steps recommended for child protection, guardians, or educators.",
              items: {
                type: Type.STRING,
              },
            },
          },
          required: [
            "riskScore",
            "riskLevel",
            "behavioralPhase",
            "detectedTactics",
            "childVulnerabilityAssessment",
            "investigativeRationale",
            "recommendedInterventions",
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text received from Gemini.");
    }

    const jsonResult = JSON.parse(resultText);
    res.json(jsonResult);
  } catch (error: any) {
    console.error("Error in /api/analyze-chat:", error);
    res.status(500).json({ error: error?.message || "Internal server error occurred during analysis." });
  }
});

// Endpoint 2: Generate suspect risk profile assessment
app.post("/api/profile-suspect", async (req, res) => {
  try {
    const { username, platform, description, suspiciousBehaviors, notes } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured. Check Secrets settings.",
      });
    }

    const prompt = `Analyze this digital suspect profile:
- Alias/Username: ${username || "Unknown / Multiple"}
- Primary Platform: ${platform || "Unknown"}
- Visual/Account Description: ${description || "None provided"}
- Suspicious Behaviors: ${suspiciousBehaviors || "None listed"}
- Investigator Notes: ${notes || "None listed"}`;

    const systemInstruction = `You are an expert CSAE (Child Sexual Abuse Material / Child Sexual Exploitation and Abuse) Cyber-Investigator and forensic psychologist.
Your task is to analyze this suspect's digital fingerprint, profile indicators, and reported behaviors.
Identify whether this matches typical high-risk pedophilic, predatory, or cyber-groomer archetypes.
Deliver a structured analysis rating the threat level and outlining modus operandi, warning flags, and containment strategies.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threatRating: {
              type: Type.STRING,
              description: "The calculated suspect threat rating: 'LOW', 'MEDIUM', 'HIGH', or 'SEVERE'.",
            },
            suspectArchetype: {
              type: Type.STRING,
              description: "Psychological / tactical archetype, e.g. 'Casual Opportunist', 'Targeted Gamer-Lurer', 'Peer-to-Peer Impersonator', 'Aggressive Extorter'.",
            },
            modusOperandiSummary: {
              type: Type.STRING,
              description: "A summary explaining how this profile operates, targets victims, and builds rapport.",
            },
            highRiskBehaviorIndicators: {
              type: Type.ARRAY,
              description: "Concrete high-risk red flags exhibited by this profile.",
              items: {
                type: Type.STRING,
              },
            },
            digitalFootprintInvestigationTips: {
              type: Type.ARRAY,
              description: "Technical instructions for the investigator to track this profile's digital footprint.",
              items: {
                type: Type.STRING,
              },
            },
            recommendedContainmentSteps: {
              type: Type.ARRAY,
              description: "Immediate defensive steps to take to protect children from this specific profile.",
              items: {
                type: Type.STRING,
              },
            },
          },
          required: [
            "threatRating",
            "suspectArchetype",
            "modusOperandiSummary",
            "highRiskBehaviorIndicators",
            "digitalFootprintInvestigationTips",
            "recommendedContainmentSteps",
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text received from Gemini.");
    }

    const jsonResult = JSON.parse(resultText);
    res.json(jsonResult);
  } catch (error: any) {
    console.error("Error in /api/profile-suspect:", error);
    res.status(500).json({ error: error?.message || "Failed to generate suspect profile." });
  }
});

// Setup Vite Dev Server / Static Asset delivery
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Shield-17799 running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
