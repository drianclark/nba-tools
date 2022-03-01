import { TextField } from '@mui/material'
import { useState } from 'react';

export default function ThresholdField(props: {threshold: number, setThreshold: React.Dispatch<React.SetStateAction<number>>}) {
	const [invalidThreshold, setInvalidThreshold] = useState(false)
	const [thresholdHelper, setThresholdHelper] = useState("")

	const isPositiveInteger = (str: string) => {
		const num = Number(str);

		  if (Number.isInteger(num) && num > 0) {
			return true;
		  }

		  return false;
	}

	return (
		<TextField
			onKeyDown={(e: any) => {
				if (e.key === "Enter") {
					if (isPositiveInteger(e.target.value)) {
						props.setThreshold(e.target.value)
						setInvalidThreshold(false)
						setThresholdHelper("")
					} else {
						setInvalidThreshold(true)
						setThresholdHelper("Invalid threshold value, please enter a positive integer")
					}
				}
			}}
			error={invalidThreshold}
			helperText={thresholdHelper}
			variant="outlined"
			label="Score threshold"
			defaultValue={10}
			sx={{ marginLeft: 1, width: 120 }} />
	)
}
