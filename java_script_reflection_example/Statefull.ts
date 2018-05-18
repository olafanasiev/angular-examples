import { ServiceLocator } from './serviceLocator';
import 'reflect-metadata';
import * as _ from 'lodash';
import { setTimeout } from 'timers';
import { TabService } from '../../../home/components/tabs/tab.service';
import { CommunicationService } from '../../../../api/services/communication';
import { AppStateService } from '../../../../api/services/appStateService';
import { TabEventEmitter } from '../../../../api/services/eventEmitors/tabEventEmitter';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { AuthenticationService } from '../../../../api/services/auth';
import {MemStorage} from './MemStorage';
import { LoggerService } from '../../../../api/services/logging/loggingService';

export namespace KEY_EXCLUDE { 
    export const tab = 'tab';
    export const userName = 'username';
    export const component = 'component';
}
export function Statefull(config?: any) {
    return function(target: any) {

        const getStateFields = function(instance) {
            const stateFields = [];
            _.forIn(instance, ( value, field ) => {
                const keys = Reflect.getMetadataKeys( instance, field);
                
                _.forEach(keys, ( metaKey: string ) => { 
                    if ( metaKey.startsWith('custom:statefull')) {
                        stateFields.push(field);
                    }
                });
            });
            return stateFields;
        };

        const saveData = (component: any) => {
            const dataToSave = {};
            const stateFields = getStateFields(component);
            _.forEach(stateFields, (field) => {
                if ( component[field]) { 
                    dataToSave[field] = component[field];
                }
            });
            const dataKey = getDataKey(component.__tabname__$$, component.__username__$$); 
            
            MemStorage.getInstance().put(dataKey, dataToSave);
        };

        const getDataKey = (tabName, user) => {
            let componentName = target.name;
            if (config && config.excludeFromKey) {

              _.forEach(config.excludeFromKey, (keyToExclude) => { 
                    switch (keyToExclude) {
                        case KEY_EXCLUDE.tab: tabName = ''; break;
                        case KEY_EXCLUDE.component: componentName = ''; break;
                        case KEY_EXCLUDE.userName: user = ''; break;
                    }
              });
            }

            return `${user}:${tabName}:${componentName}`;
        };
 
        
        const loadData = (component) => {
            const loadDataKey = getDataKey(component.__tabname__$$, component.__username__$$);
            const appStateService = ServiceLocator.injector.get(AppStateService);
            const stateFields = getStateFields(component);
            _.forEach(stateFields, (field) => {
                            if ( MemStorage.getInstance().get(loadDataKey) && 
                            MemStorage.getInstance().get(loadDataKey)[field] ) {
                                component[field] = MemStorage.getInstance().get(loadDataKey)[field];
                            }
                    });   
        };

        // override default component lifecycle behaviours
        // saving default int
        if ( target.prototype.ngOnInit ) { 
            target.prototype.superNgOnInit = target.prototype.ngOnInit;
        }

        if ( target.prototype.ngAfterViewInit ) {
            target.prototype.superNgAfterViewInit = target.prototype.ngAfterViewInit;
        }

        if ( target.prototype.ngOnDestroy ) {
            target.prototype.superNgOnDestroy = target.prototype.ngOnDestroy;
        }

        // overwrite afterview init function, 
        // because we have data that returns as Promise so
        // ngAfterViewInit may not receive this data before
        // so we do afterViewInit after data loaded on init
        target.prototype.ngAfterViewInit = function() {};

        target.prototype.ngOnInit = function() {
                const log = ServiceLocator.injector.get(LoggerService);
                try { 

                    const componentInstance = this; 
                    const tabService = ServiceLocator.injector.get(TabService);
                    const appStateService = ServiceLocator.injector.get(AppStateService);
                    // reserved veriables. Will overwrite existing 
                    this.__tabname__$$ = tabService.getCurrentTab() ? tabService.getCurrentTab().title : '';
                    this.__blockSavingState__$$ = false;
                    this.__username__$$ = ServiceLocator.injector.get(AuthenticationService).getUsername();
                    this.__saveStateSubscription__$$ = appStateService.saveStateSubject$.subscribe(() => {
                        saveData(componentInstance);
                    });
    
    
                    this.__loadInvestigationSubscription__$$ = appStateService.loadState$.subscribe(() => {
                        this.__blockSavingState__$$ = true;
                        // if component is not reloaded on loading state - 
                        // then we should automatically 
                        if ( config && config.excludeFromKey ) {
                            if ( _.includes(config.excludeFromKey, KEY_EXCLUDE.tab ) ) {
                                loadData(componentInstance);
                            }
                        } 
                    });
                    
                    this.__tabDeletedSubscription__$$ = ServiceLocator.injector.get(TabEventEmitter).tabDeleted$.subscribe((tabName) => {
                        if ( this.__tabname__$$ === tabName ) {
                            this.__blockSavingState__$$ = true;
                            MemStorage.getInstance().remove(getDataKey(this.__tabname__$$, this.__username__$$));
                        }
    
                    });
                    loadData(componentInstance);
                    if ( componentInstance.superNgOnInit ) {
                        componentInstance.superNgOnInit();    
                    } 
                        
                    if ( componentInstance.superNgAfterViewInit ) {
                        componentInstance.superNgAfterViewInit();
                    }
                    const SECONDS_10 = 10000;
                    this.__dumpingDataInterval__$$ = Observable.interval(SECONDS_10).subscribe((i) => {
                        saveData(componentInstance);
                    }); 
                } catch ( e ) {
                    log.error('unable to init component ', e);
                }
            

        };

        target.prototype.ngOnDestroy = function() {
            const log = ServiceLocator.injector.get(LoggerService);
            try { 
                if ( this.superNgOnDestroy ) { 
                    this.superNgOnDestroy();
                }
                
                    this.__saveStateSubscription__$$.unsubscribe();
                    this.__loadInvestigationSubscription__$$.unsubscribe();
                    this.__tabDeletedSubscription__$$.unsubscribe();
                    if ( this.__dumpingDataInterval__$$ ) { 
                        this.__dumpingDataInterval__$$.unsubscribe();
                    }
                    // We should recognize if tabs has been deleted
                    // if yes - then we should not save it state
                    if ( !this.__blockSavingState__$$ ) {
                        saveData(this);
                    } 
            } catch ( e ) {
                log.error('unable to destroy component. Reason ', e);
            }
        };
 };
}
