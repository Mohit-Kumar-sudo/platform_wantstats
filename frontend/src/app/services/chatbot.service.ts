import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIEndPoints } from "src/app/constants/mfr.constants";

@Injectable({
  providedIn: "root",
})
export class ChatbotService {
  constructor(private httpClient: HttpClient) {}

  getChatbotData(data): Observable<any> {
    return this.httpClient.post<any>(APIEndPoints.chat_bot+ "/chatData", data);
  }
}
