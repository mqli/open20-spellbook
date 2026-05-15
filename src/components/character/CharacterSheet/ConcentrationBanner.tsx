import { Wind } from 'lucide-react';
import { spellService } from '../../../core/spell-service';
import { Surface } from '../../ui/Surface';

interface ConcentrationBannerProps {
  concentratingSpellId: string;
}

export function ConcentrationBanner({ concentratingSpellId }: ConcentrationBannerProps) {
  const spellName = spellService.getSpell(concentratingSpellId)?.name ?? concentratingSpellId.replace(/-/g, ' ');

  return (
    <Surface variant="tint" padding="md" className="bg-amber-500/10 border-amber-500/25 flex items-center gap-3">
      <Surface variant="ghost" padding="xs" className="bg-amber-500/15 text-amber-500 flex-shrink-0">
        <Wind className="w-4 h-4" />
      </Surface>
      <div className="min-w-0">
        <div className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Concentrating</div>
        <div className="text-sm font-bold text-text-primary truncate">
          {spellName}
        </div>
      </div>
    </Surface>
  );
}
