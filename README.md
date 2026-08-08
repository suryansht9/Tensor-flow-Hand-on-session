# 🎓 LearnCraft Gemma - Adaptive AI Study & Quiz Engine
> Built for **Build with Gemma (TFUG Prayagraj / AI Prayagraj)** Hackathon.  
> Live Demo: [learncraft-gemma.vercel.app](https://learncraft-gemma.vercel.app) *(Replace after deploying)*

---

## 🌟 Overview
**LearnCraft Gemma** is an AI-powered educational suite built exclusively on Google AI Studio's **Gemma 2 (`gemma-2-27b-it`)** model. It transforms raw notes or study topics into interactive multiple-choice quizzes, 3D flip flashcards, Feynman technique analogies, and visual concept maps.

---

## 🔒 Security & Architecture Compliance
- **Strictly Gemma API**: Powered 100% by Gemma 2 instruction-tuned models (`gemma-2-27b-it`). *No ChatGPT, Gemini, or Claude APIs used.*
- **Backend Key Protection**: `GOOGLE_API_KEY` is called **exclusively** inside Next.js App Router server API routes (`/src/app/api/gemma/route.ts`). It is never exposed to the client browser.
- **Vercel Timeout Resolution**: Configured `export const maxDuration = 60;` in the API route to handle long model responses cleanly.

---

## 🚀 Local Development Setup

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/your-username/learncraft-gemma.git
   cd learncraft-gemma
   npm install
   ```

2. **Configure Environment Variable**:
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_API_KEY=AIzaSyYourGoogleAIStudioKey
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Step-by-Step Hackathon Deployment Guide

### 1. Push Code to GitHub (Step 6 & 8)
```bash
git init
git add .
git commit -m "Initial commit of LearnCraft Gemma"
git branch -M main
git remote add origin https://github.com/your-username/learncraft-gemma.git
git push -u origin main
```
*Make sure your repository is set to **Public**.*

### 2. Deploy to Vercel (Step 9 & 10)
1. Go to [Vercel New Project](https://vercel.com/new).
2. Import your `learncraft-gemma` repository.
3. Expand **Environment Variables** and add:
   - Key: `GOOGLE_API_KEY`
   - Value: `AIzaSy...` (your Google AI Studio key)
4. Click **Deploy**.
5. Save your live `.vercel.app` URL!

---

## 📝 Pre-filled Kaggle Writeup Draft (Step 14)
*Copy and paste the template below into your Kaggle Hackathon Writeup:*

```markdown
# LearnCraft Gemma: Adaptive AI Study Engine & Interactive Quiz Generator

**Title**: LearnCraft Gemma  
**Subtitle**: AI-powered study companion converting notes into interactive quizzes, 3D flashcards, and Feynman breakdowns.  
**Submission Track**: General / Education  

---

### 💡 Inspiration
Students often struggle to break down dense academic concepts, generate flashcards, or self-test their knowledge efficiently. LearnCraft Gemma solves this by converting raw notes or topics into intuitive analogies, interactive 5-question MCQs with hints, 3D flippable flashcards, and visual mind maps.

### 🛠️ How We Built It
- **Frontend & Fullstack**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons.
- **AI Backend Integration**: Server-side API route (`/api/gemma`) communicating securely with Google AI Studio's `gemma-2-27b-it` model.
- **Security**: Strict server-side API key protection with `maxDuration = 60` for Vercel deployment.

### 🎥 The Prototype
- **Live Demo Video (2-3 min)**: [Insert Your YouTube Link Here]
- **GitHub Repository**: [Insert Your GitHub Repo Link Here]

### 🚧 Challenges We Ran Into
Managing JSON schema consistency for MCQ quizzes from LLM outputs was a key challenge. We solved this by designing precise prompt instructions for Gemma and implementing robust server-side fallback parsing.

---

### 🔗 Attachments
- **Deployed Project Link**: https://your-project.vercel.app
- **GitHub Repo Link**: https://github.com/your-username/learncraft-gemma
```

---

## 🗳️ Final Submission (Step 15)
Submit the 4 links in the [Official Google Form](https://forms.gle/xz9Zu7VWn8aEvM6k8):
1. Kaggle writeup link
2. GitHub repo link
3. Deployed Vercel link (`.vercel.app`)
4. Demo video link (YouTube Unlisted)
