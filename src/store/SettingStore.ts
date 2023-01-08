import {defineStore} from "pinia";
import {getDefaultLanguage} from '@/utils/GlobalUtil';
import {useLocalStorage} from "@vueuse/core";
import Setting from "@/domain/Setting";
import ArrayUtil from "@/utils/ArrayUtil";
import Optional from "@/utils/Optional";

const useSettingStore = defineStore('setting', {
    state: () => {
        let setting = useLocalStorage<Setting>('setting', {
            defaultViewer: 2,
            defaultReplica: 1,
            defaultShard: 5,
            seniorWidth: 520,
            pageSize: 20,
            pageStep: 10,
            timeout: 5000,
            autoFullScreen: false,
            homeSearchState: 0,
            homeExcludeIndices: new Array<string>()
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
        getDefaultViewer: (state) => ArrayUtil.contains([1, 2, 3], state.instance.defaultViewer) ? state.instance.defaultViewer : 1,
        getPageSize: (state) => state.instance.pageSize,
        getPageStep: (state) => state.instance.pageStep,
        getTimeout: (state): number => Optional.ofNullable(state.instance.timeout).orElse(5000),
        getAutoFullScreen: (state): boolean => state.instance.autoFullScreen,
        getHomeSearchState: (state): number => ArrayUtil.contains([0, 1, 2], state.instance.homeSearchState) ? state.instance.homeSearchState : 0,
        getHomeExcludeIndices: (state): Array<string> => Optional.ofNullable(state.instance.homeExcludeIndices).orElse(new Array<string>())
    },
    actions: {
        setLanguage(language: string): void {
            this.language = language;
            localStorage.setItem('language', language);
        },
        addHomeExcludeIndex(index: string): void {
            if (!this.instance.homeExcludeIndices) {
                this.instance.homeExcludeIndices = new Array<string>();
            }
            this.instance.homeExcludeIndices.push(index);
        },
        removeHomeExcludeIndex(index: string): void {
            if (!this.instance.homeExcludeIndices) {
                this.instance.homeExcludeIndices = new Array<string>();
                return;
            }
            this.instance.homeExcludeIndices.splice(this.instance.homeExcludeIndices.indexOf(index), 1);
        }
    }
});

export default useSettingStore;