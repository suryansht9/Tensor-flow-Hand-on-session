import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnCraft Gemma | Adaptive AI Study & Quiz Companion",
  description: "Transform complex study notes into interactive quizzes, flashcards, concept maps, and simplified explanations powered by Google AI Studio Gemma API.",
  keywords: ["Gemma", "Build with Gemma", "TFUG Prayagraj", "AI Study Companion", "Quiz Generator", "Flashcards"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-mesh min-h-screen text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
