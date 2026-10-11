import { useCallback, useEffect, useState } from 'react';
import { blink } from '../lib/blink';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Clock, Code, Box, ChevronRight, Terminal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Project {
  id: string;
  name: string;
  prompt: string;
  sandboxId: string;
  createdAt: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  currentSandboxId?: string;
}

export function HistoryModal({ isOpen, onClose, onSelectProject, currentSandboxId }: HistoryModalProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use raw list instead of table helper to be safe, or just use the SDK correctly
      const user = await blink.auth.me();
      if (!user) return;
      
      const data = await blink.db.table<Project>('projects').list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 50
      });
      setProjects(data as Project[]);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) void loadProjects();
  }, [isOpen, loadProjects]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-panel max-w-2xl max-h-[80vh] text-foreground p-0 gap-0 overflow-hidden rounded-3xl shadow-2xl">
        <DialogHeader className="p-6 border-b border-border/70 bg-card">
          <DialogTitle className="flex items-center gap-2">
            <Terminal size={18} />
            Project History
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Select a project to switch sandboxes. Previous sessions may be expired.
          </p>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] bg-background">
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                <span className="text-xs">Loading projects...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center text-muted-foreground py-20 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full glass-key flex items-center justify-center">
                  <Code size={20} className="opacity-50" />
                </div>
                <p>No projects found yet.</p>
                <p className="text-xs opacity-60">Start building to see your history here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className={`w-full text-left group p-4 rounded-xl border transition-all duration-200 hover:shadow-lg relative overflow-hidden ${
                      currentSandboxId === project.sandboxId 
                        ? 'border-primary/70 bg-primary/25 shadow-inner' 
                        : 'border-border bg-card hover:bg-muted hover:border-primary/50'
                    }`}
                  >
                    {/* Active Indicator */}
                    {currentSandboxId === project.sandboxId && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}

                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${
                          currentSandboxId === project.sandboxId ? 'bg-primary/30 text-foreground' : 'bg-secondary text-muted-foreground group-hover:text-foreground'
                        }`}>
                          <Code size={14} />
                        </div>
                        <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {project.name || 'Untitled Project'}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5 bg-background px-2 py-1 rounded-full border border-border">
                          <Box size={10} />
                          {project.sandboxId}
                        </span>
                        {currentSandboxId === project.sandboxId && (
                          <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-[13px] text-muted-foreground/80 line-clamp-2 mb-3 pl-9 pr-4 font-normal leading-relaxed">
                      "{project.prompt}"
                    </p>
                    
                    <div className="flex items-center justify-between pl-9 mt-4 pt-3 border-t border-border/60">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50">
                        <Clock size={10} />
                        {(() => {
                          try {
                            const date = new Date(project.createdAt);
                            if (isNaN(date.getTime())) return 'Unknown date';
                            return formatDistanceToNow(date, { addSuffix: true });
                          } catch (e) {
                            return 'Unknown date';
                          }
                        })()}
                      </div>
                      
                      <div className="flex items-center gap-1 text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-200">
                        Open Project <ChevronRight size={12} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
