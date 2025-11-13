# PM Resume Refiner

AI-Powered Product Management Resume Enhancement Tool  
Built for Leland+ by Nathan Tishgarten

## Overview

PM Resume Refiner is a Node.js application that leverages Claude AI to help product managers improve their resumes. The tool can parse resumes, enhance bullet points using PM best practices, and generate detailed rubric scores.

## Features

- **Resume Parsing**: Extract structured data from resume PDFs
- **Bullet Enhancement**: Transform resume bullets using the XYZ formula and PM best practices
- **Rubric Scoring**: Get detailed feedback across 5 key categories with constructive analysis

## Prerequisites

- Node.js (v14 or higher)
- An Anthropic API key
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ntish25/pm-resume-refiner
cd pm-resume-refiner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

Or create a `.env` file:
```
ANTHROPIC_API_KEY=your-api-key-here
PORT=3000
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Dependencies

This project uses the following npm packages:

- **express** (^4.18.2): Web server framework
- **@anthropic-ai/sdk** (^0.20.0): Anthropic Claude API client
- **cors** (^2.8.5): Cross-origin resource sharing middleware

## API Endpoints

### POST `/api/enhance`

Main endpoint that handles all resume enhancement actions.

**Request Body:**
```json
{
  "action": "parseResume" | "enhanceBullet" | "generateRubric",
  "data": { /* action-specific data */ }
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Usage

### 1. Parse Resume

Extracts structured data from a resume PDF.

**Request:**
```json
{
  "action": "parseResume",
  "data": {
    "fileType": "application/pdf",
    "base64Data": "<base64-encoded-pdf>"
  }
}
```

**Response:**
```json
{
  "result": "{\"name\": \"Full Name\", \"experiences\": [...]}"
}
```

### 2. Enhance Bullet Point

Improves a single resume bullet using PM best practices.

**Request:**
```json
{
  "action": "enhanceBullet",
  "data": {
    "bullet": "Worked on product features"
  }
}
```

**Response:**
```json
{
  "result": "{\"enhanced\": \"Led development of 3 product features that increased user engagement by 25%, by collaborating with engineering and design teams\"}"
}
```

### 3. Generate Rubric

Analyzes resume bullets and provides detailed scoring.

**Request:**
```json
{
  "action": "generateRubric",
  "data": {
    "bullets": [
      "Led global launch of in-app feature...",
      "Built product roadmap..."
    ]
  }
}
```

**Response:**
```json
{
  "result": "{\"overall\": 85, \"categories\": [...]}"
}
```

## Claude AI Prompts

### Resume Parsing Prompt

```
Extract this resume into structured JSON format. Return ONLY valid JSON with no other text.

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

Extract ALL bullet points exactly as written.
```

### Bullet Enhancement Prompt

```
You are a PM resume expert. Enhance this resume bullet to be PM-focused and impactful. 
Keep it CONCISE and realistic - don't add filler words. NEVER make up metrics or numbers 
(use "__%" if you can't calculate the exact number)

Original bullet: "[USER_BULLET]"

Use the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]"

EXAMPLES OF GOOD PM BULLETS:
- "Led global launch of in-app feature using telematics data that reduced driver phone 
  handling by 4%"
- "Spearheaded three marketing campaigns controlling $30k spend, resulting in 47% customer 
  acquisition growth"
- "Built product roadmap for manufacturing analytics startup by interviewing 100+ heads 
  of manufacturing in APAC and Europe, allowing engineers to ship features 6 months ahead 
  of schedule"

Return ONLY valid JSON (no markdown):
{
  "enhanced": "The enhanced bullet using PM best practices - keep under 2 lines, use strong 
  action verbs like [Led, Shipped, Built, Launched, Developed, Spearheaded, Drove], include 
  metrics"
}
```

### Rubric Generation Prompt

```
You are a product management resume expert. Analyze this resume and provide a detailed 
rubric score.

Resume bullets:
[BULLETS_ARRAY]

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
      "feedback": "Assess execution ability, product sense, leadership through influence, 
      cross-functional collaboration"
    },
    {
      "name": "Quantifiable Impact",
      "score": __,
      "feedback": "Evaluate use of metrics, percentages, dollar amounts, and XYZ formula"
    },
    {
      "name": "Action Verbs & Clarity",
      "score": __,
      "feedback": "Check for strong verbs (Led/Shipped/Drove vs worked/did), clarity, 
      conciseness"
    },
    {
      "name": "Leadership & Influence",
      "score": __,
      "feedback": "Assess examples of leading teams, driving results, managing stakeholders"
    }
  ]
}

Score each category 0-100. Be constructive but honest about weaknesses.
```

## Configuration

- **Model**: `claude-sonnet-4-5-20250929`
- **Max Tokens**:
  - Resume parsing: 4000
  - Bullet enhancement: 1000
  - Rubric generation: 2000
- **Request Size Limit**: 50MB

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Invalid action
- `500`: Server error

Error responses include a message:
```json
{
  "error": "Error message description"
}
```

## License

Built for Leland by Nathan Tishgarten

## Support

For issues or questions, please contact ntishgarten3@gatech.edu.
