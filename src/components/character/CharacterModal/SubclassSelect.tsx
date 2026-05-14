import { useMemo } from 'react';
import { Select } from '@/components/ui/Select';
import { dataLoader } from '@/core/data-loader';

interface SubclassSelectProps {
  classId: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function SubclassSelect({ 
  classId, 
  value, 
  onChange,
  label 
}: SubclassSelectProps) {
  const subclasses = useMemo(() => 
    dataLoader.getSubclassesForClass(classId),
    [classId]
  );
  
  if (subclasses.length === 0) return null;
  
  // Radix Select doesn't allow empty string as item value
  // Use a sentinel value and convert to/from it
  const selectValue = value || '_none';
  
  return (
    <div>
      <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2">
        {label || 'Subclass'}
      </label>
      <Select.Root 
        value={selectValue} 
        onValueChange={(val) => onChange(val === '_none' ? '' : val)}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="_none">None</Select.Item>
          {subclasses.map((sub) => (
            <Select.Item key={sub.id} value={sub.id}>
              {sub.id} {/* Subclass doesn't have 'name' property, use id */}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}
