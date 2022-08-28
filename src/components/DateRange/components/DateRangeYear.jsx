import { addYears } from 'date-fns';
import React from 'react';

export const DateRangeYear = props => {
	const { value, handleChangeValue } = props;

	const onChangeValue = (isPre = true, type = 'startDate') => {
		if (
			((type === 'startDate' && !isPre) || (type === 'endDate' && isPre)) &&
			value.startDate.getFullYear() >= value.endDate.getFullYear()
		)
			return;

		handleChangeValue(
			addYears(
				type === 'startDate' ? value.startDate : value.endDate,
				isPre ? -1 : 1
			),
			type
		);
	};

	return (
		<div className="date-range-wrapper-header">
			{'Từ '}

			<div
				className="date-range-wrapper-header-btn btn-pre"
				onClick={() => onChangeValue(true, 'startDate')}
			/>
			<div className="date-range-wrapper-header-value">
				<span>{value.startDate.getFullYear()}</span>
			</div>
			<div
				className="date-range-wrapper-header-btn btn-next"
				onClick={() => onChangeValue(false, 'startDate')}
			/>

			{' đến '}
			<div
				className="date-range-wrapper-header-btn btn-pre"
				onClick={() => onChangeValue(true, 'endDate')}
			/>
			<div className="date-range-wrapper-header-value">
				<span>{value.endDate.getFullYear()}</span>
			</div>
			<div
				className="date-range-wrapper-header-btn btn-next"
				onClick={() => onChangeValue(false, 'endDate')}
			/>
		</div>
	);
};
