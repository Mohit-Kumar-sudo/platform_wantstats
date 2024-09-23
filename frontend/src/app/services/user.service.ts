import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {APIEndPoints} from 'src/app/constants/mfr.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  public saveUserPPT(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<any>(APIEndPoints.USER_PPT_API + '/store_ppt', data, {headers});
  }


  getUserDashboards(id = null): Observable<any> {
    const queryString =  id ? ('?dashboardId=' + id) : '';
    return this.http.get<any>(APIEndPoints.USER_PPT_API + '/get_user_dashboards' + queryString);
  }

  deleteUserDashboards(id = null): Observable<any> {
    return this.http.delete<any>(APIEndPoints.USER_PPT_API + '/delete_user_dashboards/' + id);
  }

  public saveUserDashboard(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<any>(APIEndPoints.USER_PPT_API + '/add_dashboard', data, {headers});
  }

  public addSlideToPPT(pptId, data): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<any>(APIEndPoints.USER_PPT_API  + '/add_slide/' + pptId, data, {headers});
  }


  getUserPPTs(): Observable<any> {
    return this.http.get<any>(APIEndPoints.USER_PPT_API + '/get_user_ppts');
  }

  filterToApiPPTData(data, reportId, title) {
    let pptData;
    let tempData;
    let finalPptData;
    if (data.type == 'PIE') {
      tempData = [
        {name: data.data.metaDataValue.title, labels: data.data.chartLabels, values: data.data.chartData}
      ];
    } else if (data.type == 'BAR') {
      tempData = [];
      data.data.chartData.forEach(item => {
        tempData.push({
          name: item.label,
          labels: data.data.chartLabels,
          values: item.data
        });
      });
    }
    pptData = {
      type: data.type,
      data: tempData,
      slideTitle: data.data.metaDataValue.title
    };
    finalPptData = {
      reportId,
      title,
      slides: [pptData]
    };
    return finalPptData;
  }

  filterToApiSlideData(data, reportId, title) {
    let pptData;
    let tempData;
    if (data.type == 'PIE') {
      tempData = [
        {name: data.data.metaDataValue.title, labels: data.data.chartLabels, values: data.data.chartData}
      ];
    } else if (data.type == 'BAR') {
      tempData = [];
      data.data.chartData.forEach(item => {
        tempData.push({
          name: item.label,
          labels: data.data.chartLabels,
          values: item.data
        });
      });
    }
    pptData = {
      type: data.type,
      data: tempData,
      slideTitle: data.data.metaDataValue.title
    };
    return pptData;
  }

  public createSelfServiceReport(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<any>(`${APIEndPoints.USER_PPT_API}/self_service`, data, { headers });
  }

  getUserSelfServiceReport(): Observable<any> {
    return this.http.get<any>(APIEndPoints.USER_PPT_API + '/get_user_self_reports');
  }

  getSelfServiceReportById(id){
    return this.http.get<any>(`${APIEndPoints.USER_PPT_API}/get_user_self_reports/${id}`);
  }

  updateSelfServiceData(id,data){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<any>(`${APIEndPoints.USER_PPT_API}/update_user_self_reports/${id}`, data, { headers });
  }

  saveNewsUserHistory(news){
    return this.http.get<any>(`${APIEndPoints.USER_PPT_API}/news_user_details?title=${encodeURIComponent(news.title)}&link=${encodeURIComponent(news.link)}`)
  }

  saveYoutubeUserHistory(title,url){
    return this.http.get<any>(`${APIEndPoints.USER_PPT_API}/youtube_video_details?title=${encodeURIComponent(title)}&link=${encodeURIComponent(url)}`)
  }

  deleteSelfServiceReport(ssrId){
    return this.http.get<any>(APIEndPoints.USER_PPT_API + '/delete_self_service_report/' + ssrId);
  }
}
