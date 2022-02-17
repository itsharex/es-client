import BaseQuery from "@/entity/BaseQuery";

/**
 * 获取基础查询请求体
 * @returns 基础查询请求体
 */
function getBaseBody(page: number, size: number): any {
    return {
        query: {
            bool: {
                must: [],
                must_not: [],
                should: [],
            },
        },
        from: (page - 1) * size,
        size: size,
        sort: [],
        aggs: {},
    };
}

function buildQuery(query: BaseQuery, array: Array<any>): void {
    let condition = {} as any;
    let expression = {} as any;
    // 不同的条件，查询方式和表达式不同
    if (query.condition === 'match' ||
        query.condition === 'term' ||
        query.condition === 'wildcard') {
        expression[query.field.name.substring(5)] = query.value;
    } else if (query.condition === 'range') {
        let value = {} as any;
        value[query.extra_left_cindition] = query.extra_left_value;
        value[query.extra_right_cindition] == query.extra_right_value;
        expression[query.field.name.substring(5)] = value;
    }else {
        throw new Error('查询条件不支持')
    }
    condition[query.condition] = expression;
    array.push(condition);
}

/**
 * 构造es查询条件
 * 
 * @param querys 查询条件
 */
export default function QueruConditionBuild(querys: Array<BaseQuery>, page: number, size: number): any {
    let must = [] as Array<any>;
    let must_not = [] as Array<any>;
    let should = [] as Array<any>;
    for (let query of querys) {
        if (query.type === 'must') {
            buildQuery(query, must);
        } else if (query.type === 'must_not') {
            buildQuery(query, must_not);
        } else if (query.type === 'should') {
            buildQuery(query, should);
        }
    }
    let body = getBaseBody(page, size);
    body.query.bool.must = must;
    body.query.bool.must_not = must_not;
    body.query.bool.should = should;
    return body;
}