<template>
    <a-button type="primary" title="设置" @click="visible= true">
        <template #icon>
            <icon-settings/>
        </template>
    </a-button>
    <a-drawer v-model:visible="visible" title="基础搜索设置" class="base-search-setting" :width="600" ok-text="保存"
              @ok="save">
        <a-form :model="setting" layout="vertical">
            <a-form-item label="默认视图">
                <a-select v-model="setting.defaultView" style="margin-left: 8px;width: 140px;">
                    <a-option label="基础视图" :value="ViewTypeEnum.BASE"/>
                    <a-option :label="$t('common.keyword.jsonView')" :value="ViewTypeEnum.JSON"/>
                    <a-option :label="$t('common.keyword.tableView')" :value="ViewTypeEnum.TABLE"/>
                    <a-option label="JSON树视图" :value="ViewTypeEnum.JSON_TREE"/>
                </a-select>
            </a-form-item>
            <a-form-item label="默认查询参数">
                <codemirror v-model.trim="setting.defaultParams" placeholder="请在这里输入默认查询参数"
                            :style="{ height: '200px',width: '568px' }" :autofocus="true"
                            :indent-with-tab="true" :tabSize="4" :extensions="extensions"/>
                <template #help>
                    此处需要一个JSON字符串，可以覆盖下面的参数
                </template>
            </a-form-item>
            <a-form-item label="快捷设置">
                <table class="arco-table">
                    <colgroup>
                        <col width="200px">
                        <col width="150px">
                        <col>
                    </colgroup>
                    <thead>
                    <tr class="arco-table-tr">
                        <th class="arco-table-th">参数</th>
                        <th class="arco-table-th">是否启用</th>
                        <th class="arco-table-th">值</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="arco-table-tr">
                        <td class="arco-table-td">track_total_hits</td>
                        <td class="arco-table-td">
                            <a-switch type="line" v-model="setting.enableTrackTotalHits"></a-switch>
                        </td>
                        <td class="arco-table-td">
                            <a-switch v-model="setting.trackTotalHits"/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {Codemirror} from 'vue-codemirror';
import {json} from '@codemirror/lang-json';
import {mapState} from "pinia";
import {getDefaultBaseSearchSetting, useBaseSearchSettingStore} from "@/store/setting/BaseSearchSettingStore";
import MessageUtil from "@/utils/MessageUtil";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

export default defineComponent({
    name: 'base-search-setting',
    components: {Codemirror},
    data: () => ({
        ViewTypeEnum,
        visible: false,
        extensions: [json()] as Array<any>,
        setting: getDefaultBaseSearchSetting()
    }),
    computed: {
        ...mapState(useBaseSearchSettingStore, ['baseSearchSetting'])
    },
    created() {
        this.setting = Object.assign(this.setting, this.baseSearchSetting);
    },
    methods: {
        save() {
            useBaseSearchSettingStore().save(this.setting)
                    .then(() => MessageUtil.success("保存成功"))
                    .catch(e => MessageUtil.error("保存失败", e));
        }
    }
});
</script>
<style scoped>
.arco-table {
    border: 1px solid var(--color-neutral-3);
}

.arco-table-th {
    background-color: var(--color-neutral-2);
    text-align: center
}

.arco-table-td {
    padding: 5px
}
</style>
