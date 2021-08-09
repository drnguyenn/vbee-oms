import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './root.reducer';
import rootSaga from './root.saga';

const saga = createSagaMiddleware();

const middlewares = [saga];

if (process.env.NODE_ENV === 'development') middlewares.push(logger);

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;

saga.run(rootSaga);
