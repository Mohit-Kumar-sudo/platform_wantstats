import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SegmentService } from 'src/app/services/segment.service';

declare const WebViewer: any;
@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit, AfterViewInit {
  src: any;
  @ViewChild('viewer') viewer: ElementRef;

  wvInstance: any;
  srcReportName: any;
  constructor(private segmentService: SegmentService,
    private spinner: NgxSpinnerService,
    private routes: ActivatedRoute) { }

  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }

  wvDocumentLoadedHandler(): void {
    const instance = this.wvInstance;
    const { Core } = instance;

    Core.documentViewer.addEventListener('documentLoaded', () => {
      // console.log('document loaded');
    });

    Core.documentViewer.addEventListener('pageNumberUpdated', (pageNumber) => {
      // console.log(`Page number is: ${pageNumber}`);
    });
  }
  Annotations:any;

  ngAfterViewInit(): void {
    const reportId = this.routes.snapshot.params['reportId'];
    // console.log("reportId",reportId);

    this.segmentService.getReportInfoByKey(reportId, 'pdfLink').subscribe(data => {
      console.log("pdfData",data);
      if (data && data.pdfLink) {
        this.src = data.pdfLink;
      }
      WebViewer({
        licenseKey: 'R4Jyl7GgDzzmksFL956z',
        path: '../../wv-resources/lib',
        initialDoc: `${this.src}`
      }, this.viewer.nativeElement).then(instance => {
        this.wvInstance = instance;
         instance.disableFeatures([instance.Feature.TextSelection])

        const { Core, UI } = instance;

        // adds a button to the header that on click sets the page to the next page
        UI.setHeaderItems(header => {
          header.push({
            type: 'actionButton',
            img: 'https://icons.getbootstrap.com/assets/icons/caret-right-fill.svg',
            onClick: () => {
              const currentPage = Core.documentViewer.getCurrentPage();
              const totalPages = Core.documentViewer.getPageCount();
              const atLastPage = currentPage === totalPages;
              if (atLastPage) {
                Core.documentViewer.setCurrentPage(1);
              } else {
                Core.documentViewer.setCurrentPage(currentPage + 1);
              }
            }
          });
        });
      })
    })
  }
}
