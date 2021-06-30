import { useFormContext } from 'react-hook-form'
import { FormControl, TextField, InputLabel } from '@material-ui/core'

const InputField = ({ name, rules, label, multiline = false }) => {
  const { register } = useFormContext()

  return (
    <TextField
      inputRef={register(rules)}
      name={name}
      label={label}
      multiline={multiline}
      rows={2}
      variant='outlined'
    />
  )
}

export default InputField
