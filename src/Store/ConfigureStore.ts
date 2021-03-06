import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import { Reducers } from './StoreRedusers';

export default function configureStore() {

    const composedEnhacer = composeWithDevTools(applyMiddleware(thunkMiddleware))
    const rootReducers = combineReducers({
        ...Reducers,
    });
    return createStore(rootReducers, composedEnhacer)
}