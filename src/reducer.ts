import { Loop, Cmd, liftState, loop } from 'redux-loop';
import { compose } from 'redux';
import { Actions, FetchCatsRequest } from './types/actions.type';
import { Picture } from './types/picture.type';
import fakeData from './fake-datas.json';
import { fetchCatsCommit, fetchCatsRollback, fetchCatsRequest } from './actions';

export type State = {
  counter: number;
  pictures: Picture[];
  selectedPicture: Picture | null;
};

export const defaultState: State = {
  counter: 3,
  pictures: [],
  selectedPicture: null,
};

const cmdFetch = (action: FetchCatsRequest) =>
  Cmd.run(
    () => {
      return fetch(action.path, { method: action.method })
        .then(checkStatus)  
        .then(response => response.json()) 
    },
    {
      successActionCreator: (data: { hits: Picture[] }) => fetchCatsCommit(data),
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
      return state;
    case 'FETCH_CATS_COMMIT':
      return { ...state, pictures: action.payload.hits };
    case 'FETCH_CATS_ROLLBACK':
      console.error('API Error:', action.error);
      return state;

    default:
      return state;
  }
};

export const counterSelector = (state: State) => state.counter;

export const picturesSelector = (state: State) => state.pictures;

export const getSelectedPicture = (state: State) => state.selectedPicture;

export default compose(liftState, reducer);
