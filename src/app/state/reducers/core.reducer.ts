import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { AppointmentActions, CoreActions, HealthcareServiceActions, PatientActions, ScheduleActions, SlotActions } from '../actions';

import * as fromPatients from './patients.reducer';
import * as fromSlots from './slots.reducer';
import * as fromHealthcareServices from './health-services.reducer';
import * as fromSchedules from './schedules.reducer';
import * as fromAppointments from './appointments.reducer';

export const featureKey = 'core';

export interface State {
  api: string | null
  loading: boolean
}

const initialState: State = {
  api: null,
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(
    PatientActions.search,
    SlotActions.search,
    HealthcareServiceActions.search,
    HealthcareServiceActions.select,
    ScheduleActions.search,
    AppointmentActions.create,
    (state) => ({ ...state, loading: true })
  ),
  on(
    PatientActions.searchSuccessful,
    SlotActions.searchSuccessful,
    HealthcareServiceActions.searchSuccessful,
    AppointmentActions.createSuccessful,
    PatientActions.searchFailure,
    ScheduleActions.searchFailure,
    HealthcareServiceActions.searchFailure,
    SlotActions.searchFailure,
    AppointmentActions.createFailure,
    (state) => ({ ...state, loading: false })
  ),
);

export const coreState = createFeatureSelector<State>(featureKey);

export const topSkip = createSelector(
  coreState,
  state => state.api
)

export const outcome = createSelector(
  coreState,
  fromPatients.currentEntity,
  fromSlots.currentEntity,
  fromHealthcareServices.currentEntity,
  fromSchedules.currentEntity,
  fromAppointments.currentEntity,
  (state, ...entityCollection) => entityCollection
    .map(x => x?.text?.div)
    .filter(x => x).join('<hr class="my-4">')
)

export const outcomeRaw = createSelector(
  coreState,
  fromPatients.currentEntity,
  fromSlots.currentEntity,
  fromHealthcareServices.currentEntity,
  fromSchedules.currentEntity,
  fromAppointments.currentEntity,
  (state, ...s) => s
)

export const outcomeDisplay = createSelector(
  coreState,
  fromPatients.currentEntity,
  fromSlots.currentEntity,
  fromHealthcareServices.currentEntity,
  (state, ...s) => s.map(x => `<div><b>${x?.resourceType}:</b> ${x?.id}</div>`).join('')
)

export const loading = createSelector(
  coreState,
  state => state.loading
)