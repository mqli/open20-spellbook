interface SpellSlotPipsProps {
  level: number;
  total: number;
  used: number;
  onConsume: (level: number) => void;
  onRecover: (level: number) => void;
}

export function SpellSlotPips({ level, total, used, onConsume, onRecover }: SpellSlotPipsProps) {
  const available = total - used;

  return (
    <div className="flex gap-1.5 flex-1">
      {Array.from({ length: total }).map((_, i) => {
        const isAvailable = i < available;
        return (
          <button
            key={i}
            title={isAvailable ? `Use level ${level} slot` : `Recover level ${level} slot`}
            onClick={() => isAvailable ? onConsume(level) : onRecover(level)}
            className={`
              w-5 h-5 rounded-md border transition-all duration-150 hover:scale-110
              ${isAvailable
                ? 'bg-primary-500 border-primary-600 shadow-sm shadow-primary-500/30'
                : 'bg-bg-tertiary border-border opacity-30 hover:opacity-60'
              }
            `}
          />
        );
      })}
    </div>
  );
}
