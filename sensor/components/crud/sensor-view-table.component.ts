import { Component, OnInit, Inject } from '@angular/core';
import { SensorService } from '../../services/sensor.service';
import { Observable } from 'rxjs/Observable';
import { Sensor } from '../../model/sensor.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { SensorSaveDialogComponent } from './sensor-save-dialog.component';
import { SensorEmitter } from '../../emitters/sensor.emitter';
import * as _ from 'lodash';
import { SensorDeleteDialogComponent } from './sensor-delete-dialog.component';
@Component({
    selector:'sensors-view-table',
    styles:[
        `.sensor__table-component{
            width: 90%;
        }`,
        `.sensor__name{
            width: 30%;
        }`,
        `.sensor__mac{
            width: 30%;
        }`,
        `.sensor__battery{
            width: 10%;
        }`,
        `.sensor__last-seen{
            width: 10%;
        }`,
        `.sensor__longitude{
            width: 10%;
        }`,
        `.sensor__latitude{
            width: 10%;
        }`,
        `.sensor__table-component__header{
            margin-bottom: 5px;
        }`,
        `.sensor-control-panel{
            width: 100%;
        }`,
        `.sensor__panel,.sensor__wrapper{
            width: 100%;
        }
        
        `,
        `.sensor-control-button{
            margin-top: 10px;   
        }`
    ],
    template: `
    <div fxFill fxLayout="column" fxLayoutAlign="start center">
        <h3 class="component-title">Sensor Management</h3>
        <div class="sensor__table-component">
            <mat-card class="crud-expandable-table-header sensor__table-component__header">
                <div fxLayout="row" fxLayoutAlign="space-between">
                    <div class="sensor__name">Name</div>
                    <div class="sensor__mac">Mac</div>
                    <div class="sensor__battery">Battery</div>
                    <div class="sensor__last-seen">Last seen at</div>
                    <div class="sensor__longitude">Longitude</div> 
                    <div class="sensor__latitude">Latitude</div>
                </div>
            </mat-card>
            <mat-accordion *ngFor="let sensor of sensors">
            <mat-expansion-panel [expanded]="false" disabled="false">
              <mat-expansion-panel-header>
                <mat-panel-title class="sensor__panel">
                    <div class="sensor__wrapper" fxLayout="row" fxLayoutAlign="space-between">
                        <div class="sensor__name">{{sensor.name}}</div>
                        <div class="sensor__mac">{{sensor.mac}}</div>
                        <div class="sensor__battery">{{sensor.battery}}</div>
                        <div class="sensor__last-seen">{{sensor.seenAt | date: 'dd/MM/y HH:mm:ss'}}</div>
                        <div class="sensor__longitude">{{sensor.lon}}</div> 
                        <div class="sensor__latitude">{{sensor.lat}}</div>
                    </div>
                </mat-panel-title>
                
              </mat-expansion-panel-header>
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="openEditDialog(sensor)">
                  <mat-icon>mode_edit</mat-icon>
                  <span>Edit Details</span>
                </button>
                <button mat-menu-item (click)="openDeleteDialog(sensor)">
                    <mat-icon >delete</mat-icon>
                  Delete
                </button>
              </mat-menu>
            </mat-expansion-panel>
            </mat-accordion>
            <div fxLayout="row" fxLayoutAlign="end" class="sensor-control-panel">
                <button mat-fab 
                color="primary" class="sensor-control-button"  
                matTooltip="Add New Sensor"
                (click)="openCreateDialog()">
                <mat-icon>add</mat-icon>
                </button>
            </div>
        </div>
    </div>
    `
})
export class SensorViewTableComponent implements OnInit{
    sensors: Sensor[];
    constructor(private sensorService:SensorService,
                private sensorEmitter:SensorEmitter,
                private dialog: MatDialog){
                    this.sensors = [];
                }

    ngOnInit(){
       this.sensorService.getAll().subscribe((sensors:Sensor[])=>{
            this.sensors = _.union(sensors, this.sensors);
       });
       this.sensorEmitter.saved$.subscribe((sensor:Sensor)=>{
           let foundSensor = _.find(this.sensors,{'id':sensor.id});
           if( foundSensor ){
               foundSensor.name = sensor.name;
               foundSensor.mac = sensor.mac;           
            } else {
             this.sensors.push(sensor);
           }
       });

       this.sensorEmitter.deleted$.subscribe((sensorToRemove:Sensor)=>{
            _.remove(this.sensors, (sensor:Sensor)=>{
                return sensor.id == sensorToRemove.id;
            });
       });
    }

    openDeleteDialog(sensor:Sensor){
        const dialogRef = this.dialog.open(
            SensorDeleteDialogComponent, {
                width: '25vw',
                data: {'sensor': sensor}
            }
          );
    }

    openEditDialog(sensor:Sensor){
        const dialogRef = this.dialog.open(
            SensorSaveDialogComponent, {
                width: '50vw',
                data: {'sensor': sensor}
            }
        )
    }

    openCreateDialog(){
        const dialogRef = this.dialog.open(
            SensorSaveDialogComponent, {
                width: '50vw',
                data: {'sensor': Sensor.newSensor()}
            }
          );
    }
}