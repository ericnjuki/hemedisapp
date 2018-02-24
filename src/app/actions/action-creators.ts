import { LOAD_ITEMS } from 'app/actions/actions';

export function loadItems(items) {
    return {
        type: LOAD_ITEMS,
        items: items
    }
}
