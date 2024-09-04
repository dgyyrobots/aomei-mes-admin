<template>
    <div class="v" style="padding-bottom: 20px;">
        <el-row style="padding: 20px 30px 0 30px;">
            <el-col :span="1">&nbsp</el-col>
            <el-col :span="5">
                <img :src="item.picture" alt="" style="height: 300px;width: 100%;">
            </el-col>
            <el-col :span="17" class="font">
                <div>
                    <span>标题</span>
                    <span>{{ item.name }}</span>
                </div>
                <div>
                    <span>专业资质</span>
                    <span>{{ item.direction }}</span>
                </div>
            </el-col>
            <el-col :span="1">&nbsp</el-col>
        </el-row>
        <el-row style="margin-top: 50px;">
            <el-col :span="1">&nbsp</el-col>
            <!-- <el-col :span="4">
                <el-menu :default-active="mr" class="el-menu-vertical-demo el-menus" @select="qh">
                    此处index好像必须字符串会有报错但没影响
                    <el-menu-item :index="item.id + ''" v-for="item in list" :key="item.id">
                        <i class="el-icon-setting"></i>
                        <span slot="title">{{ item.coursewareName }}</span>
                    </el-menu-item>
                </el-menu>
            </el-col> -->
            <el-col :span="22">
                <el-table :data="list" style="width: 100%" :row-class-name="tableRowClassName"
                    :header-cell-style="{ background: '#F1F2F5' }">
                    <el-table-column prop="coursewareName" label="课程名称" width="180">
                        <template slot-scope="scope">
                            <!-- <i class="el-icon-video-play" style="cursor: pointer;" @click="dk(scope.row.filepath)"></i> -->
                            <!-- <i class="el-icon-video-play" style="cursor: pointer;"
                                @click="dkzz(scope.row.filepath, scope.row.filename)"></i> -->
                            <span style="margin-left: 10px;cursor: pointer;"
                                @click="dkList(scope.row.id, () => { title = scope.row.coursewareName })">{{
                                    scope.row.coursewareName
                                }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="fileSize" label="课件大小" width="180">
                    </el-table-column> -->
                    <el-table-column prop="address" label="创建时间">
                        <template slot-scope="{row}">
                            {{ parseTime(row.createTime) }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="1">&nbsp</el-col>
        </el-row>
        <el-dialog :title="title2" :visible.sync="dialogVisible" center fullscreen :modal="false">
            <video autoplay controls loop height="740" width="100%" :src="url" v-if="type == 'mp4'"></video>
            <iframe :src="url" frameborder="0" height="740" width="100%" v-if="type == 'pdf'"></iframe>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="dialogTableVisible">
            <el-table :data="gridData">
                <el-table-column property="filename" label="课件名称" width="200">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="text" @click="dkzz(row.filepath, row.filename)">
                            <i class="el-icon-video-play" style="margin-right: 10px;"></i>
                            {{ row.filename }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column property="fileSize" label="课件大小" width="200"></el-table-column>
                <el-table-column property="createTime" label="创建日期" width="150"></el-table-column>
                <el-table-column property="filepath" label="课件地址"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>

import { createLecturer, updateLecturer, deleteLecturer, getLecturer, getLecturerPage, exportLecturerExcel } from "@/api/wiki/lecturer";
import { createCoursewave, updateCoursewave, deleteCoursewave, getCoursewave, getCoursewavePage, exportCoursewaveExcel } from "@/api/wiki/coursewave";
import { createCoursewareFile, updateCoursewareFile, deleteCoursewareFile, getCoursewareFile, getCoursewareFilePage, exportCoursewareFileExcel } from "@/api/wiki/coursewareFile";
export default {
    name: "KnowledgeDetil",
    components: {
    },
    data() {
        return {
            type: '',
            dialogVisible: false,
            url: '',
            title: '',
            title2: '',
            gridData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            item: '',
            list: [],
            mr: '',
            dialogTableVisible: false
        };
    },
    created() {
        this.getDate();
        this.getList();
    },
    activated() {
        this.getDate();
    },
    methods: {
        dkList(id, fn = () => { }) {
            fn();
            this.getList2(id);
            this.dialogTableVisible = true;
        },
        dkzz(url, title) {
            if (url.indexOf('mp4') > -1) {
                this.type = 'mp4';
                this.url = url;
                this.title2 = title;
                this.dialogVisible = true
            } else if (url.indexOf('pdf') > -1) {
                this.type = 'pdf';
                this.url = url;
                this.title2 = title;
                this.dialogVisible = true
            } else {
                this.dk(url);
            }
        },
        dk(url) {
            window.open(url);
        },
        qh(id) {
            this.getList2(id);
        },
        getList2(id) {
            getCoursewareFilePage({ pageSize: 100, coursewareId: id }).then(response => {
                this.gridData = response.data.list;
            });
        },

        getList() {
            getCoursewavePage({ lecturerId: this.$route.query.id, pageSize: 100, }).then(response => {
                // this.mr = response.data.list[0].id;
                this.list = response.data.list;
                // this.getList2(this.mr);
            });
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2 != 0) {
                return 'warning-row';
            }
        },
        getDate() {
            getLecturer(this.$route.query.id).then(response => {
                this.item = response.data;
            });
        }
    }
};
</script>

<style lang="scss">
.v {
    margin: 20px;
    background-color: #fff;
}

// .el-table .warning-row {
// background: #abbddc;
// }

.el-menus {
    height: 500px;
}

.font {
    margin-left: 20px;

    >div {
        display: flex;
        flex-direction: column;
        margin-bottom: 30px;

        >span:nth-child(1) {
            font-size: 25px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        >span:nth-child(2) {
            font-size: 20px;
        }
    }
}
</style>
