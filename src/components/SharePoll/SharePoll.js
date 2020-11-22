import React, { useRef } from 'react'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

// import { toast } from 'react-toastify'
// import Share from '../util/ShareOnMobile'

export default (poll) => {
	// TODO : for testing
	if (poll.poll) poll = poll.poll;

	const copyBtn = useRef();
	const url = `https://pollstr.app/poll/${poll.id}`;

	const onCopyHandler = (e) => {
		if (e && typeof e.preventDefault === 'function') e.preventDefault();

		// toast('Poll Link Copied!');
	}

	// (iOS 14.1 bug - no solution..)
	// If native share API fails
	// Simply copy the link
	const handleShareToAppsFallback = () => copyBtn && copyBtn.current && copyBtn.current.click();

	const handleShareToApps = (e) => {
		if (e && typeof e.preventDefault === 'function') e.preventDefault();
		const shareData = {
			title: poll.title,
			text: poll.title ? [poll.title, ''].join('\n') : 'Check out this poll!\n',
			url: url,
		}

		// Share(shareData, handleShareToAppsFallback)
		// 	.then(() => {
		// 		// Succesfully sharing to other apps
		// 		console.log("Share opened")
		// 	})
		// 	.catch((e) => {
		// 		// Share API failed
		// 		console.log("Share failed", e);
		// 	})
	}
	return (
		// <div className="form-centered-container">
		<div className="form-form-wrapper">
			<div onSubmit={(e) => { e.preventDefault() }} formNoValidate className='form-form'>
				<div className="form-switch form-switch--center poll-created-description">Use this QR Code to <Link to={`/poll/${poll.id}`} className='form-switch-action'>Acces Poll</Link></div>
				<div className="poll-created-qr">
					<QRCode value={url} size={200} />
				</div>
				{/* <div className="form-switch form-switch--center poll-created-description">Or, use copy the following link</div> */}
				<div className="form-item form-item--clipboard">
					<div className='form-item-wrapper'>
						<input
							value={url}
							className='form-item__input form-item__input--clipboard'
							type="text"
							name={`url-${poll.id}`}
							formNoValidate
							disabled
						/>
						<CopyToClipboard text={url} onCopy={onCopyHandler}>
							<span ref={copyBtn} className='form-item__input-icon form-item__input-icon--clipboard'>
								<FontAwesomeIcon icon={faCopy} />
							</span>
						</CopyToClipboard>
					</div>
				</div>
			</div>
			<div
				onClick={handleShareToApps}
				className="form-switch form-switch--center poll-created-description">
				Or, <a href={url} onClick={e => e.preventDefault()} className='form-switch-action'>share to other Apps</a></div>
		</div>
		// </div >
	)
}