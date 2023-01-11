import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import SyncSetting from "@/entity/SyncSetting";
import SyncModeEnum from "@/enumeration/SyncModeEnum";

const useSyncStore = defineStore('sync-setting', {
    state: () => {
        return {
            syncSetting: useLocalStorage<SyncSetting>('setting-sync', {
                mode: SyncModeEnum.DISABLE,
                server: {
                    url: '',
                    token: ''
                }
            } as SyncSetting)
        }
    },
    getters: {
        getSync: (state): SyncSetting => state.syncSetting,
    },
    actions: {
        setSync(syncSetting: SyncSetting): void {
            this.syncSetting = syncSetting;
        },
        setMode(mode: SyncModeEnum) {
            this.syncSetting.mode = mode;
        }
    }
});

export default useSyncStore;