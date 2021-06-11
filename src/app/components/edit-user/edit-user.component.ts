import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  editForm: FormGroup;

  constructor( 
    public dialog: MatDialogRef<EditUserComponent>,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,

    ) {
      this.editForm = this.fb.group({
        name: ['',[Validators.required]],
       job: ['', [Validators.required]],
      })

      this.editForm.patchValue({
        name: this.data.name,
      })




     }

  ngOnInit(): void {
  }

  onSubmit() {

    if (this.editForm.invalid) {
      return this.editForm.controls;
    }
    this.dialog.close({edited: true, data: this.editForm.value})
  }

  cancelEditForm() {
    this.dialog.close({edited: false, data: {}});
  }

}
