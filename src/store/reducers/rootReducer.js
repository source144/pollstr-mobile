import { combineReducers } from 'redux';
import managePollsReducer from './managePollsReducer';
import pollReducer from './pollReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
	polls: managePollsReducer,
	poll: pollReducer,
	auth: authReducer
});

export default rootReducer;