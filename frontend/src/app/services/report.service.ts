import { Injectable } from '@angular/core';
import { MasterReportData, MasterReportDataList, MasterReportDataElement, TocSectionData } from '../models/me-models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { APIEndPoints, ConstantKeys } from 'src/app/constants/mfr.constants';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import {
  MasterReportSecondarySection,
  MasterReportSecondarySectionWrapper,
  MasterReportSecondarySectionData
} from '../models/secondary-research-models';
import {LocalStorageService} from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private loadingIndicator = new BehaviorSubject<boolean>(false);
  loadingIndicator$ = this.loadingIndicator.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
  }

  updateReportOverlapsData(data: any, reportId) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<any>(`${APIEndPoints.REPORT_API}/${reportId}/update_report_overlap`, data, { headers })
      .pipe(
        map(ele => {
          return ele.data;
        }),
        catchError(this.handleError)
      );
  }


  getReportMenuItems(reportId): Observable<any> {
    return this.http.get<any>(APIEndPoints.REPORT_LEFT_MENU_API + reportId);
  }

  getAllGroupedReports(page: number = 1, limit: number = 10): Observable<any> {
    const url = `${APIEndPoints.REPORT_API}/get_grouped_reports?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
}


  setReportPdf(id, link): Observable<any> {
    return this.http.get<any>(APIEndPoints.REPORT_API + '/set_pdf_report/' + id + '?link=' +  link);
  }

  addReportPdf(title, link): Observable<any> {
    return this.http.get<any>(APIEndPoints.REPORT_API + '/add_pdf_report/'+ '?title=' + title + '&link=' +  link);
  }


  getReportChartDataById(id): Observable<any> {
    return this.http.get<any>(APIEndPoints.REPORT_API + '/suggested_charts/' + id);
  }

  setReportData(reportId) {
    this.getReportByIdAndSet(reportId).subscribe(data => {
      this.localStorageService.set(ConstantKeys.CURRENT_REPORT, data.data[0]);
      return data.data[0];
    });
  }

  getReportByIdAndSet(reportId): Observable<any> {
    return this.http.get<any>(APIEndPoints.REPORT_API + '/' + reportId);
  }


  public getById(id: string): Observable<MasterReportData> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http
      .get<MasterReportDataElement>(`${APIEndPoints.REPORT_API}/${id}?select=cp`, { headers })
      .pipe(
        map(ele => ele.data[0]),
        catchError(this.handleError)
      );
  }

  public getAll(): Observable<MasterReportData[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .get<MasterReportDataList>(APIEndPoints.REPORT_API + '?select=title,isAnalytics,isWord,isExcel,isPdf,isDoc,pdfLink,excelLink,pdfOpen,wordOpen', { headers })
      .pipe(
        map(ele => ele.data),
        catchError(this.handleError)
      );
  }

  getReportsByTitle(reportName): Observable<any> {
    return this.http.get<any>(APIEndPoints.REPORT_API + '/report_by_title/' + reportName);
  }

  getSearchReportsByName(reportText): Observable<any> {
    this.loadingIndicator.next(true); // Set loading indicator to true

    return this.http.get<any>(APIEndPoints.REPORT_API + '?select=title,isAnalytics,isExcel,isPdf,isDoc,pdfLink,excelLink,docLink&title=' + reportText)
      .pipe(
        finalize(() => this.loadingIndicator.next(false)) // Set loading indicator to false after response
      );
  }

  getMainReportsByName(reportText): Observable<any> {
    return this.http.get<any>(APIEndPoints.REPORT_API +"/search_report_by_name" + '?select=title,isAnalytics&title=' + reportText);
  }

  getReportCompanyDetailsByKeys(reportId, companyId, key): Observable<any> {
    return this.http.get<any>(APIEndPoints.REPORT_API + '/' + reportId + '/report_company_details?cid=' + companyId + '&key=' + key);
  }

  getTocContentByKey(reportId, metaKey): Observable<any> {
    return this.http.get<any>(APIEndPoints.ES_API + '/' + reportId + '/toc_by_key?meta_key=' + metaKey);
  }

  getTocContentByName(reportId, metaValue): Observable<any> {
    return this.http.get<any>(APIEndPoints.ES_API + '/' + reportId + '/toc_by_name?meta_value=' + metaValue);
  }

  getTocContentBySectionName(reportId, name): Observable<any> {
    return this.http.get<any>(APIEndPoints.ES_API + '/' + reportId + '/toc_by_section_name?section_name=' + name);
  }

  getAllTocContentByReportId(reportId): Observable<any[]> {
    return this.http.get<any>(APIEndPoints.ES_API + '/' + reportId + '/toc/all');
  }

  getReportDataBySelectMe(reportId, selectKey): Observable<any> {
    return this.http.get<any>(APIEndPoints.REPORT_API + '/' + reportId + '?select=me.' + selectKey);
  }

  getReportCompanyProfiles(report): Observable<any> {
    return this.http.get<any>(APIEndPoints.REPORT_API + '/' + report._id + '?select=cp');
  }

  getExecutiveSummaryDetail(reportId, sectionId, mainSectionId): Observable<any[]> {
    const url = APIEndPoints.ES_API + '/' + reportId + '/toc?msid=' + mainSectionId + '&sid=' + sectionId;
    return this.http.get<any>(url);
  }

  getReportDetails(reportId): Observable<any[]> {
    return this.http.get<any>(APIEndPoints.REPORT_API + '/' + reportId + '?select=me.segment');
  }

  public createBasicReport(data: MasterReportData): Observable<MasterReportData> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<MasterReportDataElement>(APIEndPoints.REPORT_API, data, { headers })
      .pipe(
        map(ele => {
          return ele.data;
        }),
        catchError(this.handleError)
      );
  }

  getFullReviewDetails(reportId): Observable<any[]> {
    return this.http.get<any>(`${APIEndPoints.ES_API}/${reportId}/toc`);
  }

  public saveTocInfoByReportSection(report: MasterReportData, tocModuleData: MasterReportSecondarySection): Observable<Boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let currentSection = window.localStorage.getItem(ConstantKeys.CURRENT_SECTION) || "{}";
    currentSection = JSON.parse(currentSection) || {};

    return this.http
      .post(`${APIEndPoints.ES_API}/${report._id}/toc?msid=${currentSection['main_section_id']}&sid=${currentSection['section_id']}&spid=${currentSection['section_pid']}&sectionKey=${currentSection['section_key']}`, [tocModuleData], { headers: headers })
      .pipe(
        map(response => response ? true : false),
        catchError(this.handleError)
      );
  }

  public saveTocInfoByReportSectionArr(report: MasterReportData, tocModuleData: MasterReportSecondarySection[]): Observable<Boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let currentSection = window.localStorage.getItem(ConstantKeys.CURRENT_SECTION) || "{}";
    currentSection = JSON.parse(currentSection) || {};

    return this.http
      .post(`${APIEndPoints.ES_API}/${report._id}/toc?msid=${currentSection['main_section_id']}&sid=${currentSection['section_id']}&spid=${currentSection['section_pid']}&sectionKey=${currentSection['section_key']}`, tocModuleData, { headers: headers })
      .pipe(
        map(response => response ? true : false),
        catchError(this.handleError)
      );
  }

  public saveAndReplaceTocInfoByReportSectionArr(report: MasterReportData, tocModuleData: MasterReportSecondarySection[]): Observable<Boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let currentSection = window.localStorage.getItem(ConstantKeys.CURRENT_SECTION) || "{}";
    currentSection = JSON.parse(currentSection) || {};

    return this.http
      .post(`${APIEndPoints.ES_API}/${report._id}/toc/replace?msid=${currentSection['main_section_id']}&sid=${currentSection['section_id']}&spid=${currentSection['section_pid']}&sectionKey=${currentSection['section_key']}`, tocModuleData, { headers: headers })
      .pipe(
        map(response => response ? true : false),
        catchError(this.handleError)
      );
  }

  public getTocDetails(reportId, sectionId, mainSectionId): Observable<MasterReportSecondarySectionData> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .get<MasterReportSecondarySectionWrapper>(`${APIEndPoints.ES_API}/${reportId}/toc?msid=${mainSectionId}&sid=${sectionId}`, { headers })
      .pipe(
        map(ele => {
          if (ele.data[0] && ele.data[0].toc) {
            return ele.data[0].toc as MasterReportSecondarySectionData;
          } else {
            throw new Error('toc is null or undefined');
          }
        }),
        catchError(this.handleError)
      );
  }




  public getContentParentDetails(reportId, mainSectionId, parentSectionId): Observable<MasterReportSecondarySectionData[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let apiStr = `${APIEndPoints.ES_API}/${reportId}/content/parent?msid=${mainSectionId}`;
    if (parentSectionId) {
      apiStr = `${apiStr}&spid=${parentSectionId}`;
    }

    // @ts-ignore
    return this.http
      .get<MasterReportSecondarySectionWrapper>(apiStr, { headers })
      .pipe(
        map(ele => ele.data[0] ? ele.data[0].toc : []),
        catchError(this.handleError)
      );

  }

  addReportCompanyDetails(reportId: string, company: any, cId, key) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<MasterReportDataElement>(`${APIEndPoints.REPORT_API}/${reportId}/company/` + key + `?cid=` + cId, company, { headers })
      .pipe(
        map(ele => {
          return ele.data;
        }),
        catchError(this.handleError)
      );
  }

  addNewCompanyToReport(reportId: string, company: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<any>(`${APIEndPoints.REPORT_API}/${reportId}/new_company`, company, { headers })
      .pipe(
        map(ele => {
          return ele.data;
        }),
        catchError(this.handleError)
      );
  }

  deleteCompanyFromReport(reportId: string, company: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<any>(`${APIEndPoints.REPORT_API}/${reportId}/delete_company`, company, { headers })
      .pipe(
        map(ele => {
          return ele.data;
        }),
        catchError(this.handleError)
      );
  }

  getPremiumReports(data:any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http
    .get<any>(`${APIEndPoints.REPORT_API}/premium_report?id=${data}`,{ headers })
    .pipe(
      map(ele => {
        return ele.data;
      }),
      catchError(this.handleError)
    );
  }

  public getMSIDDetails(reportId, mainSectionId): Observable<MasterReportSecondarySectionData> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .get<MasterReportSecondarySectionWrapper>(`${APIEndPoints.ES_API}/${reportId}/toc?msid=${mainSectionId}`, { headers })
      .pipe(
        map(ele => {
          if (ele.data[0]) {
            return ele.data[0].toc as MasterReportSecondarySectionData;
          } else {
            throw new Error('toc is null or undefined');
          }
        }),
        catchError(this.handleError)
      );
  }


  public getSectionKeyDetials(reportId, sectionKey) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // @ts-ignore
    return this.http
      .get<MasterReportSecondarySectionWrapper>(`${APIEndPoints.ES_API}/${reportId}/content?sectKey=${sectionKey}`, { headers })
      .pipe(
        map(ele => ele.data[0] ? ele.data[0].toc : []),
        catchError(this.handleError)
      );
  }

  public getFilteredReports(domain) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // @ts-ignore
    return this.http
      // .get<any>(`${APIEndPoints.REPORT_API}/vertical/${domain}`, { headers })
      .get<any>(`http://localhost:6969/api/v1/report/vertical/${domain}`, { headers })
      .pipe(
        map(ele => ele.data[0] ? ele.data[0].toc : []),
        catchError(this.handleError)
      );

  }

  public getRportCpData(rid) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // @ts-ignore
    return this.http
      .get<any>(`${APIEndPoints.REPORT_API}/cp/rid/${rid}`, { headers })
      .pipe(
        map(ele => ele),
        catchError(this.handleError)
      );

  }

  public getReportclassificationDetails(reportId, sectionKey) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // @ts-ignore
    return this.http
      .get<MasterReportSecondarySectionWrapper>(`${APIEndPoints.ES_API}/${reportId}/content?sectKey=${sectionKey}`, { headers })
      .pipe(
        map(ele => ele),
        catchError(this.handleError)
      );
  }

  public getReportChartTitles(reportId) {
    return fetch(`${APIEndPoints.REPORT_API}/titles/${reportId}`, {
      method: "get",
      headers: { "content-type": "application/json" }
    }).then(response => response.json());
  }

  public listReportChartTitles(reportId) {
    return fetch(`${APIEndPoints.REPORT_API}/${reportId}?select=titles`, {
      method: "get",
      headers: { "content-type": "application/json", "authorization": "JWT " + localStorage.getItem("token") }
    }).then(response => response.json())
  }
  handleError(err: HttpErrorResponse) {
    return throwError(err);
  }
}
