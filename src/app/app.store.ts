import { GET_ITEMS, ADD_ITEMS, RESET_ITEMS, CLEAR } from './app.actions';
import { tassign } from 'tassign';
import { IAppState } from './interfaces/appstate.interface';
import { dbStockItems } from './shared/app.db';

// I had to set the default state to INITIAL_STATE because state is undefined otherwise
// I don't know why I thought since I'm passing INITIAL_STATE in configureStore in app.module
// it would automatically be passed to rootReducer() :/
export function rootReducer(state = INITIAL_STATE, action): IAppState {
  switch (action.type) {
    case RESET_ITEMS:
      return tassign(state, { stockItems: action.items });
    case ADD_ITEMS:
      return tassign(state, {
        stockItems: [...action.items].concat(state.stockItems)
      });
    case CLEAR:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export const INITIAL_STATE: IAppState = {
  stockItems: []
};
