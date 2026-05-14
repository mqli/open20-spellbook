import { useRollStore } from '../../stores/roll-store';
import { Dices, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';

export function DiceRollOverlay() {
  const { latestRoll } = useRollStore();
  const [dismissedRollId, setDismissedRollId] = useState<string | null>(null);

  const isVisible = !!latestRoll && latestRoll.id !== dismissedRollId;

  if (!latestRoll) return null;

  return (
    <div 
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
      `}
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-info rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-bg-primary border border-primary-200 rounded-2xl shadow-2xl p-6 flex items-center gap-6 min-w-[320px]">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-inner transform rotate-3 hover:rotate-0 transition-transform">
            <Dices className="w-8 h-8" />
          </div>
          
          <div className="flex-1">
            <div className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-1">
              {latestRoll?.label || 'Roll Result'}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-text-primary tabular-nums">
                {latestRoll?.total ?? 0}
              </span>
              <span className="text-xs font-medium text-text-tertiary">
                {latestRoll?.expression}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissedRollId(latestRoll.id)}
            className="p-2 text-text-tertiary"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
