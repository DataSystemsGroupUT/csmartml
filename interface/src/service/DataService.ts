import axios from "axios";


export interface XDataSetSummary {

    name: string;
    n_features: number;
    n_instances: number;
    n_classes: number

}

export function getStaticCSVFile (dataset: string){
    const src = `/datasets/${dataset}.csv`;
    return fetch(src).then(response => {
        // @ts-ignore
        let reader = response.body.getReader();
        let decoder = new TextDecoder('utf-8');

        return reader.read().then(function (result) {
            return decoder.decode(result.value);
        });

    });
}

const axiosInstance = axios.create({
    baseURL: `http://0.0.0.0:5555/`,
    // timeout: 1000,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});


export async function testFunction (data){
    const url = `/taskrun`;
    const headers = {'Content-Type': 'application/json'};
    const res = await axiosInstance.post(url, data, {headers});
    if (res.status === 200) {
        return res;
    }
    throw res;
}

export async function disable (data){
    const url = `/disable`;
    const headers = {'Content-Type': 'application/json'};
    const res = await axiosInstance.post(url, data, {headers});
    if (res.status === 200) {
        return res;
    }
    throw res;
}