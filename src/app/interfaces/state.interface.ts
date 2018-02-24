/**
 * For some reason i get this error:
 * ==
 * warning.js:10 Unexpected key "items" found in preloadedState argument passed to createStore.
 * Expected to find one of the known reducer keys instead: "root". Unexpected keys will be ignored.
 * ==
 * When passing an initial state that has properties along with combineReducers() when generating the store.
 * This interface fixes that by allowing us to pass an empty initial state.
 */
export interface IInitialState {
    nothing?
}
