import { Component, Inject } from '@angular/core';
import { Sensor } from '../../model/sensor.model';
import { SensorService } from '../../services/sensor.service';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SensorEmitter } from '../../emitters/sensor.emitter';

@Component({
    selector: 'sensor-dialog',
    template:`
    <h2 mat-dialog-title>Sensor</h2>
    <form novalidate (ngSubmit)="save()" [formGroup]="form">
    <mat-dialog-content>
        <div fxLayout="column" class="sensor-form-container">
            <mat-form-field>
                <input matInput formControlName="name" placeholder="Name">
            </mat-form-field>
            <mat-form-field>
                <input matInput [textMask]="{mask: macMask}" formControlName="mac" placeholder="Mac">
            </mat-form-field>
        </div>
        </mat-dialog-content>
        <mat-dialog-actions>
        <button mat-button [disabled]="!form.valid" [type]="'submit'" color="primary" [mat-dialog-close]="true">SAVE</button>
        <button mat-button mat-dialog-close>CANCEL</button>
        </mat-dialog-actions>
    </form>`
})
export class SensorSaveDialogComponent{
    sensor:Sensor;
    macMask = [/[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':', /[0-9A-Fa-f]/, /[0-9A-Fa-f]/,':', /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':', /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':', /[0-9A-Fa-f]/, /[0-9A-Fa-f]/,':',/[0-9A-Fa-f]/, /[0-9A-Fa-f]/];
    form:FormGroup;
    constructor(
        private sensorService: SensorService,
        private fb:FormBuilder,
        private sensorEmitter: SensorEmitter,
        public dialogRef: MatDialogRef<SensorSaveDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.sensor = data.sensor;
        }    

    ngOnInit(){
        this.form = this.fb.group({
            id: [this.sensor.id],
            name: [this.sensor.name,[Validators.required]],
            mac: [this.sensor.mac, [Validators.required, Validators.pattern(new RegExp(/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/))]]
        })
    }

    save(){
      let sensor = new Sensor(this.form.value.id, this.form.value.mac, this.form.value.name);
      this.sensorService.save(sensor).subscribe((savedSensor:Sensor)=>{
            this.sensorEmitter.emitSensorSaved(savedSensor);
    });
    }
}