import { Autocomplete, TextField } from '@mui/material'
import NbaTeamsData from '../data/NbaTeamsData'

export default function TeamsFilter(props: {setTeamsFilter: React.Dispatch<React.SetStateAction<string[]>>}) {
    return (
        <Autocomplete
            multiple
            options={NbaTeamsData.map(team => team["teamName"])}
            getOptionLabel={(option) => option}
            defaultValue={[]}
            onChange={(_e, newValue) => props.setTeamsFilter(newValue)}
            filterSelectedOptions
            renderInput={(params) => (
        <TextField
            {...params}
            label="Teams"
        />
    )}
  />
  )
}
