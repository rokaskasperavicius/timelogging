import { useState, useEffect } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Controller, useFormContext } from 'react-hook-form'
import { map, find, isEmpty } from 'lodash'
import TextField from '@material-ui/core/TextField'
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete'
const filter = createFilterOptions()

const mapToOptions = (data) =>
  map(data, (value) => ({
    key: value,
    text: value,
  }))

export const DropdownField = ({ name, label, rules, options }) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ value, onChange }) => {
        return (
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              if (newValue && newValue.key) {
                onChange(newValue.key)
              } else {
                onChange(newValue)
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params)

              // Suggest the creation of a new value
              if (
                params.inputValue !== '' &&
                !find(
                  options,
                  ({ text }) =>
                    text.toLowerCase() === params.inputValue.toLowerCase()
                )
              ) {
                filtered.push({
                  key: params.inputValue,
                  text: `Add "${params.inputValue}"`,
                })
              }

              return filtered
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={mapToOptions(options)}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option
              }

              // Regular option
              return option.text
            }}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label={label} variant='outlined' />
            )}
          />
        )
      }}
    />
  )
}
