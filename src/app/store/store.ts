import { IItem } from 'app/interfaces/item.interface';
import { IInitialState } from './../interfaces/state.interface';
import { LOAD_ITEMS } from './../actions/actions';

export interface INPState extends IInitialState {
    items;
    transactions;
    statistics;
    sales: {
        Receipt: {
            items: IItem[]
        },
        selectedPage: number,
        newItem: IItem,
        outOfStock: number[],
    };
    purchases: {
        Receipt: {
            items: IItem[]
        },
        selectedPage: number,
        newItem: IItem,
    };
    stock: {
        newItem: IItem,
        selectedItems: number[],
        updatedItems: number[],
        selectedPage: number,
    };
    receiptBook: {
        loadedReceipts: {year: number, receiptId: number}[],
        selectedReceipts: number,
        selectedPage: {year: number, month: number},
    };
    stats: {
        selectedPage: number,
    };
    bulkAdd: {
        bulkItems: IItem[],
    }

}

export function rootReducer(state: INPState, action): IInitialState {
    switch (action.type) {
        case LOAD_ITEMS:
            return Object.assign({}, state, {items: action.items});
        default:
            return {};
    }
}
