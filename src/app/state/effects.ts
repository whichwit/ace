import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType, rootEffectsInit } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material/snack-bar";

import { CoreActions, AppointmentActions, PatientActions, SlotActions, HealthcareServiceActions, ScheduleActions } from './actions'
import * as fromPatients from './reducers/patients.reducer'
import * as fromSlots from './reducers/slots.reducer'
import * as fromHealthcareServices from './reducers/health-services.reducer'

import { Patient, Bundle, Slot, HealthcareService, Schedule, Appointment } from 'fhir/r4'
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable()
export class effects {
    api = 'https://server.fire.ly'
    organization_id = '63139517-6bba-4376-aac7-c8847bc9ca9a'
    headers = {
        Accept: 'application/fhir+json'
    }

    mapToResource<T>(payload: Bundle) {
        return payload.entry?.filter(x => x.search?.mode === 'match').map(x => x.resource as T) ?? []
    }

    reportErrorViaSnackbar$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                PatientActions.searchFailure,
                ScheduleActions.searchFailure,
                HealthcareServiceActions.searchFailure,
                SlotActions.searchFailure,
                AppointmentActions.createFailure,
            ),
            map(err => CoreActions.snackbar({ message: err.error.message }))
        )
    )

    getHealthcareServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(rootEffectsInit),
            switchMap(_ => {
                return this.http.get<Bundle>(`${this.api}/HealthcareService`, {
                    headers: this.headers,
                    params: new HttpParams()
                        .append('active', true)
                        .append('organization', this.organization_id)
                }).pipe(
                    map(x => HealthcareServiceActions.searchSuccessful({ payload: this.mapToResource<HealthcareService>(x) })
                    ))
            }),
        ))

    searchPatient$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PatientActions.search),
            switchMap(({ family, given }) => {
                return this.http.get(`${this.api}/Patient`, {
                    headers: this.headers,
                    params: new HttpParams()
                        .append('active', 'true')
                        .append('name', family)
                }).pipe(
                    map(x => PatientActions.searchSuccessful({
                        payload: (x as Bundle).entry?.filter(x2 => x2.search?.mode === 'match').map(x => x.resource as Patient) ?? []
                    })
                    ))
            }),
        )
    );


    getSchedules$ = createEffect(() =>
        this.actions$.pipe(
            ofType(HealthcareServiceActions.select),
            switchMap(({ id }) => {
                return this.http.get<Bundle>(`${this.api}/Schedule`, {
                    headers: this.headers,
                    params: new HttpParams()
                        .append('active', true)
                        .append('actor', `HealthcareService/${id!}`)
                }).pipe(
                    map(x => ScheduleActions.searchSuccessful({
                        payload: this.mapToResource<Schedule>(x)
                    })),
                    catchError(error => of(ScheduleActions.searchFailure({ error })))
                )
            }),
        )
    )

    snackbar$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CoreActions.snackbar),
            exhaustMap(({ message }) => {
                const snackbarRef = this.snackbar.open(message, 'Dismiss', { duration: 10000 })
                return snackbarRef.afterDismissed()
            }),

        ), { dispatch: false }

    );

    createAppointment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.create),
            concatLatestFrom(() => combineLatest([
                this.store.select(fromSlots.currentEntity),
                this.store.select(fromHealthcareServices.currentEntity),
                this.store.select(fromPatients.currentEntity)
            ])),
            switchMap(([_, [slot, service, patient]]) => {
                return this.http.post(`${this.api}/Appointment`, {
                    resourceType: "Appointment",
                    "status": "booked",
                    "slot": [
                        {
                            "reference": `https://server.fire.ly/Slot/${slot?.id}`
                        }
                    ],
                    "reasonCode": [
                        {
                            "text": "I have heart pain"
                        }
                    ],
                    "comment": "Appointment request comment",
                    "participant": [
                        {
                            "actor": {
                                "reference": `Patient/${patient?.id}`
                            },
                            "required": "required",
                            "status": "accepted"
                        },
                        {
                            "actor": {
                                "reference": `Location/${this.organization_id}`,
                                "display": "clinic6"
                            },
                            "required": "required",
                            "status": "accepted"
                        }
                    ],

                    start: `${slot?.start}`,
                    end: `${slot?.end}`
                }, {
                    headers: this.headers
                }).pipe(
                    map(a => AppointmentActions.createSuccessful({ payload: a as Appointment })),
                    catchError(error => of(AppointmentActions.createFailure({ error })))
                )
            }),
        )
    )


    getSlots$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.searchSuccessful),
            map(({ payload }) => payload.map(y => y.id)),
            switchMap(schedules => forkJoin([...schedules.map(s =>
                this.http.get<Bundle>(`${this.api}/Slot`, {
                    headers: this.headers,
                    params: new HttpParams()
                        .append('schedule', s!)
                }).pipe(map(x => this.mapToResource<Slot>(x)))
            )])
            ),
            map(x => SlotActions.searchSuccessful({ payload: x.flat() })),
            catchError(error => of(SlotActions.searchFailure({ error })))
        )
    );
    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        private readonly http: HttpClient,
        private readonly snackbar: MatSnackBar,
    ) { }
}