import React from 'react';
import axios from 'axios';
import socket from '../socket';
import _ from 'lodash'
import { toast } from 'react-toastify';
// TODO : Ionic Toasts
import {
	CREATE_POLL_REQUEST,
	CREATE_POLL_SUCCESS,
	CREATE_POLL_FAILURE,
	GET_POLL_REQUEST,
	GET_POLL_SUCCESS,
	GET_POLL_FAILURE,
	DELETE_POLL_REQUEST,
	DELETE_POLL_SUCCESS,
	DELETE_POLL_FAILURE,
	EDIT_POLL_REQUEST,
	EDIT_POLL_SUCCESS,
	EDIT_POLL_FAILURE,
	EDIT_POLL_PASSCODE_REQUEST,
	EDIT_POLL_PASSCODE_SUCCESS,
	EDIT_POLL_PASSCODE_FAILURE,
	UPDATE_POLL,
	VOTE_POLL_REQUEST,
	VOTE_POLL_SUCCESS,
	VOTE_POLL_FAILURE,
	SELECT_OPTION,
	DISABLE_VOTING,
	FLUSH_POLL
} from './types/pollTypes'

const updatePoll = updatedPoll => ({ type: UPDATE_POLL, poll: updatedPoll });
export const selectOption = selected => ({ type: SELECT_OPTION, selected })
export const disableVoting = () => ({ type: DISABLE_VOTING })
export const flushPoll = () => ({ type: FLUSH_POLL })

const getPollRequest = () => ({ type: GET_POLL_REQUEST })
const getPollSuccess = poll => ({ type: GET_POLL_SUCCESS, poll })
const getPollFailure = error => ({ type: GET_POLL_FAILURE, error })
export const getPoll = pollId => {
	return (dispatch) => {
		dispatch(getPollRequest());
		axios.get(`poll/${pollId}`)
			.then(response => {
				const poll = response.data;
				dispatch(getPollSuccess(poll));

				// Listen to this poll's updates
				socket.emit('join', `${pollId}`);
				socket.on(`update_${pollId}`, updatedPoll => {
					// Fallback if SocketIO payload doesn't arrive!
					if (!updatedPoll) {
						console.log("Fetching Updated Poll Using Axios.js")
						axios.get(`poll/${pollId}`).then(response => {
							console.log("Fetching Updated Poll via Axios.js success")
							dispatch(updatePoll(_.pick(response.data, "total_votes", "options")));
						}).catch(error => { });
					} else dispatch(updatePoll(updatedPoll));
				});
			})
			.catch(error => {
				const errorData = error.response ? error.response.data : {};
				const errorMsg = error.response && error.response.data ? (error.response.data.message ? error.response.data.message : (typeof error.response.data.error === 'string' ? error.response.data.error : error.message)) : error.message;
				dispatch(getPollFailure(errorMsg))
			});
	}
}

const votePollRequest = () => ({ type: VOTE_POLL_REQUEST })
const votePollSuccess = poll => ({ type: VOTE_POLL_SUCCESS, poll })
const votePollFailure = error => ({ type: VOTE_POLL_FAILURE, error })
export const votePoll = (pollId, optionId, passcode = undefined) => {
	return (dispatch) => {
		dispatch(votePollRequest);
		console.log('passcode', passcode)
		axios.post(`poll/${pollId}/vote/${optionId}`, { passcode })
			.then(response => {
				const poll = response.data;
				dispatch(votePollSuccess(poll));

				// Toast user
				toast.success(<>Vote received!</>, { autoClose: 2000, })
			})
			.catch(error => {
				const errorData = error.response ? error.response.data : {};
				const errorMsg = error.response && error.response.data ? (error.response.data.message ? error.response.data.message : (typeof error.response.data.error === 'string' ? error.response.data.error : error.message)) : error.message;
				dispatch(votePollFailure(errorMsg))


				toast.error(<><strong>Oops!</strong> {errorMsg}</>, { autoClose: 5000, })
			});
	}
}