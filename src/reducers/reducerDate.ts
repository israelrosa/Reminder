import React from 'react';

export const dateInitialArgs = new Date();

export interface Action {
  type: string;
  date?: Date;
}

export const reducerDate: React.Reducer<Date, Action> = (
  state,
  action,
): Date => {
  switch (action.type) {
    case 'ADD_DAY': {
      const newDate = new Date(state.getTime());
      newDate.setDate(state.getDate() + 1);
      return newDate;
    }
    case 'REDUCE_DAY': {
      const newDate = new Date(state.getTime());
      newDate.setDate(state.getDate() - 1);
      return newDate;
    }
    case 'CHANGE_DATE':
      if (action.date) {
        return action.date;
      }
      throw new Error();
    default:
      return state;
  }
};
