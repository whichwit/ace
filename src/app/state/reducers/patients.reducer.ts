import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Patient } from 'fhir/r4'
import { createFeatureSelector, createReducer, createSelector, on, select } from '@ngrx/store';
import { PatientActions } from '../actions';

export const featureKey = 'patients';


export interface State extends EntityState<Patient> {
    selectedId: string;
}

export const adapter: EntityAdapter<Patient> = createEntityAdapter<Patient>({
});

export const initialState: State = adapter.getInitialState({
    selectedId: '',
});

export const reducer = createReducer(
    initialState,
    on(PatientActions.searchSuccessful, (state, { payload }) => adapter.setAll(payload, state)),
    on(PatientActions.select, (state, { id }) => ({...state, selectedId: id}))
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
    (state) => state.selectedId
)

export const currentEntity = createSelector(
    featureState,
    selectEntities,
    currentId,
    (state, entities, id) => entities[id]
)


export const selectPatients = createSelector(
    featureState,
    selectAll,
    (state, entities) => {
        return entities.filter(x => x.active && x.name?.filter(y => y.use != 'old'))
    }
)
