import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import TableNameEnum from "@/enumeration/TableNameEnum";
import {storageStrategyContext} from "@/global/BeanFactory";

export class SeniorSearchHistoryService {

    async list(urlId?: number): Promise<Array<SeniorSearchHistory>> {
        return storageStrategyContext.getStrategy().list<SeniorSearchHistory>(TableNameEnum.SENIOR_SEARCH_HISTORY, {urlId});
    }

    async existByName(name: string): Promise<boolean> {
        let count = await storageStrategyContext.getStrategy().list<SeniorSearchHistory>(TableNameEnum.SENIOR_SEARCH_HISTORY, {name});
        return Promise.resolve(count.length > 0);
    }

    async save(record: Omit<SeniorSearchHistory, 'id' | 'createTime' | 'updateTime'>): Promise<number> {
        if (!record.name || record.name === '') {
            return Promise.reject('记录名称不能为空');
        }
        if (await this.existByName(record.name)) {
            return Promise.reject('记录名称已存在');
        }
        return storageStrategyContext.getStrategy().insert<SeniorSearchHistory>(TableNameEnum.SENIOR_SEARCH_HISTORY, {
            id: 0,
            urlId: record.urlId,
            createTime: new Date(),
            updateTime: new Date(),
            name: record.name,
            body: record.body,
            isEnableFilter: record.isEnableFilter,
            filter: record.filter
        });
    }

    async update(record: SeniorSearchHistory): Promise<void> {
        if (!record.id) {
            return Promise.reject('ID不存在，无法更新');
        }
        let history = await storageStrategyContext.getStrategy().one<SeniorSearchHistory>(TableNameEnum.SENIOR_SEARCH_HISTORY, record.id);
        if (!history) {
            return Promise.reject('未找到该历史，请选择新增到历史');
        }
        let item = Object.assign(history, record);
        item.updateTime = new Date();
        return storageStrategyContext.getStrategy().update<SeniorSearchHistory>(TableNameEnum.SENIOR_SEARCH_HISTORY, record.id, item);
    }

    removeById(id: number): Promise<void> {
        return storageStrategyContext.getStrategy().delete<SeniorSearchHistory>(TableNameEnum.SENIOR_SEARCH_HISTORY, id);
    }

}
