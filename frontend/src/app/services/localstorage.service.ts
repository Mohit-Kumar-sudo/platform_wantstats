import {Injectable} from '@angular/core';
import {ConstantKeys} from 'src/app/constants/mfr.constants';
import {ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(private activatedRoute: ActivatedRoute) {
  }

  set(key: string, value: any): void {
    if (key === ConstantKeys.CURRENT_REPORT) {
      sessionStorage.setItem(ConstantKeys.CURRENT_REPORT, JSON.stringify(value));
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  get(key: string): any {
    const storedValue = key === ConstantKeys.CURRENT_REPORT
      ? sessionStorage.getItem(ConstantKeys.CURRENT_REPORT)
      : localStorage.getItem(key);
  
    if (storedValue !== null && storedValue !== undefined) {
      return JSON.parse(storedValue);
    }
    // Handle the case where the stored value is undefined or null
    return null; // You can return a default value or handle it according to your needs
  }
  

  removeAll() {
    localStorage.clear();
  }

}
