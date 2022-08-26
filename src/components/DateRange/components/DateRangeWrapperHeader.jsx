import React from 'react';

export const DateRangeWrapperHeader = props => {
	const { calendarDate, handleChangeMonth } = props;

	return (
		<div className="date-range-wrapper-header">
			<div
				className="date-range-wrapper-header-btn btn-pre"
				onClick={() => handleChangeMonth('pre')}
			></div>
			<div className="date-range-wrapper-header-value">
				<span>Tháng {calendarDate.getMonth() + 1}</span>
				<span>{calendarDate.getFullYear()}</span>
			</div>
			<div
				className="date-range-wrapper-header-btn btn-next"
				onClick={() => handleChangeMonth('next')}
			></div>
		</div>
	);
};
