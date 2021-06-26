import { useState, useEffect } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Controller, useFormContext } from 'react-hook-form'
import { map } from 'lodash'

const mapToOptions = (data) => {console.log(data); return ( map(data, value => ({
  key: value,
  text: value,
  value,
})))}

const DateField = ({
  name,
  rules,
  options: defaultOptions,
}) => {
  const { control } = useFormContext()

  const [options, setOptions] = useState([])

  useEffect(() => {
    setOptions(mapToOptions(defaultOptions))
  }, [defaultOptions])

  const handleAddition = (e, { value }) => {
    setOptions([{ text: value, key: value, value }, ...options])
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ value, onChange }) => { return (
        <Dropdown
          options={options}
          placeholder='Choose Task ID'
          search
          selection
          fluid
          allowAdditions
          additionLabel='New task '
          value={value}
          onAddItem={handleAddition}
          onChange={(e, { value }) => onChange(value)}
        />
      )}}
    />
  )
}

export default DateField