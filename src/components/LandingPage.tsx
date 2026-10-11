import React from 'react';
import { Zap } from 'lucide-react';
import { blink } from '../lib/blink';

export function LandingPage() {
  const handleLogin = () => {
    blink.auth.login();
  };

  return (
    <div className="paper-grid min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/70 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/cursor_logo.png" alt="Cursor" className="w-8 h-8 rounded-xl" />
            <span className="font-black text-lg tracking-tight">CursorAI Studio</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogin}
              className="glass-key px-4 py-2 text-sm font-semibold rounded-full text-foreground"
            >
              Sign In
            </button>
            <button 
              onClick={handleLogin}
              className="mint-press px-4 py-2 text-sm font-bold rounded-full text-primary-foreground"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-24 left-[8%] hidden lg:block yellow-sticker rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Make it real</div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10 opacity-30" />

        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/70 bg-card text-xs font-bold text-foreground mb-8 shadow-[0_5px_12px_rgba(72,68,58,0.13)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Zap className="w-3 h-3" />
            <span>Now with GPT-5.2 & Claude 4.5 Sonnet</span>
          </div>
          
          <h1 className="studio-display text-5xl lg:text-7xl font-black tracking-[-0.065em] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Build software <br />
            <span className="font-serif italic font-medium tracking-[-0.04em]">at the speed of thought.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            The AI-first code editor designed for pair programming. 
            Build, edit, and chat with your codebase using state-of-the-art AI models.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <button 
              onClick={handleLogin}
              className="mint-press w-full sm:w-auto px-8 py-4 rounded-2xl text-primary-foreground font-bold text-lg"
            >
              Start Coding Now
            </button>
            <button 
              onClick={handleLogin}
              className="glass-key w-full sm:w-auto px-8 py-4 rounded-2xl text-foreground font-semibold text-lg"
            >
              View Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
