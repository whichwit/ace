import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HealthcareService } from 'fhir/r4'
import { createFeatureSelector, createReducer, createSelector, on, select } from '@ngrx/store';
import { HealthcareServiceActions } from '../actions';

export const featureKey = 'healthcare-services';


export interface State extends EntityState<HealthcareService> {
    selectedId: string;
}

export const adapter: EntityAdapter<HealthcareService> = createEntityAdapter<HealthcareService>({
});

export const initialState: State = adapter.getInitialState({
    selectedId: '',
});

export const reducer = createReducer(
    initialState,
    on(HealthcareServiceActions.searchSuccessful, (state, { payload }) => adapter.setAll(payload, state)),
    on(HealthcareServiceActions.select, (state, { id }) => ({...state, selectedId: id}))
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


export const selectHealthcareServices = createSelector(
    featureState,
    selectAll,
    (state, entities) => {
        return entities
    }
)
