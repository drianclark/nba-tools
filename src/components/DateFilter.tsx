import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterMoment';
import { DatePicker } from '@mui/lab';
import { Moment } from 'moment';
import moment from "@date-io/moment";
import { TextField } from '@mui/material';

export default function DateFilter(props: {startDate: Moment, setStartDate: React.Dispatch<React.SetStateAction<Moment>>}) {
	const today = new moment().date();
	
	return (
		<LocalizationProvider dateAdapter={DateAdapter}>
		<DatePicker
				label="Start date"
				value={props.startDate}
				onChange={() => {}} // only do something onAccept, sadly onChange is required
				disableCloseOnSelect={false}
				onAccept={(newValue) => {
						if (newValue !== null) {
							props.setStartDate(newValue);
						}
				}}
				maxDate={today}
				renderInput={(params) => <TextField {...params} sx={{width: 180}}/>}
			/>
	</LocalizationProvider>
	)
}
