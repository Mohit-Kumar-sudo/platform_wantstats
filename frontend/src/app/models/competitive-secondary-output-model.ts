import { ReportDataElement } from './secondary-research-models';

export interface SecondaryOutputModel {
    mainData: ReportDataElement[];
    reportName?: string;
    startYear?:string;
    endYear?:string;
    reportId?:string;
    heading?:string;
}