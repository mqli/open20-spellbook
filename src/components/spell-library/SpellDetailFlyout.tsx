import * as RadixDialog from '@radix-ui/react-dialog';
import { X, ArrowLeft } from 'lucide-react';
import { useSpellStore } from '../../stores/spell-store';
import { Badge } from '../ui/Badge';

export function SpellDetailFlyout() {
  const { selectedSpell, isDetailOpen, closeDetail } = useSpellStore();

  if (!selectedSpell) return null;

  return (
    <RadixDialog.Root open={isDetailOpen} onOpenChange={(open) => !open && closeDetail()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/35 z-40 transition-opacity" />
        <RadixDialog.Content
          className={`
            fixed z-50 bg-bg-secondary flex flex-col shadow-xl transition-transform duration-300
            w-full h-[85vh] bottom-0 left-0 rounded-t-2xl
            md:w-[540px] md:h-full md:top-0 md:right-0 md:bottom-auto md:left-auto md:rounded-none
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-bg-primary md:bg-bg-secondary rounded-t-2xl md:rounded-none sticky top-0">
            <button onClick={closeDetail} className="p-2 hover:bg-bg-tertiary rounded-md md:hidden">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto md:hidden" /> {/* Drag Handle */}
            <div className="hidden md:block text-sm font-medium text-text-secondary">Spell Library</div>
            <RadixDialog.Close asChild>
              <button className="p-2 hover:bg-bg-tertiary rounded-md">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </RadixDialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-bg-primary h-full">
            <div className="mb-6">
              <RadixDialog.Title className="text-2xl md:text-[26px] font-medium text-text-primary mb-2">
                {selectedSpell.name}
              </RadixDialog.Title>
              <div className="flex gap-2">
                <Badge variant={selectedSpell.level === 0 ? 'slate' : 'purple'}>
                  {selectedSpell.level === 0 ? 'Cantrip' : `Level ${selectedSpell.level}`}
                </Badge>
                <Badge variant="slate">{selectedSpell.school}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
              <div>
                <div className="text-xs text-text-secondary uppercase font-medium mb-1">Casting Time</div>
                <div className="text-sm font-medium text-text-primary">{selectedSpell.castingTime}</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary uppercase font-medium mb-1">Range</div>
                <div className="text-sm font-medium text-text-primary">{selectedSpell.range}</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary uppercase font-medium mb-1">Duration</div>
                <div className="text-sm font-medium text-text-primary">{selectedSpell.duration}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs text-text-secondary uppercase font-medium mb-2">Components</div>
              <div className="flex gap-2">
                {selectedSpell.components.map(c => (
                  <Badge key={c} variant="slate">{c}</Badge>
                ))}
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
              <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
                {selectedSpell.description}
              </p>
            </div>

            {selectedSpell.upcast && (
              <div className="pl-4 border-l-4 border-primary-400 mb-6 py-1">
                <div className="text-xs text-text-secondary uppercase font-medium mb-1">At Higher Levels</div>
                <p className="text-sm text-text-primary">{selectedSpell.upcast}</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-xs text-text-secondary uppercase font-medium mb-2">Classes</div>
              <div className="flex flex-wrap gap-2">
                {selectedSpell.classes?.map(c => (
                  <Badge key={c} variant="slate">{c}</Badge>
                ))}
              </div>
            </div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
