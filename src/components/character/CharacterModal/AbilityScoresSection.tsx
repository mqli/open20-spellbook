import { Input } from '@/components/ui/Input';

interface AbilityScoresSectionProps {
  abilities: Record<string, number>;
  onChange: (ability: string, value: string) => void;
}

export function AbilityScoresSection({ abilities, onChange }: AbilityScoresSectionProps) {
  return (
    <div className="bg-bg-primary/50 p-6 rounded-2xl border border-border shadow-inner">
      <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-6 text-center">
        Ability Scores
      </label>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {Object.keys(abilities).map((ability) => (
          <div key={ability}>
            <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
              {ability.substring(0, 3)}
            </label>
            <Input 
              type="number" 
              min={1} 
              max={30} 
              value={abilities[ability as keyof typeof abilities]} 
              onChange={(e) => onChange(ability, e.target.value)}
              className="text-center font-bold"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
