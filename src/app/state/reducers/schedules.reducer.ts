import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Schedule } from 'fhir/r4'
import { createFeatureSelector, createReducer, createSelector, on, select } from '@ngrx/store';
import { ScheduleActions } from '../actions';

export const featureKey = 'schedules';


export interface State extends EntityState<Schedule> {
    selectedId: string;
}

export const adapter: EntityAdapter<Schedule> = createEntityAdapter<Schedule>({
});

export const initialState: State = adapter.getInitialState({
    selectedId: '',
});

export const reducer = createReducer(
    initialState,
    on(ScheduleActions.searchSuccessful, (state, { payload }) => adapter.setAll(payload, state)),
    on(ScheduleActions.select, (state, { id }) => ({...state, selectedId: id}))
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
    (state) => state.selectedId ?? state.ids[0]
)

export const currentEntity = createSelector(
    featureState,
    selectEntities,
    currentId,
    (state, entities, id) => entities[id]
)


export const selectSchedules = createSelector(
    featureState,
    selectAll,
    (state, entities) => {
        return entities
    }
)
