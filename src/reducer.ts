import { Loop, Cmd, liftState, loop } from 'redux-loop';
import { compose } from 'redux';
import { Actions, FetchCatsRequest } from './types/actions.type';
import { Picture } from './types/picture.type';
import { fetchCatsCommit, fetchCatsRollback, fetchCatsRequest } from './actions';
import { ApiStatus } from './types/api.type';
import { failure, loading, success } from './api';
import { cmdFetch } from './commands';
import { none, Option, some } from 'fp-ts/lib/Option';

type State = {
  counter: number;
  pictures: ApiStatus;
  selectedPicture: Option<Picture>;
};

export const defaultState: State = {
  counter: 3,
  pictures: loading(),
  selectedPicture: none,
};


export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState;

  switch (action.type) {
    case 'INCREMENT':
      return loop(
        { ...state, counter: state.counter + 1 }, 
        cmdFetch(fetchCatsRequest(state.counter + 1))
      );

    case 'DECREMENT':
      return loop(
        { ...state, counter: state.counter - 1 }, 
        cmdFetch(fetchCatsRequest(state.counter - 1))
      );

    case 'SELECT_PICTURE':
      return { ...state, selectedPicture: some(action.picture) };

    case 'CLOSE_MODAL':
      return { ...state, selectedPicture: none };

    case 'FETCH_CATS_REQUEST':
      return loop(
        { ...state, pictures: loading() }, 
        cmdFetch(action)
      );

    case 'FETCH_CATS_COMMIT':
      return { ...state, pictures: success(action.payload) };

    case 'FETCH_CATS_ROLLBACK':
      return loop(
        { ...state, pictures: failure(action.error.message) },
        Cmd.run(() => console.error('Logging error', action.error))
      );

    default:
      return state;
  }
};

export const counterSelector = (state: State) => state.counter;

export const picturesSelector = (state: State) => state.pictures;

export const getSelectedPicture = (state: State) => state.selectedPicture;

export default compose(liftState, reducer);
