import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Sensor } from '../model/sensor.model';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class SensorEmitter{
    private _saved:Subject<Sensor>;
    saved$:Observable<Sensor>;
    private _delete:Subject<Sensor>;
    deleted$:Observable<Sensor>;

    constructor(){
        this._saved = new Subject();
        this.saved$ = this._saved.asObservable();
        this._delete = new Subject();
        this.deleted$ = this._delete.asObservable();
    }

    emitSensorSaved(sensor:Sensor):void{
        this._saved.next(sensor);
    }

    emitSensorDeleted(sensor:Sensor):void{
        this._delete.next(sensor);
    }
}