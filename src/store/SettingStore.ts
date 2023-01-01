import {defineStore} from "pinia";
import {getDefaultLanguage} from '@/utils/GlobalUtil';
import {useLocalStorage} from "@vueuse/core";
import Setting from "@/entity/Setting";

const useSettingStore = defineStore('setting', {
    state: () => {
        let setting = useLocalStorage('setting', {
            defaultViewer: 2,
            defaultReplica: 1,
            defaultShard: 5,
            seniorWidth: 520,
            pageSize: 20,
            pageStep: 10,
            homeSearchState: 0
        } as Setting);
        return {
            language: getDefaultLanguage(),
            instance: setting
        }
    },
    getters: {
        getLanguage: (state) => state.language,
        getDefaultShard: (state) => state.instance.defaultShard,
        getDefaultReplica: (state) => state.instance.defaultReplica,
        getSeniorWidth: (state) => state.instance.seniorWidth,
        getDefaultViewer: (state) => state.instance.defaultViewer in [1, 2, 3] ? state.instance.defaultViewer : 1,
        getPageSize: (state) => state.instance.pageSize,
        getPageStep: (state) => state.instance.pageStep,
        getTimeout: (state): number => state.instance.timeout,
        getHomeSearchState: (state): number => state.instance.homeSearchState,
    },
    actions: {
        setLanguage(language: string): void {
            this.language = language;
            localStorage.setItem('language', language);
        },
        setDefaultShard(defaultShard: number): void {
            this.instance.defaultShard = defaultShard;
        },
        setDefaultReplica(defaultReplica: number): void {
            this.instance.defaultReplica = defaultReplica;
        },
        setSeniorWidth(seniorWidth: number) {
            this.instance.seniorWidth = seniorWidth;
        },
        setDefaultViewer(defaultViewer: number) {
            this.instance.defaultViewer = defaultViewer;
        },
        setPageSize(pageSize: number) {
            this.instance.pageSize = pageSize;
        },
        setPageStep(pageStep: number) {
            this.instance.pageStep = pageStep;
        },
        setTimeOut(timeout: number) {
            this.instance.timeout = timeout;
        },
        setHomeSearchState(homeSearchState: number) {
            this.instance.homeSearchState = homeSearchState;
        }
    }
});

export default useSettingStore;