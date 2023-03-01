import { isDevMode } from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import * as fromRouter from '@ngrx/router-store';
import * as fromCore from './core.reducer';
import * as fromUsers from './users.reducer';
import * as fromPatients from './patients.reducer';
import * as fromSlots from './slots.reducer';
import * as fromHealthcareServices from './health-services.reducer';
import * as fromSchedules from './schedules.reducer';
import * as fromAppointments from './appointments.reducer';


export interface State {
  [fromCore.featureKey]: fromCore.State
  [fromUsers.featureKey]: fromUsers.State
  [fromPatients.featureKey]: fromPatients.State
  [fromSlots.featureKey]: fromSlots.State
  [fromHealthcareServices.featureKey]: fromHealthcareServices.State
  [fromSchedules.featureKey]: fromSchedules.State
  [fromAppointments.featureKey]: fromAppointments.State
  router: fromRouter.RouterReducerState<any>;
}

export const reducers: ActionReducerMap<State> = {
  [fromCore.featureKey]: fromCore.reducer,
  [fromUsers.featureKey]: fromUsers.reducer,
  [fromPatients.featureKey]: fromPatients.reducer,
  [fromSlots.featureKey]: fromSlots.reducer,
  [fromHealthcareServices.featureKey]: fromHealthcareServices.reducer,
  [fromSchedules.featureKey]: fromSchedules.reducer,
  [fromAppointments.featureKey]: fromAppointments.reducer,
  router: fromRouter.routerReducer,
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [logger] : [logger];


// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

export function localStorageSyncReducer(reducer: ActionReducer<State>): ActionReducer<State> {
  return localStorageSync({
    keys: [fromCore.featureKey],
    rehydrate: true
  })(reducer);
}