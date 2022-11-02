import { isSameDay, set } from 'date-fns';

export const DateRangeMonth = props => {
	const {
		months,
		handleChangePreviewValue,
		handleRemovePreviewValue,
		handleChangeValue
	} = props;

	return (
		<div className="date-range-months">
			{months.map(item => (
				<div key={item.value} className={`date-range-month ${item.type}`}>
					<div
						className="date-range-month-value"
						onMouseEnter={() => handleChangePreviewValue(item.value)}
						onMouseLeave={() => handleRemovePreviewValue()}
						onClick={() => handleChangeValue(item.value)}
					>
						<span>Tháng {item.value.getMonth() + 1}</span>
						{isSameDay(
							set(item.value, { date: 1 }),
							set(new Date(), { date: 1 })
						) && <div className="date-range-now" />}
					</div>
				</div>
			))}
		</div>
	);
};
