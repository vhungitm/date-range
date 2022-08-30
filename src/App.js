import { format } from 'date-fns';
import { useState } from 'react';
import { DateRange } from './components/DateRange';

const App = () => {
	const [value, setValue] = useState({
		startDate: new Date('2022-8-1'),
		endDate: new Date('2022-8-28')
	});

	const [type, setType] = useState(3);

	return (
		<div style={{ margin: '50px 100px' }}>
			<DateRange
				value={value}
				handleChangeValue={setValue}
				type={type}
				handleChangeType={setType}
				minDate={new Date('2022-8-9')}
				maxDate={new Date('2024-9-30')}
			/>

			<div style={{ margin: '400px 100px' }}>
				<div>
					{format(value.startDate, 'yyyy-MM-dd').toString()}
					{' den '}
					{format(value.endDate, 'yyyy-MM-dd').toString()}
				</div>
				<div>Type: {type}</div>
			</div>
		</div>
	);
};

export default App;
