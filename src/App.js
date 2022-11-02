import { format, subDays } from 'date-fns';
import { useState } from 'react';
import { DateRange } from './components/DateRange';

const App = () => {
	const [value, setValue] = useState({
		startDate: subDays(new Date(), 30),
		endDate: new Date()
	});
	const [type, setType] = useState(0);
	const minDate = subDays(new Date(), 30);
	const maxDate = new Date();

	return (
		<div style={{ margin: '50px 100px' }}>
			<DateRange
				value={value}
				// showHeader={false}
				// showControl={false}
				// alwaysShowWrapper={true}
				handleChangeValue={setValue}
				type={type}
				handleChangeType={setType}
				maxDate={new Date()}
				minDayQuantity={2}
				maxDayQuantity={30}
				maxWeekQuantity={30}
				maxMonthQuantity={30}
				maxYearQuantity={30}
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
