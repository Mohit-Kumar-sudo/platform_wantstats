import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-select-check-all',
  templateUrl: './select-check-all.component.html',
  styleUrls: ['./select-check-all.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectCheckAllComponent {
  @Input() model = [];
  @Input() values = [];
  @Input() text = 'Select All';
  @Output() valueChange = new EventEmitter<any>();


  isChecked(): boolean {
    return this.model && this.values.length
      && this.model.length === this.values.length;
  }

  isIndeterminate(): boolean {
    return this.model && this.values.length && this.model.length
      && this.model.length < this.values.length;
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.model = this.values;
    } else {
      this.model = [];
    }
    this.valueChange.emit(this.model);
  }
}
