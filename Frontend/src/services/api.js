// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// API Service Class
class ApiService {
  constructor() {
    this.baseUrl = "http://localhost:3000";
    this.token = null; // Store JWT token after login
    this.officerId = null; // Store officer ID after login
  }

  // Set authentication credentials after login
  setAuth(token, officerId) {
    this.token = token;
    this.officerId = officerId;
  }

  // Helper to make authenticated requests
  async makeRequest(endpoint, method = "GET", body = null) {
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.token && this.officerId) {
      headers["Authorization"] = `Bearer ${this.token}`;
      headers["X-TRACE-OFFICER-ID"] = this.officerId;
    }

    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  // Authentication
  async login(credentials) {
    try {
      await delay(800);
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Store token and officer ID for subsequent requests
      this.setAuth(data.token, data.officer.id);

      return {
        success: true,
        data: {
          token: data.token,
          officer: {
            id: data.officer.id,
            name: data.officer.name,
            role: data.officer.role,
            email: data.officer.email,
          },
        },
      };
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  }

  // Suspect Management
  async getSuspects(filters = {}) {
    await delay(500);
    const query = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.platform && { platform: filters.platform }),
      ...(filters.riskLevel && { riskLevel: filters.riskLevel.toLowerCase() }),
    }).toString();

    const data = await this.makeRequest(`/suspects?${query}`);

    return {
      success: true,
      data: data.data.map((suspect) => ({
        id: suspect._id || suspect.id,
        name: suspect.name,
        aliases: suspect.aliases,
        platforms: suspect.platforms,
        riskScore: suspect.riskScore,
        riskLevel:
          suspect.riskScore >= 70
            ? "High"
            : suspect.riskScore >= 50
            ? "Medium"
            : "Low",
        status: suspect.status,
        lastSeen: suspect.createdAt,
      })),
      meta: data.meta,
    };
  }

  async getSuspect(id) {
    await delay(300);
    const data = await this.makeRequest(`/suspects/${id}`);
    return {
      success: true,
      data: {
        id: data._id || data.id,
        name: data.name,
        aliases: data.aliases,
        platforms: data.platforms,
        riskScore: data.riskScore,
        riskLevel:
          data.riskScore >= 70
            ? "High"
            : data.riskScore >= 50
            ? "Medium"
            : "Low",
        status: data.status,
        lastSeen: data.createdAt,
        messageSummary: data.messageSummary,
        mediaLinks: data.mediaLinks,
      },
    };
  }

  async createSuspect(suspectData) {
    await delay(800);
    // Only send fields the backend expects
    const payload = {
      name: suspectData.name,
      aliases: suspectData.aliases,
      platforms: suspectData.platforms,
      status: suspectData.status || 'active',
    };
    const data = await this.makeRequest("/suspects", "POST", payload);
    return {
      success: true,
      data: {
        id: data.id,
        message: data.message,
      },
    };
  }

  async updateSuspect(id, updates) {
    await delay(600);
    // Backend doesn't have a PATCH /suspects/:id endpoint, simulate update
    const suspect = await this.getSuspect(id);
    return {
      success: true,
      data: { ...suspect.data, ...updates },
    };
  }

  // OSINT Profile
  async getOSINTProfile(query) {
    await delay(1200);
    const data = await this.makeRequest("/osint/profile", "POST", {
      query,
      platforms: ["telegram", "instagram", "whatsapp"],
    });

    return {
      success: true,
      data: {
        username: query,
        riskScore: data.riskScore,
        platforms: data.extractedEntities.platforms || [
          "Telegram",
          "Instagram",
          "WhatsApp",
        ],
        linkedAccounts: data.relatedProfiles.map((profile, index) => ({
          platform: data.extractedEntities.platforms[index] || "Telegram",
          handle: profile,
        })),
        activity: {
          lastSeen: new Date().toISOString(),
          messageCount: 0, // Backend doesn't provide
          suspiciousKeywords: [], // Backend doesn't provide
          riskIndicators: [data.recommendation],
        },
        location: data.extractedEntities.locations[0] || "Unknown",
        associations: data.extractedEntities.contacts || [],
      },
    };
  }

  // Report Generation
  async generateReport(reportData) {
    await delay(2000);
    const data = await this.makeRequest("/reports/generate", "POST", {
      suspectId: reportData.suspectId,
      includeMessages: true,
      includeLegalSections: true,
      format: "pdf",
    });
    return {
      success: true,
      data: {
        reportUrl: data.reportUrl,
        generatedAt: data.generatedAt,
      },
    };
  }

  async getReports() {
    await delay(400);
    // Backend doesn't have a GET /reports endpoint, simulate with mock data
    return {
      success: true,
      data: [
        {
          id: "102810",
          title: "Report #102810 - Ravi Kumar Investigation",
          suspectId: "sus123",
          status: "In Progress",
          progress: 87,
          createdAt: "2024-09-24T08:00:00Z",
          updatedAt: "2024-09-24T10:30:00Z",
          type: "Investigation Report",
          assignedTo: "Inspector Ajay Sharma",
        },
      ],
    };
  }

  // Bot Management
  async startBot(botData) {
    await delay(1000);
    const data = await this.makeRequest("/bot/start", "POST", {
      suspectId: botData.targetId,
      initialPrompt:
        botData.initialMessage || "Hi, looking for some stuff. Available?",
      persona: botData.persona,
      maxTurns: 10,
    });

    return {
      success: true,
      data: {
        id: data.botId,
        name: `Undercover Bot #${data.botId}`,
        target: botData.target,
        platform: "Telegram",
        status: data.status,
        persona: botData.persona,
        createdAt: data.startTime,
        conversations: [],
      },
    };
  }

  async getBotConversation(botId) {
    await delay(300);
    const data = await this.makeRequest(`/bot/conversation/${botId}`);

    return {
      success: true,
      data: data.conversation.map((conv, index) => ({
        id: index + 1,
        timestamp: conv.timestamp,
        sender: conv.from.charAt(0).toUpperCase() + conv.from.slice(1),
        message: conv.text,
        riskLevel: data.flaggedTurns.some(
          (turn) => turn.turnIndex === index + 1
        )
          ? "High"
          : "Low",
      })),
    };
  }

  async stopBot(botId) {
    await delay(500);
    // eslint-disable-next-line no-unused-vars
    const data = await this.makeRequest(`/bot/${botId}`, "DELETE");

    return {
      success: true,
      data: {
        id: botId,
        status: "Stopped",
      },
    };
  }

  async getBots() {
    await delay(300);
    // Backend doesn't have a GET /bots endpoint, simulate with mock data
    return {
      success: true,
      data: [
        {
          id: 1,
          name: "Undercover Bot #1",
          target: "Ravi Kumar",
          platform: "Telegram",
          status: "Active",
          persona: "Drug Buyer",
          createdAt: "2024-09-24T09:00:00Z",
          conversations: [],
        },
      ],
    };
  }

  // Legal Assistant
  async getLegalAssistance(crimeDescription) {
    await delay(1500);
    const data = await this.makeRequest("/legal/assist", "POST", {
      description: crimeDescription,
      includeDraft: true,
    });

    return {
      success: true,
      data: data.suggestedSections.map((section) => ({
        section: section.code,
        title: section.description,
        punishment: "Unknown", // Backend doesn't provide
        relevance: "High", // Assume high relevance
        description: section.description,
      })),
    };
  }

  async generateFIR(firData) {
    await delay(2500);
    const data = await this.makeRequest("/legal/fir", "POST", {
      suspectId: firData.suspectId,
      incidentDate: firData.incidentDate || new Date().toISOString(),
      location: firData.location || "Unknown",
      evidence: firData.evidence || [],
      officerName: firData.officerName || "Unknown",
    });

    return {
      success: true,
      data: {
        id: `FIR-${data.firDocument.split("/").pop().replace(".pdf", "")}`,
        suspectId: firData.suspectId,
        status: "Draft",
        createdAt: new Date().toISOString(),
        downloadUrl: data.firDocument,
      },
    };
  }

  // Dashboard Statistics
  async getDashboardStats() {
    await delay(400);
    // Backend doesn't have a dashboard stats endpoint, simulate with mock data
    return {
      success: true,
      data: {
        totalSuspects: 3,
        activeSuspects: 1,
        highRiskSuspects: 1,
        totalReports: 1,
        pendingReports: 0,
        activeBots: 1,
        recentActivity: [
          {
            time: "10:40 AM",
            message: "3 new suspects identified! Please review.",
          },
          {
            time: "09:15 AM",
            message: "Report #102810 updated with new evidence.",
          },
          {
            time: "08:30 AM",
            message: "Bot conversation flagged as suspicious.",
          },
        ],
      },
    };
  }
}

export default new ApiService();
