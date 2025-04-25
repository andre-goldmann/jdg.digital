import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScreenService } from './screen.service';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-screen',
  imports: [
    FormsModule,
    MatStepperModule],
  templateUrl: './screen.component.html',
  styleUrl: './screen.component.css',
})
export class ScreenComponent implements AfterViewInit {

  opener = gsap.timeline({delay: 2.5});
  dur:number = 2;
  path:number = 0;
  stepIndex:number = 0;
  userNum:number = 159845;
  monthNum:number = 2.36;
  screenService: ScreenService = inject(ScreenService);

  @ViewChild("lines", {read: ElementRef}) private lines!: ElementRef;

  ngAfterViewInit() {

    //const element: SVGElement = this.lines.nativeElement;
    //const element = this.lines.nativeElement as SVGPathElement;

    const element = this.lines.nativeElement;// document.getElementById('lines');
    /*if (element instanceof SVGPathElement) {
      this.path = element.getTotalLength();
    }else {
      console.info("Element is not a SVGPathElement");
    }*/
    this.path=200;


    this.createOpener();

    this.screenService.stringSubject.subscribe(data => {
      this.stepIndex = data;

      if (this.stepIndex === 1) this.createStep2();
      if (this.stepIndex === 2) this.createStep3();
      if (this.stepIndex === 3) this.createStep4();
    });
  }

  createOpener() {
    gsap.set("#lines", {
      strokeDashoffset: `${this.path}px`,
      strokeDasharray: `${this.path}px`
    })

    this.opener.to(".label", {
      duration: this.dur,
      opacity: 1,
      stagger: 0.5,
      ease: "sine.out"
    }, 1)
    this.opener.to(".dot", {
      duration: this.dur,
      opacity: 0.5,
      stagger: 0.5,
      ease: "sine.out"
    }, 2)
    this.opener.to("#keybk", {
      duration: this.dur,
      opacity: 1,
      ease: "sine.out"
    }, 4)
    this.opener.to("#lastmonth", {
      duration: this.dur,
      opacity: 1,
      ease: "sine.out"
    }, 4.5)
    this.opener.to("#thismonth", {
      duration: this.dur,
      opacity: 1,
      ease: "sine.out"
    }, 5)
    this.opener.to("#lines", {
      duration: 1.5,
      strokeDashoffset: 0
    }, 4)
  }

  createStep2() {
    setTimeout(() => {
      this.userNum = 160000

      gsap.to("#num", {
        duration: 0.5,
        textShadow: "#FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 15px, #FF2D95 0px 0px 20px, #FF2D95 0px 0px 30px, #FF2D95 0px 0px 40px, #FF2D95 0px 0px 50px, #FF2D95 0px 0px 75px",
      })
      gsap.to("#num", {
        duration: 1,
        delay: 3.5,
        textShadow: "1px 1px 1px rgba(0, 0, 0, 0)",
      })

    }, 3000)

    setTimeout(() => {
      this.userNum = 160001
    }, 5000)
  }

  createStep3() {
    setTimeout(() => {
      this.monthNum = 2.45

      gsap.to("#month", {
        duration: 0.5,
        textShadow: "0 0 5px #FFF, 0 0 10px #FFF, 0 0 15px #FFF, 0 0 20px #49ff18, 0 0 30px #49FF18, 0 0 40px #49FF18, 0 0 55px #49FF18, 0 0 75px #49ff18",
      })
      gsap.to("#month", {
        duration: 1,
        delay: 3.5,
        textShadow: "1px 1px 1px rgba(0, 0, 0, 0)",
      })

    }, 3000)
  }

  createStep4() {
    gsap.set("#lines", {
      strokeDashoffset: `${this.path}px`,
      strokeDasharray: `${this.path}px`
    })

    gsap.to("#lines", {
      duration: 2,
      delay: 4,
      strokeDashoffset: 0
    })
  }

}
