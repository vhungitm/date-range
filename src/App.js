import { format, subDays } from 'date-fns';
import { useState } from 'react';
import { DateRange } from './components/DateRange';

const App = () => {
	const [value, setValue] = useState({
		startDate: subDays(new Date(), 30),
		endDate: new Date()
	});
	const [type, setType] = useState(0);
	const minDate = new Date('2021-10-13');
	const maxDate = new Date('2025-9-24');

	return (
		<div style={{ margin: '50px 100px' }}>
			<DateRange
				value={value}
				handleChangeValue={setValue}
				type={type}
				handleChangeType={setType}
				maxDate={new Date()}
				maxDayQuantity={31}
				maxWeekQuantity={31}
				maxMonthQuantity={31}
				maxYearQuantity={31}
			/>

			<div style={{ margin: '300px 100px 0' }}>
				<div>
					{format(value.startDate, 'dd/MM/yyyy').toString()}
					{' den '}
					{format(value.endDate, 'dd/MM/yyyy').toString()}
				</div>
				<div>
					{'min: '}
					{format(minDate, 'dd/MM/yyyy').toString()}
					<br />
					{' max:  '}
					{format(maxDate, 'dd/MM/yyyy').toString()}
				</div>
				<div>Type: {type}</div>
			</div>
		</div>
	);
};

export default App;
