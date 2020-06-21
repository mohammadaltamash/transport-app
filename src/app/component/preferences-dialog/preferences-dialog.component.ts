import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, NgForm, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { Preferences } from 'src/app/model/preferences';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { Utilities } from 'src/app/helper/utilities';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-preferences-dialog',
  templateUrl: './preferences-dialog.component.html',
  styleUrls: ['./preferences-dialog.component.scss']
})
export class PreferencesDialogComponent implements OnInit {
  // @ViewChild('termsAndConditions')
  // private rteElement: RichTextEditorComponent;
  // public editorValue;

  public tools: object = {
    items: [
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      '|',
      'FontName',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      '|',
      'LowerCase',
      'UpperCase',
      '|',
      'Undo',
      'Redo',
      '|',
      'Formats',
      'Alignments',
      '|',
      'OrderedList',
      'UnorderedList',
      '|',
      'Indent',
      'Outdent',
      '|',
      'CreateLink',
      'CreateTable',
      'Image',
      '|',
      'ClearFormat',
      'Print',
      'SourceCode',
      '|',
      'FullScreen'
    ]
  };

  preferencesForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PreferencesDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utilities: Utilities,
    public authenticationService: AuthenticationService
  ) {
    // this.editorValue = 'This is assigned value';
  }

  ngOnInit(): void {
    this.preferencesForm = this.formBuilder.group({
      id: null,
      termsAndConditions: ''
    });
    this.apiService.getPreferences().subscribe((preferences: Preferences) => {
      if (preferences !== null) {
        // this.preferencesForm = this.formBuilder.group({
        //   id: preferences.id,
        //   termsAndConditions: preferences.termsAndConditions
        // });
        // this.editorValue = preferences.termsAndConditions;
        this.preferencesForm.patchValue({
          id: preferences.id,
          termsAndConditions: preferences.termsAndConditions
        });
        // this.preferencesForm = new FormGroup({
        //     id: new FormControl(preferences.id),
        //     termsAndConditions: new FormControl(preferences.termsAndConditions)
        //   });
      }
      // else {
      //   this.preferencesForm = this.formBuilder.group({
      //     id: null,
      //     termsAndConditions: ''
      //   });
      // }
    });
  }

  onSubmit() {
    const preferences: Preferences = this.preferencesForm.value;
    // this.dialogRef.close({ updated: true });
    this.apiService
      .updatePreferences(preferences)
      .subscribe((data: Preferences) => {
        console.log(data);
        this.utilities.showSuccess('Preferences saved', 'Preferences');
        this.dialogRef.close({ updated: true });
      });
  }

  onResetClick() {
    this.apiService.getPreferences().subscribe((preferences: Preferences) => {
      if (preferences !== null) {
        this.preferencesForm.patchValue({
          id: preferences.id,
          termsAndConditions: preferences.termsAndConditions
        });
      }
    });
  }

  onCloseClick() {
    this.dialogRef.close({ updated: false });
  }

  // rteCreated() {
  //   this.rteElement.element.focus();
  // }
}
