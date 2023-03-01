import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Slot } from 'fhir/r4'
import { createFeatureSelector, createReducer, createSelector, on, select } from '@ngrx/store';
import { SlotActions } from '../actions';
import { orderBy} from 'lodash-es'

export const featureKey = 'slots';


export interface State extends EntityState<Slot> {
    selectedId: string;
}

export const adapter: EntityAdapter<Slot> = createEntityAdapter<Slot>({
});

export const initialState: State = adapter.getInitialState({
    selectedId: '',
});

export const reducer = createReducer(
    initialState,
    on(SlotActions.searchSuccessful, (state, { payload }) => adapter.setAll(payload, state)),
    on(SlotActions.select, (state, { id }) => ({...state, selectedId: id}))
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


export const selectSlots = createSelector(
    featureState,
    selectAll,
    (state, entities) => {
        return orderBy(entities, ['start'], ['desc']).filter(x => x.status === 'free')
    }
)
