import { Loop, liftState } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';
import { Picture } from './types/picture.type';
import fakeData from './fake-datas.json';

export type State = {
  counter: number,
  pictures: Picture[], 
  selectedPicture: Picture | null,
}

export const defaultState: State = {
  counter: 3,
  pictures: fakeData,
  selectedPicture: null,
}



export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState; // mandatory by redux
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1};
    case 'DECREMENT':
      return { ...state, counter: state.counter - 1};
    case 'SELECT_PICTURE':
      return { ...state, selectedPicture: action.picture};
    case 'CLOSE_MODAL':
      return { ...state, selectedPicture: null };
    case 'FETCH_CATS_REQUEST':
      throw 'Not Implemented';
    case 'FETCH_CATS_COMMIT':
      throw 'Not Implemented';
    case 'FETCH_CATS_ROLLBACK':
      throw 'Not Implemented';
  }
};

export const counterSelector = (state: State) => state.counter;

export const picturesSelector = (state: State) => state.pictures;

export const getSelectedPicture = (state: State) => state.selectedPicture;

export default compose(liftState, reducer);
