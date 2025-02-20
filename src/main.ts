import { createApp, App } from 'vue';
import store from "@/store";
import AppInstance from './App.vue';
import i18n from '@/i18n';
import router from "@/plugins/router";

// 额外引入图标库
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// 引入VXETable

// 引入样式
import '@/less/theme.less';
import '@/less/main.less';
import '@/less/post.css';
import '@/less/customer.less';
import '@/components/JsonTree/index.less';
import '@arco-design/web-vue/dist/arco.css';
import 'vxe-table/lib/style.css'

// @ts-ignore
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// @ts-ignore
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// @ts-ignore
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-ignore: worker 导入方式可以参考vite官网 https://cn.vitejs.dev/guide/features.html#web-workers
self.MonacoEnvironment = { // 提供一个定义worker路径的全局变量
    getWorker(_: string, label: string) {
        if (label === 'json') {
            return new JsonWorker()
        }
        if (['css', 'scss', 'less'].includes(label)) {
            return new CssWorker()
        }
        if (['html', 'handlebars', 'razor'].includes(label)) {
            return new HtmlWorker()
        }
        if (['typescript', 'javascript'].includes(label)) {
            return new TsWorker()
        }
        return new EditorWorker()
    }
};

window.addEventListener('message', event => {
    const message = event.data;
    if (message['type'] === 'url-open') {
        sessionStorage.setItem('action', message['content']);
    }
});

import XEUtils from 'xe-utils'
import {VXETable, Column, Icon, Tooltip, VxeTable, Menu} from 'vxe-table'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'

// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VXETable.setup({
    i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})
function useTable (app: App) {
    // 表格功能
    app
    // .use(Filter)
    // .use(Edit)
    .use(Menu)
    // .use(Export)
    // .use(Keyboard)
    // .use(Validator)

    // 可选组件
    app.use(Icon)
        .use(Column)
        // .use(Colgroup)
        // .use(Grid)
        .use(Tooltip)
        // .use(Toolbar)
        // .use(Pager)
        // .use(Form)
        // .use(FormItem)
        // .use(FormGather)
        // .use(Checkbox)
        // .use(CheckboxGroup)
        // .use(Radio)
        // .use(RadioGroup)
        // .use(RadioButton)
        // .use(Switch)
        // .use(Input)
        // .use(Select)
        // .use(Optgroup)
        // .use(Option)
        // .use(Textarea)
        // .use(Button)
        // .use(Modal)
        // .use(List)
        // .use(Pulldown)

        // 安装表格
        .use(VxeTable)
}
// 插件
createApp(AppInstance)
    .use(ArcoVue)
    .use(store)
    .use(i18n)
    .use(ArcoVueIcon)
    .use(router)
    .use(useTable)
    .mount('#app');

