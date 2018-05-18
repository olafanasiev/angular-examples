import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Sensor } from '../../model/sensor.model';
import { SensorService } from '../../services/sensor.service';
import { SensorEmitter } from '../../emitters/sensor.emitter';

@Component({
  selector: 'sensor-delete-dialog',
  template: `
        <h2 mat-dialog-title>Delete sensor</h2>
        <mat-dialog-content>
            <h4 class="sensor-deletion-title">Please confirm deletion of sensor:</h4>
            <p class="sensor-delete-dialog-p">name: {{sensor.name}}</p>
            <p class="sensor-delete-dialog-p">mac: {{sensor.mac}}</p>
        </mat-dialog-content>
        <mat-dialog-actions>
            <!-- Can optionally provide a result for the closing dialog. -->
            <button mat-button color="warn" [mat-dialog-close]="true" (click)="delete()">DELETE</button>
            <button mat-button mat-dialog-close>CANCEL</button>
        </mat-dialog-actions>
    `,
    styles:[
        `.sensor-delete-dialog-p {
            font:500 14px/16px Roboto,"Helvetica Neue",sans-serif;
        }`,
        `.sensor-deletion-title{
            font:500 18px/20px Roboto,"Helvetica Neue",sans-serif;
        }`
    ]
})
export class SensorDeleteDialogComponent implements OnInit {

  private sensor: Sensor;

  constructor(
    private sensorService: SensorService,
    private sensorEmitter: SensorEmitter,
    public dialogRef: MatDialogRef<SensorDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sensor = data.sensor;
  }

  ngOnInit() {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  delete(): void {
    this.sensorService.delete(this.sensor).subscribe((sensor:Sensor)=>{
        this.sensorEmitter.emitSensorDeleted(sensor);
    });
  }

}
