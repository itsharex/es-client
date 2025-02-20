<template>
    <div class="setting-url">
        <div class="setting-url-toolbar">
            <a-input v-model="keyword" style="width: 40vw;" placeholder="链接名称" allow-clear/>
            <a-dropdown-button @click="editOpen()" type="primary">
                新增
                <template #content>
                    <a-doption @click="exportUrlToJson()">
                        <template #icon>
                            <icon-export />
                        </template>
                        数据导出
                    </a-doption>
                    <a-doption @click="importUrlByJson()">
                        <template #icon>
                            <icon-import />
                        </template>
                        数据导入
                    </a-doption>
                </template>
            </a-dropdown-button>
        </div>
        <a-table ref="urlTable" :data="urls" class="data" sticky-header style="height: 100%;" :draggable="draggable"
                 @change="urlChange($event)">
            <template #columns>
                <a-table-column data-index="name" :title="$t('common.keyword.name')" :width="120"
                                fixed="left"></a-table-column>
                <a-table-column data-index="value" :title="$t('common.keyword.url')" :width="260">
                    <template #cell="{ record }">
                        <a-link @click="open(record.value)" type="primary" target="_blank">{{ record.value }}</a-link>
                        <div class="url-copy" @click="execCopy(record.value)">{{ $t('common.operation.copy') }}</div>
                    </template>
                </a-table-column>
                <a-table-column data-index="version" title="版本" :width="100"/>
                <a-table-column :title="$t('setting.link.form.isAuth')" :width="100">
                    <template #cell="{ record }">
                        {{ prettyAuth(record.isAuth) }}
                    </template>
                </a-table-column>
                <a-table-column :title="$t('common.keyword.operation')" :width="160" fixed="right">
                    <template #cell="{ record }">
                        <a-button type="primary" size="small" @click="editOpen(record)">{{
                                $t('common.operation.edit')
                            }}
                        </a-button>
                        <a-popconfirm @ok="remove(record.id, record.value)" content="是否删除链接，删除后将无法恢复"
                                      ok-text="删除" position="br" :ok-button-props="{status: 'danger'}">
                            <a-button type="primary" status="danger" size="small"
                                      style="margin-left: 8px;">
                                删除
                            </a-button>
                        </a-popconfirm>
                    </template>
                </a-table-column>
            </template>
        </a-table>
        <save-or-update-url/>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref, toRaw} from "vue";

import useUrlStore from "@/store/UrlStore";
import useIndexStore from "@/store/IndexStore";
import {getDefaultUrl, Url} from "@/entity/Url";

import {useUrlEditEvent} from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";
import SaveOrUpdateUrl from "@/page/setting/components/save-or-update-url/index.vue";
import {useFuse} from "@vueuse/integrations/useFuse";
import {TableDraggable} from "@arco-design/web-vue";
import {useRoute} from "vue-router";
import {download} from "@/utils/BrowserUtil";
import Constant from "@/global/Constant";
import {useFileSystemAccess} from "@vueuse/core";

const route = useRoute();

const keyword = ref('');

const items = computed(() => useUrlStore().urls);

const {results} = useFuse(keyword, items, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name'
        }, {
            name: 'value'
        }]
    }
});
const urls = computed(() => results.value.map(e => e.item));

const draggable = computed<TableDraggable | undefined>(() => {
    if (keyword.value === '') {
        return {
            type: 'handle'
        }
    }
});

onMounted(() => {
    if (route.query.method && route.query.method === 'add') {
        useUrlEditEvent.emit();
    }
})

// -------------------------------------- 方法 --------------------------------------

function urlChange(items: Array<any>) {
    useUrlStore().save(items.map(item => toRaw(item)));
}


function prettyAuth(params: boolean) {
    return params ? "需要认证" : "无需认证";
}

function remove(id: number, value: string) {
    useUrlStore().remove(id)
        .then(() => removeAfter(value))
        .catch(e => MessageUtil.error('删除失败', e));
}

function removeAfter(value: string) {
    MessageUtil.success('删除成功');
    if (useUrlStore().current === value) {
        // 删除了当前索引
        useUrlStore().clear();
        useIndexStore().clear();
    }
}

function editOpen(url?: Url) {
    if (url) {
        useUrlEditEvent.emit(JSON.parse(JSON.stringify(toRaw(url))));
    } else {
        useUrlEditEvent.emit();
    }
}

const execCopy = (text: string) => {
    utools.copyText(text);
    MessageUtil.success("已成功复制到剪切板");
};
const open = (url: string) => utools.shellOpenExternal(url);

// 导入导出

function exportUrlToJson() {
    download(JSON.stringify({
        version: Constant.version,
        records: useUrlStore().urls
    }, null, 4), "链接导出.json", "application/json");
}

const importFile = useFileSystemAccess({
    dataType: 'Text',
    types: [{
        accept: {
            'application/json': ['.json']
        },
        description: "JSON文件"
    }]
});
function importUrlByJson() {
    const rsp =  importFile.open() as Promise<void>;
    rsp.then(() => {
        const value = importFile.data.value;
        if (!value) {
            MessageUtil.error("没有解析到数据，请确认上传文件是否正确")
        }
        handlerJson(value)
                .then(() => MessageUtil.success("导入成功"))
                .catch(e => MessageUtil.error("导入失败", e));
    })
}

async function handlerJson(json?: string) {
    if (!json) {
        return Promise.reject("没有解析到数据，请确认上传文件是否正确");
    }
    let value;
    try {
        value = JSON.parse(json) as any;
    }catch (e) {
        return Promise.reject("JSON文件解析失败");
    }
    if (!value) {
        return Promise.reject("JSON未解析到数据");
    }
    let records = value.records;
    if (!records) {
        return Promise.reject("链接记录不存在");
    }
    if (!(records instanceof Array)) {
        return Promise.reject("数据格式错误，无法导入");
    }
    await useUrlStore().addByBatch(records.map(e => getDefaultUrl(e)))
}

</script>
<style lang="less">
.setting-url {
    .setting-url-toolbar {
        display: flex;
        justify-content: space-between;
        margin: 8px 5px;
    }

    .url-copy {
        display: inline;
    }
}
</style>
