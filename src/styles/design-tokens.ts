import { cn } from '../utils/helpers';

// ==========================================
// Design Tokens
// Shared style constants for UI components.
// Colors reference CSS variables defined in index.css.
// ==========================================

// ==========================================
// Color Tokens (for inline styles if needed)
// ==========================================

export const colors = {
  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    400: 'var(--color-primary-400)',
    600: 'var(--color-primary-600)',
    800: 'var(--color-primary-800)',
  },
  bg: {
    primary: 'var(--color-bg-primary)',
    secondary: 'var(--color-bg-secondary)',
    tertiary: 'var(--color-bg-tertiary)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    tertiary: 'var(--color-text-tertiary)',
  },
  border: 'var(--color-border)',
  status: {
    success: 'var(--color-success)',
    danger: 'var(--color-danger)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
  },
} as const;

// ==========================================
// Variant Classes for Shared UI Components
// ==========================================

// --- Badge Variants ---
// Subtle background with border.
// Used in: Badge
export const badgeVariants = {
  slate:   'bg-bg-tertiary text-text-secondary border border-border/50',
  purple:  'bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/20',
  success: 'bg-success/15 text-success border border-success/20',
  danger:  'bg-danger/15 text-danger border border-danger/20',
  warning: 'bg-warning/15 text-warning border border-warning/20',
  info:    'bg-info/15 text-info border border-info/20',
} as const;

// --- Toggle Variants ---
// Subtle background + hover + active (data-[state=on]).
// Used in: Toggle
export const toggleVariants = {
  slate: cn(
    'bg-bg-tertiary text-text-secondary border border-border/50',
    'hover:bg-border hover:text-text-primary',
    'data-[state=on]:bg-border data-[state=on]:text-text-primary'
  ),
  purple: cn(
    'bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/20',
    'hover:bg-primary-500/25 shadow-sm shadow-primary-500/10',
    'data-[state=on]:bg-primary-500/30 data-[state=on]:border-primary-500/50'
  ),
  success: cn(
    'bg-success/15 text-success border border-success/20',
    'hover:bg-success/25',
    'data-[state=on]:bg-success/30 data-[state=on]:border-success/50'
  ),
  danger: cn(
    'bg-danger/15 text-danger border border-danger/20',
    'hover:bg-danger/25',
    'data-[state=on]:bg-danger/30 data-[state=on]:border-danger/50'
  ),
  warning: cn(
    'bg-warning/15 text-warning border border-warning/20',
    'hover:bg-warning/25',
    'data-[state=on]:bg-warning/30 data-[state=on]:border-warning/50'
  ),
  info: cn(
    'bg-info/15 text-info border border-info/20',
    'hover:bg-info/25',
    'data-[state=on]:bg-info/30 data-[state=on]:border-info/50'
  ),
} as const;

// --- Button Variants ---
// Solid / ghost / outline button styles.
// Used in: Button
export const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white border border-primary-700 shadow-md',
  secondary: 'bg-bg-tertiary hover:bg-border text-text-primary border border-border',
  outline: 'bg-transparent hover:bg-primary-100 text-primary-700 border border-primary-200',
  ghost: 'hover:bg-bg-tertiary text-primary-600 dark:text-primary-400',
  danger: 'bg-danger hover:bg-red-700 text-white border border-red-700',
  warning: 'bg-warning hover:bg-amber-600 text-white border border-amber-600',
} as const;

// --- Size Variants (shared by Badge + Toggle) ---
export const badgeToggleSizeVariants = {
  sm: 'px-1.5 py-0.5 text-[10px] rounded-full',
  md: 'px-2 py-0.5 text-xs rounded-full',
  lg: 'px-3 py-1 text-sm rounded-lg',
} as const;

// --- Size Variants (Button only) ---
export const buttonSizeVariants = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
} as const;

// --- Surface Variants ---
// Container surface styles for panels, cards, sections.
// Used in: Surface
export const surfaceVariants = {
  default: 'bg-bg-secondary border-border',
  primary: 'bg-bg-primary border-primary-200',
  elevated: 'bg-bg-primary border-border shadow-md',
  ghost: 'bg-transparent border-border/50',
  tint: 'bg-primary-500/5 border-primary-500/10',
  selected: 'border-primary-400 shadow-md ring-1 ring-primary-400/60',
  warning: 'border-warning ring-2 ring-warning/50 bg-warning/5',
  info: 'border-info/50 shadow-sm',
} as const;

export const surfacePaddingVariants = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const;

export const surfaceShadowVariants = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-2xl',
} as const;

// --- Text Variants ---
// Typography styles for consistent text rendering.
// Used in: Text
export const textVariants = {
  // Semantic variants
  label: 'text-[9px] font-black text-text-tertiary uppercase tracking-widest',
  labelSm: 'text-[10px] font-bold text-text-tertiary uppercase tracking-widest',
  caption: 'text-[10px] text-text-tertiary',
  bodySm: 'text-xs text-text-secondary',
  body: 'text-sm text-text-secondary',
  bodyBold: 'text-sm font-bold text-text-primary',
  heading: 'font-bold text-text-primary',
  headingSm: 'text-sm font-black text-text-primary',
} as const;

export const textSizeVariants = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
  '2xl': 'text-xl',
} as const;

export const textColorVariants = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  tertiary: 'text-text-tertiary',
  accent: 'text-primary-600 dark:text-primary-400',
} as const;

export const textWeightVariants = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  black: 'font-black',
} as const;
