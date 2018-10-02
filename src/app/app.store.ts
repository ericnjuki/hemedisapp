import {
  ADD_ITEMS,
  RESET_ITEMS,
  CLEAR,
  UPDATE_ITEMS,
  DELETE_ITEMS,
  POST_TRANSACTIONS,
  DELETE_TRANSACTIONS,
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

    case POST_TRANSACTIONS:
      const transactionObj = {
        transactionId: action.data.transactionId,
        items: action.data.items,
        transactionType: action.data.transactionType,
        date: action.data.date
      };
      const transactionsCopy = jQuery.extend(true, {}, state.transactions);
      const transactionDate = action.data.date;
      if (transactionsCopy[transactionDate] === undefined) {
        transactionObj.transactionId = 0;
        transactionsCopy[transactionDate] = [transactionObj];
      } else {
        transactionObj.transactionId = transactionsCopy[transactionDate].length;
        transactionsCopy[transactionDate].push(transactionObj);
      }

      // update quantity
      const stockItemsCopy = [...state.stockItems];
      for (let i = 0; i < action.data.items.length; i++) {
        const currentItem = action.data.items[i];
        stockItemsCopy.filter((item, index) => {
          if (item.itemId === currentItem.itemId) {
            item.quantity -= currentItem.quantity;
          }
        });
      }
      return tassign(state, {stockItems: stockItemsCopy, transactions: transactionsCopy});

    case DELETE_TRANSACTIONS:
      const transactionsCopy2 = jQuery.extend(true, {}, state.transactions);
      const transactionsKeys = Object.keys(transactionsCopy2);
      for (let i = 0; i < transactionsKeys.length; i++) {
        const transacsOfCurrentDate = transactionsCopy2[transactionsKeys[i]];
        for (let j = 0; j < transacsOfCurrentDate.length; j++) {
          if (action.transactionIds.indexOf(transacsOfCurrentDate[j].transactionId) !== -1) {
            transacsOfCurrentDate.splice(j, 1);
          }
          if (transacsOfCurrentDate.length < 1) {
            delete transactionsCopy2[transactionsKeys[i]];
          }
        }
      }
      return tassign(state, {transactions: transactionsCopy2});

    case CLEAR:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export const INITIAL_STATE: IAppState = {
  stockItems: [],
  transactions: {}
};
