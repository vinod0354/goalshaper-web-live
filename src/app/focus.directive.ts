import { Directive, ElementRef, AfterContentInit, NgZone, Renderer } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements AfterContentInit {

  constructor(private host: ElementRef,private el:ElementRef,private zone:NgZone,private renderer:Renderer) {}

  ngAfterContentInit(){
    this.zone.runOutsideAngular(() =>setTimeout(() =>{
        this.renderer.selectRootElement(this.el.nativeElement).focus();
    },0));
  }

}
