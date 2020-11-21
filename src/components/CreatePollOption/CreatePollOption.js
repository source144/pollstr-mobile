import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const CreatePollOption = ({ id, index, value, onChange, onDelete, placeholder = "Enter an option value", deleteable = false, hasError = undefined }) => {
	console.log(index);
	const style = index === 0 ? { marginTop: '0' } : {};
	return (
		<div className="form-item" style={index == 0 ? { marginTop: "0" } : {}}>
			<div className='form-item-wrapper p-rel' >
				<input
					className={`form-item__input ${!!hasError ? 'form-item__input--err' : ''}`}
					type="text"
					placeholder={placeholder}
					name={`option-${id}`}
					formNoValidate
					onChange={(e) => onChange(index, e.target.value)}
					value={value}>
				</input>
				{deleteable ?
					<span className='form-item__input-remove' onClick={() => onDelete(index)}>
						<FontAwesomeIcon icon={faMinusCircle} />
					</span>
					: undefined}
			</div>
			{ !!hasError ? <span className='form-item__error'>{hasError}</span> : null}
		</div >
	)
}

export default CreatePollOption;