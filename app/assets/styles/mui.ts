import colors from 'tailwindcss/colors'

export const MUITextFieldStyle = {
  '.MuiOutlinedInput-root': {
    fieldset: {
      borderColor: colors.gray[400],
    },
    '&:hover fieldset': {
      borderColor: colors.pink[500],
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.pink[300],
    },
  },
  'label.Mui-focused': {
    color: colors.pink[500],
  },
}

export const MUIBtnStyle = {
  fontWeight: 'bold',
  backgroundColor: colors.pink[500],
  color: 'white',
  '&:hover': {
    backgroundColor: colors.pink[400],
  },
}

export const MUISwitchStyle = {
  // Color del switch cuando está activo
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: colors.pink[500],
  },
  // Color del track cuando está activo
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: colors.pink[500],
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
