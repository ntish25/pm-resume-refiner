const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

// Initialize Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// API endpoint
app.post("/api/enhance", async (req, res) => {
  try {
    const { action, data } = req.body;

    let result;

    switch (action) {
      case "parseResume":
        result = await parseResume(data);
        break;
      case "enhanceBullet":
        result = await enhanceBullet(data);
        break;
      case "generateRubric":
        result = await generateRubric(data);
        break;
      default:
        return res.status(400).json({ error: "Invalid action" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function parseResume(data) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: data.fileType,
                data: data.base64Data,
              },
            },
            {
              type: "text",
              text: `Extract this resume into structured JSON format. Return ONLY valid JSON with no other text.

{
  "name": "Full Name",
  "experiences": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "dates": "Start - End",
      "bullets": [
        "First bullet point text",
        "Second bullet point text"
      ]
    }
  ]
}

Extract ALL bullet points exactly as written.`,
            },
          ],
        },
      ],
    });
    return { result: message.content[0].text };
  } catch (error) {
    throw error;
  }
}

async function enhanceBullet(data) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a PM resume expert. Enhance this resume bullet to be PM-focused and impactful. Keep it CONCISE and realistic - don't add filler words. NEVER make up metrics or numbers (use "__%" if you can't calculate the exact number)

Original bullet: "${data.bullet}"

Use the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]"

EXAMPLES OF GOOD PM BULLETS:
- "Led global launch of in-app feature using telematics data that reduced driver phone handling by 4%"
- "Spearheaded three marketing campaigns controlling $30k spend, resulting in 47% customer acquisition growth"
- "Built product roadmap for manufacturing analytics startup by interviewing 100+ heads of manufacturing in APAC and Europe, allowing engineers to ship features 6 months ahead of schedule"

Return ONLY valid JSON (no markdown):
{
  "enhanced": "The enhanced bullet using PM best practices - keep under 2 lines, use strong action verbs like [Led, Shipped, Built, Launched, Developed, Spearheaded, Drove], include metrics"
}`,
        },
      ],
    });
    return { result: message.content[0].text };
  } catch (error) {
    throw error;
  }
}

async function generateRubric(data) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a product management resume expert. Analyze this resume and provide a detailed rubric score.

Resume bullets:
${data.bullets.join("\n")}

Return ONLY valid JSON (no markdown):
{
  "overall": (0-100),
  "categories": [
    {
      "name": "Formatting & Grammar",
      "score": __,
      "feedback": "1-2 sentence explanation of strengths and weaknesses"
    },
    {
      "name": "PM Skills Demonstration",
      "score": __,
      "feedback": "Assess execution ability, product sense, leadership through influence, cross-functional collaboration"
    },
    {
      "name": "Quantifiable Impact",
      "score": __,
      "feedback": "Evaluate use of metrics, percentages, dollar amounts, and XYZ formula"
    },
    {
      "name": "Action Verbs & Clarity",
      "score": __,
      "feedback": "Check for strong verbs (Led/Shipped/Drove vs worked/did), clarity, conciseness"
    },
    {
      "name": "Leadership & Influence",
      "score": __,
      "feedback": "Assess examples of leading teams, driving results, managing stakeholders"
    }
  ]
}

Score each category 0-100. Be constructive but honest about weaknesses.`,
        },
      ],
    });

    return { result: message.content[0].text };
  } catch (error) {
    throw error;
  }
}

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});
