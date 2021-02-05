import React, { useState, useEffect } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Controller, useFormContext } from 'react-hook-form'

import Add from '@material-ui/icons/Add';

const tasks = [
  { key: 'English', text: 'English', value: 'English' },
  { key: 'French', text: 'French', value: 'French' },
  { key: 'Spanish', text: 'Spanish', value: 'Spanish' },
  { key: 'German', text: 'German', value: 'German' },
  { key: 'Chinese', text: 'Chinese', value: 'Chinese' },
]

const mapToOptions = (data) => data.map(value => ({
  key: value,
  text: value,
  value,
}))

const DateField = ({
  name,
  rules,
  options: defaultOptions = [],
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