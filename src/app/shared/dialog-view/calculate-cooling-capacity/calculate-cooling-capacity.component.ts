import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Inject} from '@angular/core';

import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UtilsService} from '../../../services/utils.service';

import {FormBuilder, Validators} from '@angular/forms';
import { FloorEnum } from 'src/app/enum/floor.enum';
import { CalculateCoolingCapacity } from 'src/app/services/calculate-and-capacity.service';
import { Calculate } from 'src/app/interfaces/calculation';
import { Select } from 'src/app/interfaces/select';

@Component({
  selector: 'app-calculate-cooling-capacity',
  templateUrl: './calculate-cooling-capacity.component.html',
  styleUrls: ['./calculate-cooling-capacity.component.scss']
})
export class CalculateCoolingCapacityComponent implements OnInit {
  room=[]
  window :Select[]=[
    {
      value: "1" ,
      viewValue:"1 (রুমে একটি জানালা আছে)"
    },

     {
      value: "2" ,
      viewValue:"2 (রুমে দুটি জানালা আছে )"
    },
     {
      value: "3" ,
      viewValue:"3 (রুমে তিনটি জানালা আছে)"
    } ,
    {
      value: "4" ,
      viewValue:"4 (রুমে চারটি জানালা আছে)"
    }
    ];
  door:Select[]=[
    {
      value: "1" ,
      viewValue:"1 (রুমে একটি দরজা আছে)"
    } ,
    {
      value: "2" ,
      viewValue:"2 (রুমে দুটি দরজা আছে)"
    }
    ];
  people:Select[]=[
    {
      value: "1" ,
      viewValue:"1 (একজন)"
    },
    {
      value: "2" ,
      viewValue:"2 (দুইজন)"
    } ,
    {
      value: "3" ,
      viewValue:"3 (তিনজন)"
    } ,
    {
      value: "4" ,
      viewValue:"4 (চারজন)"
    }
  ];
  public dataForm: FormGroup;
  floorType = [
    {value: FloorEnum.TOPFLOOR, viewValue: 'Topfloor'},
    {value: FloorEnum.OTHERS, viewValue: 'Other'}
  ];

  constructor(
    private fb: FormBuilder,
    private calculateCoolingCapacity: CalculateCoolingCapacity,
    private uiService: UiService,
    private utilsService: UtilsService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<CalculateCoolingCapacityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {


    this.dataForm = this.fb.group({

      width: [null, Validators.required],
      length: [null, Validators.required],
      height: [null, Validators.required],
      window: [null],
      door: [null, Validators.required],
      people: [null, Validators.required],
      floorType: [2, Validators.required],



    });

    if (this.data) {
      this.setdataFormData();
    }

  }
  private setdataFormData(){
    this.dataForm.patchValue(this.data)
  }


   /**
   * ON SUBMIT dataForm
   */

    // onSubmit() {
    //   if (this.dataForm.invalid) {
    //     this.uiService.warn('Please complete all the required fields');
    //     return;
    //   }
    //   if (this.blog) {
    //     const finalData = {...this.dataForm.value, ...{_id: this.blog._id}};
    //     this.editBlogData(finalData);
    //   } else {
    //     this.addBlog(this.dataForm.value);
    //   }
    // }

    onSubmitCalculation() {

      if (this.dataForm.invalid) {
        this.uiService.warn('Please complete all the required field');
        return;
      }


      const finalData = {...this.dataForm.value, ...{_id: this.data._id}};
      if (this.data) {

        this.editCalculation();
      } else {
        this.addCalculation(finalData);
      }

    }

    addCalculation(data: Calculate) {
      
      this.calculateCoolingCapacity.addCalculation(data)

        .subscribe((res) => {
          this.uiService.success(res.message);
          this.reloadService.needRefreshAddress$();
          this.dialogRef.close();
          // this.matDialog.closeAll();
        }, error => {
          console.log(error);
        });
    }

    editCalculation() {
      const finalData = {...this.dataForm.value, ...{_id: this.data._id}};
      this.calculateCoolingCapacity.editCalculation(finalData)
        .subscribe((res) => {
          this.uiService.success(res.message);
          this.reloadService.needRefreshAddress$();
          this.dialogRef.close();
          // this.matDialog.closeAll();
        }, error => {
          console.log(error);
        });
    }
}
