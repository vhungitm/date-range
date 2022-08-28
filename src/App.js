import { format } from 'date-fns';
import { useState } from 'react';
import { DateRange } from './components/DateRange';

const App = () => {
	const [value, setValue] = useState({
		startDate: new Date('2022-8-1'),
		endDate: new Date('2022-8-28')
	});
	return (
		<div style={{ margin: '50px 100px' }}>
			<DateRange value={value} setValue={setValue} />
			<div style={{ margin: '400px 100px' }}>
				{format(value.startDate, 'yyyy-MM-dd').toString()}
				{' den '}
				{format(value.endDate, 'yyyy-MM-dd').toString()}
			</div>
		</div>
	);
};

export default App;
