import {
  ADD_ITEMS,
  RESET_ITEMS,
  CLEAR,
  UPDATE_ITEMS,
  DELETE_ITEMS
} from './app.actions';
import { tassign } from 'tassign';
import { IAppState } from './interfaces/appstate.interface';

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

    case UPDATE_ITEMS:
      const updatedStockItems = [...state.stockItems];
      for (let i = 0; i < action.items.length; i++) {
        const updatedItem = action.items[i];

        for (let j = 0; j < updatedStockItems.length; j++) {
          const itemInStore = updatedStockItems[j];
          if (updatedItem.itemId === itemInStore.itemId) {
            updatedStockItems[j] = updatedItem;
          }
        }
      }
      return tassign(state, { stockItems: updatedStockItems });

    case DELETE_ITEMS:
      const newSetOfStockItems = [...state.stockItems];
      for (let i = 0; i < action.itemIds.length; i++) {
        const deletedItemId = action.itemIds[i];

        for (let j = 0; j < newSetOfStockItems.length; j++) {
          const itemInStore = newSetOfStockItems[j];
          if (deletedItemId === itemInStore.itemId) {
            newSetOfStockItems.splice(j, 1);
          }
        }
      }
      return tassign(state, { stockItems: newSetOfStockItems });

    case CLEAR:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export const INITIAL_STATE: IAppState = {
  stockItems: []
};
