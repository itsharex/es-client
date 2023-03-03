import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import axios from "axios";


export default function fetch<T>(config: HttpStrategyConfig): Promise<T> {
    config.url = config.baseURL + config.url;
    config.url.replaceAll("//", "/")
    return new Promise<T>((resolve, reject) => {
        axios.request({
            url: '/api/fetch',
            method: 'POST',
            data: config
        }).then(response => {
            let data = response.data;
            if (data.success) {
                resolve(data.data);
            } else {
                reject(data.data);
            }
        }).catch(e => {
            reject(e);
        })
    })
}