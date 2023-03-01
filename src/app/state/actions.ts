import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { User } from '@app/models';
import { Appointment, HealthcareService, Patient, Schedule, Slot } from 'fhir/r4';

export const CoreActions = createActionGroup({
  source: 'Core',
  events: {
    'NOOP': emptyProps(),
    'Snackbar': props<{ message: string }>(),
    'Set Top Skip': props<{ payload: string }>(),
    // defining an event without payload using the `emptyProps` function
    'Load': emptyProps(),

    'Load Successful': props<{ users: User[] }>(),

    // defining an event with payload using the `props` function
    'Pagination Changed': props<{ page: number; offset: number }>(),

    // defining an event with payload using the props factory
    'Query Changed': (query: string) => ({ query }),
  }
});

export const PatientActions = createActionGroup({
  source: 'Patient',
  events: {
    'Search': props<{ family: string, given?: string }>(),
    'Search Successful': props<{ payload: Patient[] }>(),
    'Search Failure': props<{ error: any }>(),
    'Select': props<{ id: string }>(),
  }
});

export const SlotActions = createActionGroup({
  source: 'Slot',
  events: {
    'Search': props<{ start: string, end: string }>(),
    'Search Successful': props<{ payload: Slot[] }>(),
    'Search Failure': props<{ error: any }>(),
    'Select': props<{ id: string, entity?: Slot }>(),
  }
});

export const HealthcareServiceActions = createActionGroup({
  source: 'HealthcareService',
  events: {
    'Search': props<{ organization: string }>(),
    'Search Successful': props<{ payload: HealthcareService[] }>(),
    'Search Failure': props<{ error: any }>(),
    'Select': props<{ id: string }>(),
  }
});

export const ScheduleActions = createActionGroup({
  source: 'Schedule',
  events: {
    'Search': props<{ actor: string }>(),
    'Search Successful': props<{ payload: Schedule[] }>(),
    'Search Failure': props<{ error: any }>(),
    'Select': props<{ id: string }>(),
  }
});

export const AppointmentActions = createActionGroup({
  source: 'Appointment',
  events: {
    'Search': props<{ actor: string }>(),
    'Search Successful': props<{ payload: Appointment[] }>(),
    'Search Failure': props<{ error: any }>(),
    'Select': props<{ id: string }>(),
    'Create': emptyProps(),
    'Create Successful': props<{ payload: Appointment }>(),
    'Create Failure': props<{ error: any }>(),
  }
});