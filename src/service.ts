import api from './api';
import moment, {Moment} from 'moment';
import { IItem, IClausule } from './main';
import download from 'downloadjs'
import FileDownlaod from 'js-file-download'
import { message } from 'antd';

interface IReportData {
    valorIgual?: boolean;
    contractorName: string;
    contractorCpf: string;
    endHour: string;
    eventAddress: string;
    eventCityState: string;
    eventDate: Moment | null;
    eventLocation: string;
    eventNeighborhood: string
    observation: string;
    totalValue: number;
    beginHour: string;
    ceremonyHour: string;
    clauses: Array<IClausule>;
    itens: Array<IItem>;
    showItemValue?: boolean;
}

export async function generateReport(data: IReportData) {
    await api.post('/generate', data, {responseType: 'blob'}).then(response => {
        console.log(response.data)
        console.log(response.headers)
        FileDownlaod(response.data, 'report.pdf');
        message.success('Downloading');
     })
     .catch(async error => {
        const data = JSON.parse(await error.response.data.text());
        for (let i = 0; i < data.length; i++) {
            message.error(data[i]);
        }
    });
}