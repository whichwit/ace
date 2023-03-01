import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Appointment } from 'fhir/r4'
import { createFeatureSelector, createReducer, createSelector, on, select } from '@ngrx/store';
import { AppointmentActions } from '../actions';

export const featureKey = 'appointments';


export interface State extends EntityState<Appointment> {
    selectedId: string;
}

export const adapter: EntityAdapter<Appointment> = createEntityAdapter<Appointment>({
});

export const initialState: State = adapter.getInitialState({
    selectedId: '',
});

export const reducer = createReducer(
    initialState,
    on(AppointmentActions.searchSuccessful, (state, { payload }) => adapter.setAll(payload, state)),
    on(AppointmentActions.createSuccessful, (state, { payload }) => adapter.setOne(payload, state)),
    on(AppointmentActions.select, (state, { id }) => ({...state, selectedId: id}))
)

export const featureState = createFeatureSelector<State>(featureKey);

export const {
    selectIds: selectIds,
    selectEntities: selectEntities,
    selectAll: selectAll,
    selectTotal: selectTotal,
} = adapter.getSelectors(featureState);

export const currentId = createSelector(
    featureState,
    selectIds,
    (state, ids) => state.selectedId == '' ? (ids && ids[0]) : state.selectedId
)

export const currentEntity = createSelector(
    featureState,
    selectEntities,
    currentId,
    (state, entities, id) => entities[id]
)


export const selectAppointments = createSelector(
    featureState,
    selectAll,
    (state, entities) => {
        return entities
    }
)
