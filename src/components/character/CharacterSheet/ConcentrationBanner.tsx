import { Wind } from 'lucide-react';
import { spellService } from '../../../core/spell-service';

interface ConcentrationBannerProps {
  concentratingSpellId: string;
}

export function ConcentrationBanner({ concentratingSpellId }: ConcentrationBannerProps) {
  const spellName = spellService.getSpell(concentratingSpellId)?.name ?? concentratingSpellId.replace(/-/g, ' ');

  return (
    <section className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex items-center gap-3">
      <div className="p-2 bg-amber-500/15 rounded-xl text-amber-500 flex-shrink-0">
        <Wind className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Concentrating</div>
        <div className="text-sm font-bold text-text-primary truncate">
          {spellName}
        </div>
      </div>
    </section>
  );
}
