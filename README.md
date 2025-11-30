<div align="center">

![MobiusPrime Banner](/images/image-github-mobius-prime-app-README.png)

# MobiusPrime: Your AI-Powered Marketing TeamMate

**Generate custom AI-powered personas, marketing playbooks, and content calendars based on the frameworks of Seth Godin, Gary Vaynerchuk, and Kieran Flanagan.**

[Features](#features) • [Frameworks](#frameworks) • [Installation](#installation) • [Usage](#usage)

</div>

---

## 🚀 Overview

MobiusPrime is a sophisticated React application that acts as your deep-research psychological marketing analyst. By leveraging the power of Google's **Gemini 3.0 Pro** and **Gemini 2.5** models, it transforms basic business inputs into highly differentiated marketing strategies.

Unlike generic AI tools, MobiusPrime is strictly prompted to avoid "best practices" and instead focuses on counter-intuitive, tribe-building, and attention-hacking strategies used by the world's top marketers.

## ✨ Features

*   **Strategy Generation:**
    *   **Deep-Dive Personas:** Psychological profiles including pain points, internal narratives, and "tribe" alignment.
    *   **Marketing Playbooks:** Differentiated tactics for user acquisition and branding.
    *   **Content Calendars:** 7, 14, 21, or 30-day schedules tailored to social platforms.
*   **AI Chat Assistant:** A floating chat widget to refine strategies, ask follow-up questions, or brainstorm ideas interactively.
*   **Multi-Model Support:** Switch between `Gemini 3.0 Pro` (Deep Reasoning), `Gemini 2.5 Pro`, and `Gemini 2.5 Flash`.
*   **History Management:** Local storage support to save, review, and retrieve past strategies.
*   **Export Options:** Download strategies as `.md` or `.txt`, or copy directly to the clipboard.
*   **Glassmorphic UI:** A stunning, modern interface built with Tailwind CSS.

## 🧠 Core Frameworks

This tool does not output generic marketing fluff. It follows a strict system prompt based on:

1.  **Seth Godin:** Branding, Purple Cow, Tribes, Permission Marketing.
2.  **Gary Vaynerchuk:** "Jab, Jab, Jab, Right Hook," Document don't create, Underpriced attention.
3.  **Kieran Flanagan:** Growth loops, SEO, Product-Led Growth.
4.  **Karma Kitchen (The 4 C's):** Community, Context, Conditions, Commitment.

## 🛠️ Installation & Setup

This project uses **pnpm** for fast, disk-space-efficient package management.

### Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **pnpm** (If you don't have it, install via `npm install -g pnpm`)
*   **Google Gemini API Key** (Get one here: [aistudio.google.com](https://aistudiocdn.com/google-ai-studio))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mobius-prime.git
cd mobius-prime
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm dev
```

The application should now be running at `http://localhost:5173` (or similar, depending on your Vite config).

## 📖 Usage

1.  **Enter API Key:** Launch the app and enter your Google Gemini API Key in the top-right corner.
2.  **Select Model:** Choose your preferred model (Gemini 3.0 Pro is recommended for deep strategy).
3.  **Fill Profile:** Complete the "Business Profile" on the left.
    *   *Tip:* You can type "AI to answer" in any field to let MobiusPrime infer the details.
4.  **Generate:** Select your desired output (Personas, Playbook, Calendar) and click **Generate**.
5.  **Chat:** Use the floating button in the bottom right to discuss specific details or refine the output.

## 📂 Project Structure

```text
/
├── components/         # React UI Components (GlassCard, ChatWidget, Layout)
├── services/           # API integration with @google/genai
├── types.ts            # TypeScript definitions
├── constants.ts        # System prompts and frameworks
├── App.tsx             # Main application logic
├── index.tsx           # Entry point
└── index.html          # HTML root
```

---

## ℹ️ Google AI Studio & SDK Info

This project utilizes the **@google/genai** SDK.

*   **Gemini API:** [Google AI Studio](https://aistudiocdn.com/google-ai-studio)
*   **Documentation:** [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

**Coding Guidelines followed:**
*   Initialized via `new GoogleGenAI({ apiKey: ... })`.
*   Uses `ai.models.generateContent` for text generation.
*   Uses `ai.chats.create` for the conversational agent.
*   Strict adherence to `gemini-3-pro-preview` and `gemini-2.5-*` model naming conventions.