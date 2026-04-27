import type { GenerateModel } from '@/lib/api-client';

interface Props {
  value: GenerateModel;
  onChange: (model: GenerateModel) => void;
  disabled?: boolean;
}

const OPTIONS: Array<{ value: GenerateModel; label: string; hint: string }> = [
  { value: 'claude-sonnet-4-6', label: 'Standard', hint: 'Best quality' },
  { value: 'claude-haiku-4-5-20251001', label: 'Fast', hint: 'Cheaper, simple tweaks' },
];

export function ModelPicker({ value, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          disabled={disabled}
          title={opt.hint}
          className={`px-2 py-1 border ${value === opt.value ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
