import * as actions from 'app/actions/actions';

export function loadItems(items) {
    return {
        type: actions.LOAD_ITEMS,
        items: items
    }
}
