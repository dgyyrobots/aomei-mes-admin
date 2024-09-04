<template>
    <div class="page">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.value.key" v-for="item in arr" :key="item.value.key">
                <div v-for="(items) in form.value" :key="items.configKey">
                    <div class="top"> <span></span> {{ items.configDesc }}-{{ items.configKey }}</div>
                    <template v-if="items.configKey == 'SWLB'">
                        <div style="height: 10px;"></div>
                        <div v-for="(itemss, index) in items.value" :key="index"
                            style="display: flex;padding-left: 260px;padding-bottom: 10px;">
                            <el-input v-model="itemss.label" :placeholder="'类别序号' + (index + 1)" style="width: 250px;" />
                            <el-button type="danger" @click="Delete(items.value, index)">删除</el-button>
                        </div>
                        <el-button type="primary" @click="add(items.value)" style="margin-left: 510px;">添加</el-button>
                    </template>
                    <div v-else-if="getObjLevel(items.value) > 1">
                        深层数据结构不支持修改
                    </div>
                    <el-form :ref="items" :model="items.value" label-width="160px"
                        style="padding-left: 100px;margin-top: 10px;" v-else>
                        <el-col :span="8">
                            <el-form-item :label="itemss" v-for="itemss in Object.keys(items.value)" :key="itemss"
                                style="margin-bottom: 10px;">
                                <el-input v-model="items.value[itemss]" :placeholder="'请输入' + itemss" />
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="dialog-footer">
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button @click="reset">重置</el-button>
        </div>
    </div>
</template>
<script>
import { createConfig, updateConfig, deleteConfig, getConfig, getConfigPage, exportConfigExcel, getConfigList, cinfigUpdate, cinfigCreated } from '@/api/system/config';
export default {
    name: 'ConfigMine',
    data() {
        return {
            arr: [{
                name: '报表设置',
                value: {
                    key: 'statement',
                    value: [
                        {
                            configKey: 'REPORT_SALES',
                            value: { value: '' },
                            configDesc: '打印出库单'
                        },
                        {
                            configKey: 'REPORT_WORKORDER',
                            value: { value: '' },
                            configDesc: '打印工单id'
                        }, {
                            configKey: 'YL2',
                            value: { value: '' },
                            configDesc: '发货报表'
                        }
                    ]
                }
            }, {
                name: '工作流设置',
                value: {
                    key: 'workflow',
                    value: {
                        // SWLB: [[{ "label": "无" }, { "label": "其他" }, { "label": "返现", "children": [{ "label": "卖家原因返现", "children": [{ "label": "返购买费用" }, { "label": "返商品差价" }, { "label": "修改中差评" }, { "label": "返安装费用" }, { "label": "返好评晒图" }, { "label": "返活动差价" }, { "label": "返安装操作费" }, { "label": "商家原因二次上门费用" }, { "label": "卖家原因退回运费" }, { "label": "商家原因处理费" }, { "label": "卖家原因垫付运费" }] }, { "label": "工厂原因返现", "children": [{ "label": "质量问题补偿" }, { "label": "漏发配件补偿" }, { "label": "漏开孔补偿" }, { "label": "工厂二次上门费用" }, { "label": "工厂原因退回运费" }] }] }], '创建售后流程表单-事物类别分类'],
                    }
                }
            }, {
                name: '登录设置',
                value: {
                    key: 'login',
                    value: [
                        {
                            configKey: 'WECHAT_MINI_APP',
                            value: { "client-id": "", "client-secret": "" },
                            configDesc: '微信小程序登录'
                        },
                        {
                            configKey: 'DINGTALK',
                            value: { "client-id": "", "client-secret": "" },
                            configDesc: '钉钉登录'
                        }, {
                            configKey: 'WECHAT_ENTERPRISE',
                            value: { "client-id": "", "client-secret": "", "agent-id:": "" },
                            configDesc: '企业微信登录'
                        }
                    ]
                }
            }, {
                name: '其他设置',
                value: {
                    key: 'else',
                    value: [
                        {
                            configKey: 'YL1',
                            value: { value: '' },
                            configDesc: '是否展示一键报工'
                        },
                        {
                            configKey: 'SWLB',
                            value: { value: [{ "label": "" }] },
                            configDesc: '售后事务'
                        }
                    ]
                }
            }],
            activeName: 'statement',
            form: {},
            index: 0,
            // fasle走创建true走修改
            fag: true
        };
    },
    created() {
        this.handleClick({ index: this.index })
    },
    methods: {
        add(arr) {
            arr.push({ "label": "" })
        },
        Delete(arr, index) {
            arr.splice(index, 1)
        },
        async handleClick(tab, event) {
            // 根据切换索引切换数据源
            this.index = tab.index;
            this.activeName = this.arr[tab.index].value.key;
            let das = await getConfigPage({ pageSize: 100, appModule: this.arr[tab.index].value.key, });
            console.log(das.data.list.length)
            if (!das.data.list.length) {
                this.fag = false;
                this.form = JSON.parse(JSON.stringify(this.arr[tab.index].value));
                return;
            } else {
                this.fag = true
            }
            let list = das.data.list.map(item => {
                if (this.isJsonObj(item.value)) {
                    return item
                } else {
                    if (item.configKey == 'SWLB') {
                        item.value = (item.value && (JSON.parse(item.value)).length) ? item.value : JSON.stringify([{ "label": "" }]);
                    } else {
                        item.value = JSON.stringify({ value: item.value });
                    }
                    return item;
                }
            }).filter(item => {
                if (this.isJsonObj(item.value) && this.getObjLevel(JSON.parse(item.value)) > 1) {
                    // 深层数据结构不再添加进去
                    return false
                } else {
                    return true;
                }
            })
            this.arr[tab.index].value.value = [];
            list.forEach(item => {
                this.arr[tab.index].value.value.push({ value: JSON.parse(item.value), configDesc: item.configDesc, configKey: item.configKey });
            })
            console.log(this.arr[this.index]);
            this.form = JSON.parse(JSON.stringify(this.arr[this.index].value));
        },
        // 判断是否单层对象
        getObjLevel(obj) {
            let level = 1;// 初始对象的层数
            let objValue = Object.values(obj);
            for (let i = 0; i < objValue.length; i++) {
                if (typeof objValue[i] == 'object') {
                    if (!Array.isArray(objValue[i])) {
                        return this.getObjLevel(objValue[i]) + 1;
                    }
                }
            }
            return level;
        },
        // 判断是否JSON对象
        isJsonObj(str) {
            // 判断是否为json数据
            try {
                if (typeof JSON.parse(str) == "object" && !(JSON.parse(str) instanceof Array)) {
                    return true;
                }
            } catch (e) { }
            return false;
        },
        /** 查询列表 */
        getList(v) {
            // 执行查询
            getConfigList(v).then(response => {
                this.list = response.data.map(item => {
                    if (this.isJsonObj(item.value)) {
                        return item
                    } else {
                        item.value = JSON.stringify({ value: item.value });
                        return item;
                    }
                }).filter(item => {
                    if (this.isJsonObj(item.value) && this.getObjLevel(JSON.parse(item.value)) > 1) {
                        return false
                    } else {
                        return true;
                    }
                })
                this.list.map((item, index) => this.form[('form' + index)] = JSON.parse(item.value));
            });
        },
        reset() {
            // 清空当前表单内容
            this.form.value.map(item => Object.keys(item.value).map(items => item.value[items] = ''));
        },
        submitForm() {
            if (!this.form.value.length) return this.$message.error('没有可保存的数据');
            let objs = JSON.parse(JSON.stringify(this.form));
            objs.value.forEach((item, index) => {
                if (Object.keys(item.value).length == 1 && Object.keys(item.value)[0] == 'value') {
                    item.value = item.value.value;
                } else {
                    item.value = JSON.stringify(item.value);
                }
            })
            if (this.fag) {
                cinfigUpdate(objs).then(response => {
                    console.log(response)
                    if (response.data) {
                        this.$message.success('保存成功');
                    }

                });
            } else {
                cinfigCreated(objs).then(response => {
                    if (response.data) {
                        this.$message.success('保存成功');
                    }
                });
                console.log('新增')
            }
            console.log(objs);
            return;




























            let arr = [];
            Object.keys(this.form).forEach((item, index) => {
                let obj = JSON.parse(JSON.stringify(this.list[index]));
                if (Object.keys(this.form[item]).length == 1 && Object.keys(this.form[item])[0] == 'value') {
                    obj.value = this.form.value;
                } else {
                    obj.value = JSON.stringify(this.form);
                }
                console.log(obj);
                // arr.push(updateConfig([obj]));
            })
            Promise.all[arr].then(res => {
                console.log(res);
            })
            return;
            let obj = JSON.parse(JSON.stringify(this.list[this.index]));
            if (Object.keys(this.form).length == 1 && Object.keys(this.form)[0] == 'value') {
                obj.value = this.form.value;
            } else {
                obj.value = JSON.stringify(this.form);
            }
            updateConfig([obj]).then(response => {
                this.getList();
                this.$message.success('保存成功');
            });
        },
    }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/element-variables.scss';

.page {
    margin: 20px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
}

.dialog-footer {
    width: 100%;
    height: 50px;
    text-align: center;
    position: fixed;
    bottom: 0;
}

.top {
    height: 40px;
    // margin-top: 15px;
    width: 100%;
    background-color: #F0F0F0;
    font-size: 16px;
    font-weight: bold;
    line-height: 30px;
    padding: 5px 10px;
    box-sizing: border-box;
}

.top>span {
    width: 5px;
    height: 100%;
    background-color: $--color-primary;
    margin-right: 5px;
}
</style>