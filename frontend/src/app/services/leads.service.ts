import { Injectable } from '@angular/core';
import { APIEndPoints } from '../constants/mfr.constants';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  
  getAll() {
    return fetch(APIEndPoints.COMPANY_LEADS, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    });
  }

  getAllLead(page: number, limit: number) {
    const queryParams = `page=${page}&limit=${limit}`;
    return fetch(`${APIEndPoints.COMPANY_LEADS}?${queryParams}`, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    });
  }

  getLeadSearchByName(data, page = 1, limit = 10) {
    const requestData = { ...data, page, limit };

    return fetch(APIEndPoints.Lead_SearchLists, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(requestData),
    });
  }

  getAllLeadList() {
    return fetch(APIEndPoints.Lead_Lists, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    });
  }

  getLeadshowByContact(contact_first_name, contact_last_name) {
    return fetch(
      APIEndPoints.Lead_ShowLists + contact_first_name + contact_last_name,
      {
        method: 'get',
        headers: { 'content-type': 'application/json' },
      }
    );
  }

  getLeadsearchByCompany(data) {
    return fetch(APIEndPoints.searchByCompany, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  getCompanyByName(data) {
    return fetch(APIEndPoints.Lead_SearchContactList, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    });
  }

  getLeadByCompany(company) {
    return fetch(
      APIEndPoints.COMPANY_LEADS +
        'search_company_by_name' +
        '?company=' +
        company,
      {
        method: 'post',
        headers: { 'content-type': 'application/json' },
      }
    );
  }
  getLeadByIndustry(industry) {
    return fetch(APIEndPoints.COMPANY_LEADS + industry, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    });
  }

  //New methods for leads
  async searchCompanyName(searchText) {
    return await (<any>fetch(
      `${APIEndPoints.COMPANY_LEADS}search/${searchText}`,
      {
        method: 'get',
        headers: { 'content-type': 'application/json' },
      }
    ).then((response) => response.json()));
  }

  async getCompanyAndCount(company) {
    return await (<any>fetch(
      `${APIEndPoints.TEMP_LEADS_BASE_URL}leads_count/${encodeURIComponent(
        company
      )}`,
      {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      }
    ).then((response) => response.json()));
  }

  async getLeadsData(company) {
    return await (<any>fetch(
      `${APIEndPoints.TEMP_LEADS_BASE_URL}leads/${encodeURIComponent(company)}`,
      {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      }
    ).then((response) => response.json()));
  }

  async getTopLeads(vertical) {
    return await (<any>fetch(
      `${APIEndPoints.TEMP_LEADS_BASE_URL}top_leads/${encodeURIComponent(
        vertical
      )}`,
      {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      }
    ).then((response) => response.json()));
  }

  async getTopLeadsCp(company, vertical) {
    return await (<any>fetch(
      `${APIEndPoints.TEMP_LEADS_BASE_URL}top_leads/cp/${vertical}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ company }),
      }
    ).then((response) => response.json()));
  }
}
