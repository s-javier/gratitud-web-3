import colors from 'tailwindcss/colors'

export const MUITextFieldStyle = {
  '.MuiOutlinedInput-root': {
    fieldset: {
      borderColor: colors.gray[700],
    },
    '&:hover fieldset': {
      borderColor: 'var(--o-input-border-hover-color)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--o-input-border-focus-color)',
    },
  },
  'label.Mui-focused': {
    color: 'var(--o-input-label-focus-color)',
  },
}

export const MUIBtnStyle = {
  fontWeight: 'bold',
  backgroundColor: 'var(--o-btn-primary-bg-color)',
  color: 'var(--o-btn-primary-text-color)',
  '&:hover': {
    backgroundColor: 'var(--o-btn-primary-bg-hover-color)',
  },
}
