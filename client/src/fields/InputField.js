import TextField from '@material-ui/core/TextField';
import { useFormContext } from 'react-hook-form'

const InputField = ({
  name,
  rules,
  multiline = false,
}) => {
  const { register } = useFormContext()

  return (
    <TextField
      inputRef={register(rules)}
      name={name}
      label="Multiline"
      multiline={multiline}
      rows={4}
      variant="outlined"
    />
    // <input name={name} ref={register} />
  )
}

export default InputField