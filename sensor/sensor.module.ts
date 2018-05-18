import {NgModule} from '@angular/core';
import { SensorViewTableComponent } from './components/crud/sensor-view-table.component';
import { SensorSaveDialogComponent } from './components/crud/sensor-save-dialog.component';
import { SensorService } from './services/sensor.service';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { SensorEmitter } from './emitters/sensor.emitter';
import { SensorDeleteDialogComponent } from './components/crud/sensor-delete-dialog.component';
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
      ],
      declarations:[SensorViewTableComponent, SensorSaveDialogComponent, SensorDeleteDialogComponent],
      providers:[SensorService,SensorEmitter],
      exports:[SensorViewTableComponent],
      entryComponents:[SensorSaveDialogComponent, SensorDeleteDialogComponent]
})
export class SensorModule{}