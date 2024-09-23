import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-kv-multi-select',
  templateUrl: './kv-multi-select.component.html',
  styleUrls: ['./kv-multi-select.component.scss']
})
export class KvMultiSelectComponent implements OnInit {

  dataEle = new FormControl();
  
  @Input()
  header: string;

  @Input()
  dataList: string[];  

  @Input()
  inputValues: any;

  @Output()
  elementSelectionChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit() {
    this.dataEle.setValue(_.map(this.inputValues, 'name'));
  }

  selectionChanged(){
    this.elementSelectionChange.emit(this.dataEle.value);
  }
}
