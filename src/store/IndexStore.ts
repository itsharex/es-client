import IndexView from "@/view/index/IndexView";
import {defineStore} from "pinia";
import indexListBuild from '@/algorithm/IndexBuild/IndexListBuild';
import clusterApi from '@/components/es/api/ClusterApi'
import useUrlStore from "@/store/UrlStore";
import Field from "@/view/Field";
import useLoadingStore from "@/store/LoadingStore";
import NotificationUtil from "@/utils/NotificationUtil";

function renderMap(indices: Array<IndexView>): Map<string, IndexView> {
    let indicesMap = new Map<string, IndexView>();
    for (let index of indices) {
        let names = [index.name, ...index.alias];
        for (let name of names) {
            indicesMap.set(name, index);
        }
    }
    return indicesMap;
}

const useIndexStore = defineStore('index', {
    state: () => ({
        // 全部的索引
        indices: new Array<IndexView>(),
        indicesMap: new Map<string, IndexView>(),
        // 服务器名称
        name: '',
        active_shards: 0,
        total_shards: 0,
        status: '',
    }),
    getters: {
        /**
         * 返回全部的链接
         */
        list: (state) => state.indices,
        /**
         * 索引映射
         */
        map: (state) => state.indicesMap,
        indexAliasMap: (state): Map<string, string> => {
            let aliasIndexMap = new Map<string, string>();
            state.indices.forEach(index => {
                aliasIndexMap.set(index.name, index.name);
                [index.name, ...index.alias].forEach(alias => aliasIndexMap.set(alias, index.name));
            });
            return aliasIndexMap;
        }
    },
    actions: {
        /**
         * 重新获取链接
         */
        async reset(): Promise<void> {
            if (useUrlStore().current === '') {
                return Promise.reject('链接不存在');
            }
            // 清空数据
            this.clear();
            // 初始化时加载
            useLoadingStore().start('准备索引信息中');
            try {
                useLoadingStore().setText('开始构建索引信息');
                // 获取索引信息
                this.indices = await indexListBuild();
                // 渲染map
                this.indicesMap = renderMap(this.indices);

                // 获取基本信息
                clusterApi._cluster_health().then(health => {
                    this.name = health.cluster_name;
                    this.active_shards = health.active_shards;
                    let unassigned_shards = health.unassigned_shards;
                    this.total_shards = this.active_shards + unassigned_shards;
                    this.status = health.status;
                }).catch(e => NotificationUtil.error(e, '获取索引健康值失败'));

                return Promise.resolve();
            } catch (e: any) {
                useUrlStore().clear();
                console.error(e);
                return Promise.reject(e);
            } finally {
                useLoadingStore().close();
            }
        },
        clear() {
            this.name = '';
            this.indices = new Array<IndexView>();
            this.indicesMap = new Map<string, IndexView>();
            this.active_shards = 0;
            this.total_shards = 0;
            this.status = '';
        },
        field(indexName: string | IndexView | undefined): Array<Field> {
            let indexView: IndexView | undefined;
            if (typeof indexName === 'string') {
                indexView = this.indicesMap.get(indexName);
            } else {
                indexView = indexName;
            }
            if (indexView) {
                return [{
                    name: '_id',
                    type: 'text',
                    dataIndex: '_id',
                    label: '_id'
                }, ...Array.from(indexView.fields)]
            }
            return new Array<Field>;
        }
    }
});

export default useIndexStore;
