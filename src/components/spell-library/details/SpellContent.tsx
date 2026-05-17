import type { Spell } from 'open20-core';
import { Badge } from '../../ui/Badge';
import { Text } from '../../ui/Text';

interface SpellContentProps {
  spell: Spell;
}

export function SpellContent({ spell }: SpellContentProps) {
  return (
    <>
      <div className="mb-6">
        <Text as="h2" className="text-2xl md:text-[26px] font-medium mb-2">
          {spell.name}
        </Text>
        <div className="flex gap-2">
          <Badge variant={spell.level === 0 ? 'slate' : 'purple'}>
            {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
          </Badge>
          <Badge variant="slate">{spell.school}</Badge>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
        <Text variant="body" className="leading-relaxed whitespace-pre-wrap">
          {spell.description}
        </Text>
      </div>

      {spell.upcast && (
        <div className="pl-4 border-l-4 border-primary-400 mb-6 py-1">
          <Text size="sm" color="secondary" weight="medium" className="uppercase mb-1">At Higher Levels</Text>
          <Text variant="body">{spell.upcast}</Text>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-border">
        <Text size="sm" color="secondary" weight="medium" className="uppercase mb-2">Classes</Text>
        <div className="flex flex-wrap gap-2">
          {spell.classes?.map(c => (
            <Badge key={c} variant="slate">{c}</Badge>
          ))}
        </div>
      </div>
    </>
  );
}
