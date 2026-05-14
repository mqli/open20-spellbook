import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from '../../utils/helpers';

export interface SliderProps extends Omit<RadixSlider.SliderProps, 'asChild'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  onValueChange?: (value: number[]) => void;
}

export function Slider({ className, min = 0, max = 100, step = 1, value, onValueChange, ...props }: SliderProps) {
  return (
    <RadixSlider.Root
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={onValueChange}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className
      )}
      {...props}
    >
      <RadixSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-bg-tertiary">
        <RadixSlider.Range className="absolute h-full bg-primary-600" />
      </RadixSlider.Track>
      {value?.map((_, i) => (
        <RadixSlider.Thumb
          key={i}
          className="block h-5 w-5 rounded-full border-2 border-primary-600 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </RadixSlider.Root>
  );
}

export default Slider;
