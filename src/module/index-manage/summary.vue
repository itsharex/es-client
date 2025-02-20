<template>
    <a-spin :loading="loading" tip="数据查询中">
        <a-descriptions title="概览" :column="2" class="index-manage-summary" bordered>
            <a-descriptions-item label="健康">
                <div class="health">
                    <div class="dot" :style="{ backgroundColor: health }" />
                    <div>{{ health }}</div>
                </div>
            </a-descriptions-item>
            <a-descriptions-item label="状态">{{ state }}</a-descriptions-item>
            <a-descriptions-item label="节点数">{{ numberOfNodes }}</a-descriptions-item>
            <a-descriptions-item label="数据节点数">{{ numberOfDataNodes }}</a-descriptions-item>
            <a-descriptions-item label="文档数">{{ docsCount }}</a-descriptions-item>
            <a-descriptions-item label="文档删除">{{ docsDeleted }}</a-descriptions-item>
            <a-descriptions-item label="活动主要分片">{{ activePrimaryShards }}</a-descriptions-item>
            <a-descriptions-item label="活动分片">{{ activeShards }}</a-descriptions-item>
            <a-descriptions-item label="relocating分片">{{ relocatingShards }}</a-descriptions-item>
            <a-descriptions-item label="initializing分片">{{ initializingShards }}</a-descriptions-item>
            <a-descriptions-item label="unassigned分片">{{ unassignedShards }}</a-descriptions-item>
            <a-descriptions-item label="存储大小">{{ storageSize }}</a-descriptions-item>
            <a-descriptions-item label="别名">
                <span class="arco-tag arco-tag-size-medium arco-tag-blue arco-tag-checked summary-alias"
                    v-for="(item, idx) in aliasItems" :key="idx" style="margin-right: 5px">
                    {{ item }}
                    <icon-close :size="16" @click="removeAlias(item)" class="alias-close" />
                </span>
                <a-button type="primary" status="normal" size="mini" @click="newAlias()">{{ $t('common.operation.add') }}
                </a-button>
            </a-descriptions-item>
        </a-descriptions>
    </a-spin>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import useIndexStore from "@/store/IndexStore";
import Assert from "@/utils/Assert";
import IndexApi from "@/components/es/api/IndexApi";
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";
import { mapState } from "pinia";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default defineComponent({
    name: 'index-manage-summary',
    props: {
        index: String,
        state: String
    },
    data: () => ({
        loading: false,
        health: '',
        numberOfNodes: 0,
        numberOfDataNodes: 0,
        activePrimaryShards: 0,
        activeShards: 0,
        relocatingShards: 0,
        initializingShards: 0,
        unassignedShards: 0,
        docsCount: '0',
        docsDeleted: '0',
        storageSize: '',
        aliasItems: new Array<string>()
    }),
    created() {
        this.init();
    },
    computed: {
        ...mapState(useIndexStore, ['indicesMap']),
    },
    watch: {
        indicesMap() {
            this.init()
        }
    },
    methods: {
        init() {
            this.loading = true;
            let indexView = useIndexStore().indicesMap.get(this.index!)!;
            Assert.notNull(indexView, "索引不存在", () => this.loading = false);

            // 获取索引健康状态
            IndexApi(this.index!).health().then(health => {
                this.health = health.status;
                this.numberOfNodes = health.number_of_nodes;
                this.numberOfDataNodes = health.number_of_data_nodes;
                this.activePrimaryShards = health.active_primary_shards;
                this.activeShards = health.active_shards;
                this.relocatingShards = health.relocating_shards;
                this.initializingShards = health.initializing_shards;
                this.unassignedShards = health.unassigned_shards;
                this.docsCount = indexView.doc_count + '';
                this.docsDeleted = Optional.ofNullable(indexView)
                    .map(e => e.indexStats)
                    .map(e => e.total)
                    .map(e => e.docs)
                    .map(e => e.deleted)
                    .map(e => e + '')
                    .orElse('');
                this.storageSize = indexView.size;
                this.aliasItems = indexView.alias;
            }).catch(e => MessageUtil.error("索引健康值获取错误", e))
                .finally(() => this.loading = false);
        },

        newAlias() {
            MessageBoxUtil.prompt("请输入新别名", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then((value) => IndexApi(this.index!).newAlias(value)
                .then(res => {
                    MessageUtil.success(JSON.stringify(res), this.reset);
                })
                .catch(e => MessageUtil.error('新建别名错误', e)));
        },
        removeAlias(alias: string) {
            MessageBoxUtil.confirm("此操作将永久删除该别名, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(() => IndexApi(this.index!).removeAlias(alias)
                    .then(res => MessageUtil.success(JSON.stringify(res), this.reset))
                    .catch(e => MessageUtil.error('删除别名错误', e)))
                .catch(() => console.log('取消删除别买'));
        },
        reset() {
            useIndexStore().reset();
        },
    }
});
</script>
<style scoped lang="less">
.index-manage-summary {
    margin-top: 20px;


    .health {
        display: flex;
    }


    .alias {
        margin-right: 5px;
        margin-bottom: 5px;
    }

    .summary-alias {

        .alias-close {
            margin-left: 4px;
            padding: 2px;

            &:hover {
                background-color: var(--color-fill-3);
                border-radius: 50%;
                cursor: pointer;
            }
        }

    }
}
</style>
