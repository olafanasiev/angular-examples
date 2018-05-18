
export class Sensor{
    id: number;
    mac: string;
    name: string; 
    lon?: number;
    lat?: number;
    battery?: number;
    seenAt?: Date;
    created?: Date; 
    updated?: Date;
    constructor(id:number, mac:string, name:string, lon?:number,lat?:number,battery?:number, seenAt?:Date, created?:Date, updated?:Date){
        this.id = id;
        this.mac = mac;
        this.name = name;
        this.lon = lon;
        this.lat = lat;
        this.battery = battery;
        this.seenAt = seenAt;
        this.created = created;
        this.updated = updated;     
    }

    public static newSensor():Sensor{
    let sensor = new Sensor(0,'','');
    return sensor;
    }
}