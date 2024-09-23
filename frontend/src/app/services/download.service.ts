import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }

  downloadImage(imageData, thisCanvas, element, screen) {
    // @ts-ignore
    html2canvas(screen).then(canvas => {
      thisCanvas.nativeElement.src = canvas.toDataURL();
      element.href = canvas.toDataURL('image/png');
      element.download = 'Download.png';
      element.click();
    });
  }
}