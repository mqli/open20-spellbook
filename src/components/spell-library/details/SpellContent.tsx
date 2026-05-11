import type { Spell } from 'open20-core/browser';
import { Badge } from '../../ui/Badge';

interface SpellContentProps {
  spell: Spell;
}

export function SpellContent({ spell }: SpellContentProps) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl md:text-[26px] font-medium text-text-primary mb-2">
          {spell.name}
        </h2>
        <div className="flex gap-2">
          <Badge variant={spell.level === 0 ? 'slate' : 'purple'}>
            {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
          </Badge>
          <Badge variant="slate">{spell.school}</Badge>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
        <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
          {spell.description}
        </p>
      </div>

      {spell.upcast && (
        <div className="pl-4 border-l-4 border-primary-400 mb-6 py-1">
          <div className="text-xs text-text-secondary uppercase font-medium mb-1">At Higher Levels</div>
          <p className="text-sm text-text-primary">{spell.upcast}</p>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-border">
        <div className="text-xs text-text-secondary uppercase font-medium mb-2">Classes</div>
        <div className="flex flex-wrap gap-2">
          {spell.classes?.map(c => (
            <Badge key={c} variant="slate">{c}</Badge>
          ))}
        </div>
      </div>
    </>
  );
}
