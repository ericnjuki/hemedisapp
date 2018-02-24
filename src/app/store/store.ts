import { IInitialState } from './../interfaces/state.interface';
import { LOAD_ITEMS } from './../actions/actions';
export interface INPState extends IInitialState {
    items;
    transactions;
    statistics;

}

export function rootReducer(state: INPState, action): IInitialState {
    switch (action.type) {
        case LOAD_ITEMS:
            return Object.assign({}, state, {items: action.items});
        default:
            return {};
    }
}
