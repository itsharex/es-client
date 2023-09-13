import {defineStore} from "pinia";
import {Button, Notification} from "@arco-design/web-vue";
import {h} from "vue";
import {NotificationItem} from "@/domain/NotificationItem";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {AxiosRequestConfig} from "axios";

function notification(content: string, title: string) {
    let notificationReturn = Notification.info({
        content,
        title,
        closable: true,
        duration: useGlobalSettingStore().getNotificationTime,
        footer: () => h('div', [
            h(Button, {
                type: 'text',
                onClick: () => {
                    notificationReturn.close();
                }
            }, () => ("取消")),
            h(Button, {
                type: 'primary',
                onClick: () => {
                    // 前往
                    emitter.emit(MessageEventEnum.OPEN_NOTIFICATION_MANAGE);
                    notificationReturn.close();
                }
            }, () => ("前往"))
        ])
    });
}

const useNotificationStore = defineStore('notification', {
    state: () => ({
        items: new Array<NotificationItem>(),
        hasRead: true
    }),
    actions: {
        send(content: string, title: string) {
            let now = new Date();
            this.add({
                id: now.getTime(),
                time: now,
                title: title,
                type: 'original',
                body: `${content}`,
            });
        },
        /**
         * 新增一共消息
         * @param item 消息
         */
        add(item: NotificationItem) {
            notification(item.body, item.title);
            this.items.push(item);
            this.hasRead = false;
        },
        http(config: AxiosRequestConfig, body: any) {
            let now = new Date();
            this.add({
                id: now.getTime(),
                time: now,
                title: '请求失败',
                type: 'http',
                body: '详情请看通知中心',
                httpMode: {
                    baseURL: config.baseURL,
                    url: config.url || '',
                    method: config.method!,
                    data: config.data,
                    rsp: body,
                }
            });
        },
        /**
         * 消息已读
         */
        read() {
            this.hasRead = true;
        },
        clear() {
            this.hasRead = true;
            this.items = [];
        }
    }
});

export default useNotificationStore;
