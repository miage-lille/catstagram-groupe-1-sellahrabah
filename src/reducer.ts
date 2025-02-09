import { Loop, Cmd, liftState, loop } from 'redux-loop';
import { compose } from 'redux';
import { Actions, FetchCatsRequest } from './types/actions.type';
import { Picture } from './types/picture.type';
import fakeData from './fake-datas.json';
import { fetchCatsCommit, fetchCatsRollback, fetchCatsRequest } from './actions';
import { ApiStatus } from './types/api.type';
import { failure, loading, parseResponse, success } from './api';

export type State = {
  counter: number;
  pictures: ApiStatus;
  selectedPicture: Picture | null;
};

export const defaultState: State = {
  counter: 3,
  pictures: success([]),
  selectedPicture: null,
};

const cmdFetch = (action: FetchCatsRequest) =>
  Cmd.run(
    () =>
      fetch(action.path, { method: action.method })
        .then(checkStatus)  
        .then(parseResponse),
    {
      successActionCreator: (pictures : Picture[]) => fetchCatsCommit({hits : pictures}),
      failActionCreator: fetchCatsRollback, 
    }
  );

const checkStatus = (response: Response) => {
  if (response.ok) return response;  
  throw new Error(response.statusText);
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
        return { ...state, selectedPicture: action.picture};
    case 'CLOSE_MODAL':
        return { ...state, selectedPicture: null };
    case 'FETCH_CATS_REQUEST':
      return {...state, pictures: loading()};
    case 'FETCH_CATS_COMMIT':
      return { ...state, pictures: success(action.payload.hits) };
    case 'FETCH_CATS_ROLLBACK':
      console.error('API Error:', action.error);
      return loop(
        { ...state, pictures: failure(action.error.message)},
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
