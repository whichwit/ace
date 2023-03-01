import { Component, OnInit } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppointmentActions, HealthcareServiceActions, PatientActions, SlotActions } from '@app/state/actions';
import { HealthcareService, Patient, Slot } from 'fhir/r4'
import { MatStepperModule } from '@angular/material/stepper'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { LetModule } from '@ngrx/component'


import * as fromPatients from '@app/state/reducers/patients.reducer';
import * as fromSlots from '@app/state/reducers/slots.reducer';
import * as fromHealthcareServices from '@app/state/reducers/health-services.reducer';
import * as fromAppointments from '@app/state/reducers/appointments.reducer';
import * as fromCore from '@app/state/reducers/core.reducer'
import { combineLatest, debounceTime, distinctUntilChanged, Observable } from 'rxjs';

@Component({
  selector: 'ii-appointment',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    LetModule,
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  outcome$ = this.store.select(fromCore.outcome)
  outcomeRaw$ = this.store.select(fromCore.outcomeRaw)
  outcomeDisplay$ = this.store.select(fromCore.outcomeDisplay)
  debug$ = this.store.select(fromSlots.currentEntity)

  // patient
  patients$: Observable<Patient[]> = this.store.select(fromPatients.selectAll)

  // slot
  slots$: Observable<Slot[]> = this.store.select(fromSlots.selectSlots)

  // healthcare service
  healthcareServices$: Observable<HealthcareService[]> = this.store.select(fromHealthcareServices.selectAll)

  appointment$ = this.store.select(fromAppointments.currentEntity)


  // groups
  patientFormGroup = this._formBuilder.group({
    family: ['', [Validators.required]],
  });
  rangeFormGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  healthcareServiceControl = new FormControl(null)

  constructor(
    private readonly store: Store,
    private readonly _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // this.searchPatient()

    combineLatest([
      this.patientFormGroup.valueChanges,
      this.patientFormGroup.statusChanges,
    ]).pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(([f, s]) => {
      if (s == 'VALID' && f.family) this.store.dispatch(PatientActions.search({ family: f.family }))
    })

    combineLatest([
      this.rangeFormGroup.valueChanges,
      this.rangeFormGroup.statusChanges,
    ]).pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(([f, s]) => {
      if (s == 'VALID' && f.start && f.end) this.store.dispatch(SlotActions.search({ start: f.start.toJSON(), end: f.end.toJSON() }))
    })

    combineLatest([
      this.healthcareServiceControl.valueChanges,
      this.healthcareServiceControl.statusChanges,
    ]).pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(([id, s]) => {
      if (s == 'VALID' && id) this.store.dispatch(HealthcareServiceActions.select({ id }))
    })
  }

  selectPatient(id: string) {
    this.store.dispatch(PatientActions.select({ id }))
  }

  selectSlot(entity: Slot) {
    this.store.dispatch(SlotActions.select({ id: entity.id!, entity }))
  }

  selectHealthcareService(id: string) {
    this.store.dispatch(HealthcareServiceActions.select({ id }))
  }

  submitAppointmentRequest() {
    this.store.dispatch(AppointmentActions.create())

  }
}
