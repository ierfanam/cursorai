import React, { useState } from 'react';
import { ArrowUp, Rocket, Palette, Briefcase, PenTool, Bot, Video, Ticket, Infinity as InfinityIcon, ChevronDown, MessageSquareText, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface PromptScreenProps {
  onStart: (prompt: string) => void;
}

const AI_MODELS = [
  { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI' },
  { id: 'claude-4.5-sonnet', name: 'Claude 4.5 Sonnet', provider: 'Anthropic' },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', provider: 'Google' },
];

const MODES = [
  { id: 'agent', name: 'Agent', icon: InfinityIcon },
  { id: 'ask', name: 'Ask', icon: MessageSquareText },
];

const SUGGESTED_PROMPTS = [
  {
    title: "AI Startup Landing Page",
    prompt: "Build a sleek landing page for an AI startup that automates customer support. Use a dark theme with glass morphism, scroll-animated hero that pins while scrolling, and floating UI mockups. Cyan/teal accent colors.",
    icon: Rocket
  },
  {
    title: "Personal Portfolio",
    prompt: "Create a bold portfolio for a creative developer using kinetic typography - massive scrolling name in the hero, horizontal scroll project showcase, and neo-brutalist style with hard shadows and high contrast.",
    icon: Palette
  },
  {
    title: "Startup Pitch Page",
    prompt: "Create an editorial-style pitch website for a seed-stage startup. Serif typography (Playfair Display), cream/paper background, animated stat counters on scroll, and elegant asymmetric layouts.",
    icon: Briefcase
  },
  {
    title: "Design Agency Website",
    prompt: "Build a striking agency website with horizontal scroll portfolio section, neo-brutalist design with thick borders and bold color blocking. Include a kinetic marquee of client logos.",
    icon: PenTool
  },
  {
    title: "AI Tool or Web App",
    prompt: "Create a minimal web app UI for an AI writing tool. Vercel/Linear aesthetic with near-black sidebar, subtle hover states, and clean typography. Include a mock editor with floating toolbar.",
    icon: Bot
  },
  {
    title: "Creator / YouTuber Page",
    prompt: "Build an energetic personal brand site for a content creator. Use kinetic typography hero with scroll-triggered video grid, bold gradients, and playful micro-interactions on hover.",
    icon: Video
  },
  {
    title: "Event or Conference Page",
    prompt: "Create a dynamic conference landing page with pinned hero that reveals speaker cards on scroll, countdown timer animation, and a schedule section with staggered entrance animations. Dark theme with neon accent.",
    icon: Ticket
  },
];

export function PromptScreen({ onStart }: PromptScreenProps) {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[2]); // Default to Gemini 3 Flash
  const [selectedMode, setSelectedMode] = useState(MODES[0]); // Default to Agent

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      onStart(input);
    }
  };

  const ModeIcon = selectedMode.icon;

  return (
    <div className="paper-grid h-screen w-screen flex flex-col items-center justify-center relative font-sans text-foreground overflow-y-auto px-4 py-16">
      <div className="w-full max-w-4xl px-2 sm:px-6 space-y-9">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="yellow-sticker rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em]">A studio for ideas</div>
          <h1 className="studio-display text-4xl sm:text-6xl font-black tracking-[-0.065em] leading-[0.95]">Build something<br /><span className="font-serif italic font-medium tracking-[-0.04em]">remarkable.</span></h1>
          <p className="max-w-lg text-sm sm:text-base text-muted-foreground">Describe what you want to make. Your AI pair programmer will shape it with you.</p>
        </div>
        {/* Input Area */}
        <form onSubmit={handleSubmit} className="relative group">
          <div className="glass-panel rounded-[1.75rem] overflow-hidden focus-within:ring-4 focus-within:ring-primary/35 transition-all duration-300">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Build a modern landing page for an AI startup that helps teams automate customer support..."
              className="w-full bg-transparent px-6 py-6 pr-14 text-[17px] leading-relaxed focus:outline-none min-h-[130px] max-h-[400px] resize-none placeholder:text-muted-foreground/70 font-normal text-foreground"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            
            <div className="px-6 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-1 bg-secondary/75 border border-white/70 rounded-full px-3 py-2 shadow-[inset_0_2px_4px_rgba(75,70,60,0.1)] transition-colors">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 hover:text-foreground/80 text-[11px] text-muted-foreground transition-colors px-1 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                      <ModeIcon size={12} className="text-muted-foreground/60" />
                      <span>{selectedMode.name}</span>
                      <ChevronDown size={10} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-card border-border text-xs">
                    {MODES.map((mode) => (
                      <DropdownMenuItem 
                        key={mode.id} 
                        onClick={() => setSelectedMode(mode)}
                        className="gap-2 cursor-pointer focus:bg-muted"
                      >
                        <mode.icon size={12} />
                        {mode.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-[1px] h-3 bg-border/50 mx-1" />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 hover:text-foreground/80 text-[11px] text-muted-foreground transition-colors px-1 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                      <span>{selectedModel.name}</span>
                      <ChevronDown size={10} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-card border-border text-xs min-w-[140px]">
                    {AI_MODELS.map((model) => (
                      <DropdownMenuItem 
                        key={model.id} 
                        onClick={() => setSelectedModel(model)}
                        className="flex items-center justify-between gap-2 cursor-pointer focus:bg-muted py-2 px-3"
                      >
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="font-medium text-foreground">{model.name}</span>
                          <span className="text-[10px] text-muted-foreground/60">{model.provider}</span>
                        </div>
                        {selectedModel.id === model.id && (
                          <Check size={12} className="text-foreground" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center">
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={cn(
                    "glass-key h-11 w-11 rounded-full transition-all duration-200 flex items-center justify-center",
                    input.trim() 
                      ? "mint-press text-primary-foreground" 
                      : "bg-muted text-muted-foreground/60 cursor-not-allowed opacity-60"
                  )}
                >
                  <ArrowUp size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Suggestions */}
        <div className="space-y-4">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.22em] text-center">Or pick a starting point</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUGGESTED_PROMPTS.map((item, i) => (
              <button
                key={i}
                onClick={() => onStart(item.prompt)}
                className="glass-key group flex flex-col text-left p-4 rounded-2xl text-foreground transition-all duration-300"
              >
                <h3 className="text-[13px] font-medium flex items-center gap-2">
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors"><item.icon size={16} /></span>
                  <span className="text-foreground/80 group-hover:text-foreground transition-colors">{item.title}</span>
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Made with Blink badge would be here (platform provided) */}
    </div>
  );
}
