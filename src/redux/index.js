
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';

//reducers
import teacher from './reducers/teacherReducer'
import admin from './reducers/adminReducer'
import data from './reducers/dataReducer'

const initialState = {};

const middlewares = [
    thunk,
    // logger
]

const reducers = {
    teacher,
    admin,
    data
}

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  // other store enhancers if any
);

export default createStore(
    combineReducers(reducers),
    initialState,
    enhancer
)