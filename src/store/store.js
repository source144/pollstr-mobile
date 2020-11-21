import { createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers/rootReducer';

// const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, logger)));
const store = createStore(rootReducer, applyMiddleware(thunk, logger));

export default store;