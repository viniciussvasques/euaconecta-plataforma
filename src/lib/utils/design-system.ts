/**
 * 🎨 EUACONECTA DESIGN SYSTEM
 * Sistema de design unificado para toda a plataforma
 */

// ================================
// 🎨 CORES PRIMÁRIAS
// ================================
export const colors = {
  // Cores principais da marca
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Cor principal
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  
  // Cores secundárias
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Verde principal
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  
  // Cores de status
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  
  // Cores neutras
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  }
}

// ================================
// 🎯 CORES SEMÂNTICAS
// ================================
export const semanticColors = {
  // Fundos
  background: {
    primary: colors.gray[50],
    secondary: colors.gray[100],
    tertiary: colors.gray[200],
    white: '#ffffff',
    modal: 'rgba(255, 255, 255, 0.95)',
    modalBackdrop: 'rgba(0, 0, 0, 0.25)'
  },
  
  // Textos
  text: {
    primary: colors.gray[900],
    secondary: colors.gray[600],
    tertiary: colors.gray[500],
    inverse: colors.gray[50],
    muted: colors.gray[400]
  },
  
  // Bordas
  border: {
    primary: colors.gray[200],
    secondary: colors.gray[300],
    focus: colors.primary[500],
    error: colors.error[500]
  },
  
  // Estados
  status: {
    pending: colors.warning[500],
    inProgress: colors.primary[500],
    completed: colors.success[500],
    error: colors.error[500],
    cancelled: colors.gray[500]
  }
}

// ================================
// 📏 ESPAÇAMENTOS
// ================================
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '3rem',   // 48px
  '4xl': '4rem',   // 64px
  '5xl': '6rem',   // 96px
  '6xl': '8rem'    // 128px
}

// ================================
// 🔤 TIPOGRAFIA
// ================================
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem'   // 60px
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },
  
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  }
}

// ================================
// 🎭 SOMBRAS
// ================================
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
}

// ================================
// 🔲 BORDAS
// ================================
export const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px'
}

// ================================
// 🎨 COMPONENTES
// ================================
export const components = {
  // Botões
  button: {
    primary: {
      base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
      },
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
        warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
        error: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500'
      }
    }
  },
  
  // Cards
  card: {
    base: 'bg-white rounded-lg border border-gray-200 shadow-sm',
    header: 'px-6 py-4 border-b border-gray-200',
    body: 'px-6 py-4',
    footer: 'px-6 py-4 border-t border-gray-200 bg-gray-50'
  },
  
  // Modais
  modal: {
    backdrop: 'fixed inset-0 bg-black bg-opacity-25 transition-opacity',
    container: 'relative w-full max-w-4xl bg-white rounded-lg shadow-xl',
    header: 'flex items-center justify-between p-6 border-b border-gray-200',
    body: 'p-6 max-h-[70vh] overflow-y-auto',
    footer: 'flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50'
  },
  
  // Inputs
  input: {
    base: 'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
    error: 'border-error-500 focus:border-error-500 focus:ring-error-500'
  },
  
  // Badges
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    variant: {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      error: 'bg-error-100 text-error-800'
    }
  }
}

// ================================
// 🎯 UTILITÁRIOS
// ================================
export const utils = {
  // Gerar classes CSS para componentes
  getButtonClasses: (variant: keyof typeof components.button.primary.variant, size: keyof typeof components.button.primary.size = 'md') => {
    return `${components.button.primary.base} ${components.button.primary.size[size]} ${components.button.primary.variant[variant]}`
  },
  
  getCardClasses: (variant: 'base' | 'header' | 'body' | 'footer' = 'base') => {
    return components.card[variant]
  },
  
  getModalClasses: (variant: 'backdrop' | 'container' | 'header' | 'body' | 'footer') => {
    return components.modal[variant]
  },
  
  getInputClasses: (hasError = false) => {
    return hasError ? `${components.input.base} ${components.input.error}` : components.input.base
  },
  
  getBadgeClasses: (variant: keyof typeof components.badge.variant) => {
    return `${components.badge.base} ${components.badge.variant[variant]}`
  }
}

// ================================
// 🎨 TEMA PADRÃO
// ================================
export const defaultTheme = {
  colors,
  semanticColors,
  spacing,
  typography,
  shadows,
  borderRadius,
  components,
  utils
}

export default defaultTheme
