import colors from 'tailwindcss/colors'

export const MUITextFieldStyle = {
  '.MuiOutlinedInput-root': {
    fieldset: {
      borderColor: colors.gray[400],
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

export const MUISwitchStyle = {
  // Color del switch cuando está activo
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'var(--o-btn-primary-bg-color)',
  },
  // Color del track cuando está activo
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'var(--o-btn-primary-bg-color)',
  },
  // // Color del switch cuando está inactivo
  // '& .MuiSwitch-switchBase': {
  //   color: 'gray',
  // },
  // // Color del track cuando está inactivo
  // '& .MuiSwitch-track': {
  //   backgroundColor: 'lightgray',
  // },
}
