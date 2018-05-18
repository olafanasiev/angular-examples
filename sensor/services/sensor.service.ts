import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {API_URL} from '../../shared/app.constants';
import { Sensor } from '../model/sensor.model';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { Response } from '@angular/http';

@Injectable()
export class SensorService{

    constructor(private http:AuthHttp){

}

    public getAll():Observable<Sensor[]>{
        return this.http.get(`${API_URL}/sensors/all`)
            .map((res:Response)=>{
                return res.json().map(item=>{
                    return new Sensor(item.id, item.mac, item.name, item.lon, item.lat, item.battery, item.seenAt, item.created, item.updated);
                });
            });
    }

    public save(sensor:Sensor):Observable<Sensor>{
        
        return this.http.post(`${API_URL}/sensors/save`, sensor)
            .map((res:Response)=>{
                let sensorObj = res.json();
                    return new Sensor(sensorObj.id, sensorObj.mac, sensorObj.name, sensorObj.lon, sensorObj.lat, sensorObj.battery, sensorObj.seenAt);
                });
        
    }

    public delete(sensor:Sensor):Observable<Sensor>{
        return this.http.post(`${API_URL}/sensors/delete`, sensor)
        .map((res:Response)=>{
            let sensorObj = res.json();
            return new Sensor(sensorObj.id, sensorObj.mac, sensorObj.name, sensorObj.lon, sensorObj.lat, sensorObj.battery, sensorObj.seenAt);
        });
    
    }
}