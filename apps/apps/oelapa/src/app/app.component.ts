import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvoicesStore } from './invoices.store';
//import { FormGroup } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

/*import {
  form,
  required,
  minLength,
  validate,
  submit,
  Control,
} from '@angular/forms/signals';*/


@Component({
  imports: [RouterModule, ReactiveFormsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  protected title = 'oelapa';
  store = inject(InvoicesStore);
  // Create the form group
  private readonly fb = inject(FormBuilder);
  public userForm!: FormGroup;
  //searchForm = form()

  ngOnInit(): void {
    // 1. Initialize the form structure
    this.userForm = this.fb.group({
      from: [this.store.from, Validators.required],
      to: [this.store.to, Validators.required],
      //email: [this.store.email(), [Validators.required, Validators.email]],
    });

    // 2. Load initial data from the store into the form (if needed)
    this.userForm.patchValue(this.store);

    // 3. (Optional but recommended) Subscribe to status changes for UI feedback
    // The status is a signal, so you'd typically use effects or the template to react.
    // For simplicity, here's how you might react to status changes:
    /*this.store.status.subscribe(status => {
      if (status === 'saving') {
        this.userForm.disable();
      } else {
        this.userForm.enable();
      }
    });*/
  }

  onSubmit(): void {
  }
}
