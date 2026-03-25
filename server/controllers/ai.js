const { GoogleGenerativeAI } = require("@google/generative-ai");
const Task = require("../models/Task");
const FocusSession = require("../models/FocusSession");
const Insight = require("../models/Insight");
const Journal = require("../models/Journal");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Get user's insight history
// @route   GET /api/ai/daily-insight
// @access  Private
exports.getDailyInsight = async (req, res) => {
  try {
    const insights = await Insight.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(insights);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// @desc    Generate and save a new insight
// @route   POST /api/ai/daily-insight/generate
// @access  Private
exports.generateInsight = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);

    // 1. GATHER CONTEXT
    const recentTasks = await Task.find({
      user: userId,
      updatedAt: { $gte: twoDaysAgo },
    }).select("title status category -_id");

    const recentFocus = await FocusSession.find({
      user: userId,
      completedAt: { $gte: twoDaysAgo },
    });

    const recentJournals = await Journal.find({
      user: userId,
      createdAt: { $gte: twoDaysAgo },
    }).select("content mood createdAt -_id");

    const totalFocusMinutes = recentFocus.reduce(
      (sum, s) => sum + s.durationMinutes,
      0,
    );

    // 2. THE JSON PROMPT
    const systemPrompt = `
      You are a warm, highly empathetic, and incredibly encouraging friend and mentor. Your goal is to make the user feel seen, proud of their progress, and gently supported. like a trusted friend who pays attention. No corporate wellness fluff, no hollow affirmations.

Analyze the user's last 48 hours:

RECENT TASKS: ${JSON.stringify(recentTasks)}
TOTAL FOCUS TIME: ${totalFocusMinutes} minutes
RECENT JOURNAL ENTRIES: ${JSON.stringify(recentJournals)}

Write ONE insight (max 2 sentences). Be specific to their actual data — mention real task names, numbers, or journal themes where natural.
Be honest and grounded, but kind. Avoid phrases like "keep it up", "remember to", "it's important to", or anything that sounds like a motivational poster.

Also provide 2 to 3 "contextPills" — very short data tags like "120m Focus", "3 Tasks", "Journal: Stressed".

You MUST respond using this exact JSON schema:
{
  "content": "Your insight here.",
  "contextPills": ["Tag 1", "Tag 2"]
}
    `;

    // 3. CALL GEMINI
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    // Parse the JSON string Gemini gave us into a real JavaScript object
    const parsedData = JSON.parse(responseText);

    // 4. SAVE TO DATABASE
    const newInsight = await Insight.create({
      user: userId,
      content: parsedData.content,
      contextPills: parsedData.contextPills || [],
    });

    // Send the brand new insight back to the frontend
    res.json(newInsight);
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ message: "Failed to generate insight" });
  }
};
