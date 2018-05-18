import { Component, Input, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { Plan } from '../../dto/plan';
import { Coords } from '../../common/coords';
import { LayoutService } from '../../service/layout.service';
import { WindowRef } from '../../service/window.service';

@Component({
  selector: '[planImage]',
  template: '<svg:image (click)="addMarker($event)" id="{{plan.id}}" attr.width="{{plan.width}}" attr.height="{{plan.height}}" attr.xlink:href="{{plan.base64Image}}" />',
})
export class PlanComponent implements OnInit {
  @Input()
  plan: Plan;
  @Output()
  planImageClicked = new EventEmitter();

  constructor(private _planNativeWrapper: ElementRef) {

  }

  addMarker(event: MouseEvent):void {
    var dim =  this._planNativeWrapper.nativeElement.getBoundingClientRect();
      this.planImageClicked.emit( new Coords( event.clientX - dim.left , event.clientY - dim.top) );

  }

  ngOnInit() {

  }

}
