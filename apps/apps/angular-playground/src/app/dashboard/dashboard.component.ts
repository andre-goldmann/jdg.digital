import { Component, computed, effect, inject, Renderer2, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomSidenavComponent } from './sidenav/custom-sidenav.component';

@Component({
  selector: 'app-dashboard',
  //templateUrl: './dashboard.component.html',
  standalone: true,
  template: `
    <mat-toolbar class="mat-elevation-z3">
      <button mat-icon-button (click)="collapsed.set(!collapsed())">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>
    <mat-sidenav-container>
      <mat-sidenav opened mode="side" [style.width]="sidenavWidth()">
        <app-custom-sidenav [collapsed]="collapsed()"></app-custom-sidenav>
      </mat-sidenav>
      <mat-sidenav-content class="content" [style.margin-left]="sidenavWidth()">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterOutlet,
    FormsModule,
    RouterModule,
    MatSlideToggleModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    CustomSidenavComponent,
  ],
})
export class DashboardComponent {
  collapsed = signal<boolean>(false);
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  private breakpointObserver = inject(BreakpointObserver);
  private renderer = inject(Renderer2);
  darkMode = signal(false);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  applyDarkMode = effect(() => {
    const darkMode = this.darkMode();
    const body = this.renderer.selectRootElement('body', true);
    if (darkMode) {
      this.renderer.addClass(body, 'darkMode');
    } else {
      this.renderer.removeClass(body, 'darkMode');
    }
  });
}
