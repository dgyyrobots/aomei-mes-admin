<template>
    <easy-panel @refresh="getList()">
        <el-table v-loading="loading" :data="list">
            <el-table-column label="任务编号" align="center" prop="taskCode" width="110">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="text" @click="handleView(scope.row)" v-hasPermi="['pro:workorder:query']"> -->
                        {{ scope.row.taskCode }}
                    <!-- </el-button> -->
                </template>
            </el-table-column>
            <el-table-column label="工单/任务名称" align="center" prop="taskName" width="200">
                <template slot-scope="scope">
                    {{ scope.row.workorderName }}<br />{{ scope.row.taskName }}
                </template>
            </el-table-column>
            <el-table-column label="产品编号/名称" align="center" prop="itemCode" width="110">
                <template slot-scope="scope">
                    {{ scope.row.itemCode }}<br />{{ scope.row.itemName }}
                </template>
            </el-table-column>
            <el-table-column label="工序" align="center" prop="processName" width="50px" />
            <el-table-column label="任务/产出" align="center" prop="quantity" width="80px">
                <template v-slot="scope">
                    <span>{{ scope.row.quantity }}/{{ scope.row.quantityProduced }}</span>
                </template>
            </el-table-column>
            <el-table-column label="良品/不良" align="center" prop="quantityQuanlify" width="80px">
                <template v-slot="scope">
                    <span>{{ scope.row.quantityQuanlify }}/{{ scope.row.quantityUnquanlify }}</span>
                </template>
            </el-table-column>
            <el-table-column label="计划时间" align="center" prop="startTime" class-name="small-padding fixed-width"
                fixed="right">
                <template v-slot="scope">
                    <span>{{ parseTime(scope.row.startTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" label="执行时间" align="center" prop="startTime" class-name="small-padding fixed-width"
                fixed="right">
                <template v-slot="scope">
                    <span>开工：{{ parseTime(scope.row.actualStartTime) }}</span><br>
                    <span>完成：{{ parseTime(scope.row.actualEndTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="规格" align="center" prop="specification" fixed="right" />
            <el-table-column label="需求日期" align="center" prop="requestDate" class-name="small-padding fixed-width"
                width="100" fixed="right">

              <template v-slot="scope">
                   <span>{{ parseTime(scope.row.requestDate, '{y}-{m}-{d}') }}</span><br /><span
                     v-if="scope.row.requestDate < date && scope.row.status != 'FINISHED'" style="color: red;">延期{{
               Math.ceil((date
                 - scope.row.requestDate) / (1000 * 3600 * 24)) }}天</span>
                   <span
                     v-if="scope.row.requestDate > date && scope.row.status != 'FINISHED' && (scope.row.requestDate - date) < (1000 * 3600 * 24)"
                     style="color: #FFA500;">紧急</span>
                 </template>
            </el-table-column>
            <el-table-column label="报工/打印状态" align="center" prop="isReport" class-name="small-padding fixed-width"
                fixed="right" width="110">
                <template v-slot="scope">
                    <el-tag type="info" v-if="!scope.row.isReport">未报工</el-tag>
                    <span v-else>报工{{ scope.row.isReport }}次</span><br />
                    <el-tag type="info" v-if="!scope.row.isPrint">未打印</el-tag>
                    <span v-else>打印{{ scope.row.isPrint }}次</span>
                </template>
            </el-table-column>
            <el-table-column label="生产状态" align="center" prop="status" class-name="small-padding fixed-width" fixed="right">
                <template v-slot="scope">
                    <dict-tag :type="DICT_TYPE.MES_PRO_TASK_STATUS" :value="scope.row.status"></dict-tag>
                </template>
            </el-table-column>
        </el-table>
    </easy-panel>
</template>
<script>
import easyPanel from './easy-panel.vue';
import { listProtasks } from '@/api/mes/pro/protask';

export default {
    props: ['soucecode'],
    dicts: ['mes_order_status', 'mes_workorder_sourcetype'],
    components: {
        easyPanel,
    },
    data() {
        return {
            loading: false,
            list: [],
        };
    },
    watch: {
        soucecode: {
            handler: 'getList',
            immediate: true,
        },
    },
    methods: {
        getList() {
            if (!this.soucecode) {
                this.list = [];
                return;
            }
            listProtasks({
                sourceCode: this.soucecode,
                pageSize: 100,
                pageNo: 1,
            }).then(res => {
                this.list = res.data.list;
            });
        },
    },
};
</script>
