<template>
    <div class="v" style="padding-bottom: 50px;">
        <!-- <el-row :gutter="10">
            <el-col :span="24">
                <img style="width: 100%;height: 200px;"
                    src="https://img0.baidu.com/it/u=1435639120,2241364006&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"
                    alt="">
            </el-col>
        </el-row> -->
        <el-row style="margin: 25px 0 0 0;" justify="center" type="flex">
            <el-col :span="8">
                <el-input placeholder="请输入你想学习的内容" v-model="input">
                    <el-button slot="append" icon="el-icon-search" type="primary"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="1">&nbsp</el-col>
            <el-col style="font-size: 20px;font-weight: bold;margin-bottom: 25px;"><i
                    class="el-icon-s-custom"></i>&nbsp讲师</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="1">&nbsp</el-col>
            <el-col :span="1" style="height: 200px;line-height: 200px;cursor: pointer;" @click="TopBot('top')"><i
                    class="el-icon-arrow-left" style="font-size: 20px;"></i></el-col>
            <el-col :span="5" v-for="item in list" :key="item.id">
                <div class="grid-content" @click="tz(item)" style="cursor: pointer;">
                    <img :src="item.picture" alt="">
                    <div>
                        <span>{{ item.name }}</span>
                        <span>{{ item.direction }}</span>
                        <span style="cursor: pointer;">去听他的课 <i class="el-icon-video-play"></i></span>
                    </div>
                </div>
            </el-col>
            <el-col :span="1" style="height: 200px;line-height: 200px;cursor: pointer;" @click="TopBot('bot')"><i
                    class="el-icon-arrow-right" style="font-size: 20px;"></i></el-col>
            <el-col :span="1">&nbsp</el-col>
        </el-row>
        <el-row style="margin-top: 50px;">
            <el-col :span="1">&nbsp</el-col>
            <el-col :span="4" style="overflow: hidden;">
                <el-menu :default-active="mr" class="el-menu-vertical-demo el-menus" @select="qh">
                    <!-- <el-menu-item :index="item.id" v-for="item in list2" :key="item.id">
                        <i class="el-icon-setting"></i>
                        <span slot="title">{{ item.name }}</span>
                    </el-menu-item> -->
                    <!-- <el-submenu :index="items.id + ''" v-for="items in list2" :key="items.id">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span class="el-menu-item" style="padding-left: 0;">{{ items.name }}</span>
                        </template> -->
                    <el-menu-item :index="index + ''" v-for="(item, index) in list2" :key="item.id">
                        <i class="el-icon-setting"></i>
                        <span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                    <!-- </el-submenu> -->
                </el-menu>
            </el-col>
            <el-col :span="18" style="padding-left: 20px;font-size: 18px;">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="item.name" :name="item.id + ''" v-for="item in list3" :key="item.id"
                        style="font-size: 20px !important;">
                        <el-row class="hover" style="padding: 10px" type="flex" justify="space-between"
                            v-for="item in list4" :key="item.id">
                            <el-col :span="8" style="display: flex;align-items: center;">
                                <!-- <i class="el-icon-video-play" @click="dk(item.filepath)" style="cursor: pointer;margin-right: 10px;"></i> -->
                                <!-- @click="dkzz(item.filepath, item.filename)" -->
                                <div style="cursor: pointer;"
                                    @click="dkList(item.id, () => { title = item.coursewareName })">
                                    <!-- <i class="el-icon-video-play" style="margin-right: 10px;"></i> -->
                                    {{ item.coursewareName }}
                                </div>
                            </el-col>
                            <el-col :span="8">{{ parseTime(item.createTime) }}</el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs></el-col>
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
import { getLecturerPage } from "@/api/wiki/lecturer";
import { createCategory, updateCategory, deleteCategory, getCategory, getCategoryPage, exportCategoryExcel } from "@/api/wiki/category";
import { createCoursewave, updateCoursewave, deleteCoursewave, getCoursewave, getCoursewavePage, exportCoursewaveExcel } from "@/api/wiki/coursewave";
import { createCoursewareFile, updateCoursewareFile, deleteCoursewareFile, getCoursewareFile, getCoursewareFilePage, exportCoursewareFileExcel } from "@/api/wiki/coursewareFile";
export default {
    name: "KnowledgeBase",
    components: {
    },
    data() {
        return {
            dialogVisible: false,
            url: '',
            title: '',
            title2: '',
            input: '',
            activeName: '',
            list: [],
            total: '',
            queryParams: {
                pageNo: 1,
                pageSize: 4
            },
            list2: [],
            list3: [],
            list4: [],
            gridData: [],
            mr: '0',
            dialogTableVisible: false,
            type: '',
        };
    },
    created() {
        this.getList();
        this.getList2();
    },
    methods: {
        dkList(id, fn = () => { }) {
            fn();
            this.getList4(id);
            this.dialogTableVisible = true;
        },
        handleClick(tab) {
            this.getList3(this.list3[tab.index].id);
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
        tz(row) {
            this.$router.push({ name: 'KnowledgeDetil', query: { id: row.id } });
        },
        getList() {
            getLecturerPage(this.queryParams).then(response => {
                if (!response.data.list.length) return;
                this.list = response.data.list;
                this.total = response.data.total;
            });
        },
        TopBot(name) {
            if (name == 'top') {
                if (this.queryParams.pageNo == 1) return;
                this.queryParams.pageNo = --this.queryParams.pageNo;
            } else if (name == 'bot') {
                if (this.list.length < this.queryParams.pageSize) return;
                this.queryParams.pageNo = ++this.queryParams.pageNo;
            }
            this.getList();
        },
        getList2() {
            getCategoryPage({ pageSize: 100, pid: 0 }).then(async response => {
                for (let i = 0; i < response.data.list.length; i++) {
                    let data = await getCategoryPage({ pageSize: 100, pid: response.data.list[i].id })
                    response.data.list[i].children = data.data.list;
                }
                this.list2 = response.data.list;
                // this.mr = this.list2[0].children[0].id;
                // this.getList3(this.list2[0].children[0].id);
                this.activeName = this.list2[0].children[0].id + '';
                this.list3 = this.list2[0].children;
                this.getList3(this.list2[0].children[0].id)
            });
        },
        getList3(id) {
            getCoursewavePage({ pageSize: 100, categoryId: id }).then(response => {
                this.list4 = response.data.list;
                // this.activeName = response.data.list[0].id + '';
                // this.getList4(response.data.list[0].id);
            });
        },
        getList4(id) {
            getCoursewareFilePage({ pageSize: 100, coursewareId: id }).then(response => {
                this.gridData = response.data.list;
                console.log(this.gridData);
            });
        },
        qh(id) {
            this.list3 = this.list2[id * 1].children;
            console.log(this.list3)
            this.activeName = this.list3[0].id + '';
            // this.getList3(id);
        }
    }
};
</script>
<style lang="scss">
.el-tabs__item .is-top .is-active {
    font-size: 20px !important;
}

@import '@/assets/styles/element-variables.scss';

.el-menus {
    border: 1px solid #EAEAEA !important;
    font-size: 20px;
    font-weight: bold;
}

.el-menus .el-menu-item {
    font-size: 20px;
    font-weight: bold;
}

.v {
    margin: 20px;
    background-color: #fff;
    overflow: hidden;
}

.grid-content {
    display: flex;
}

.grid-content>img {
    height: 200px;
    width: 150px;
}

.grid-content>div {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 15px;
    box-sizing: border-box;
    background-color: #F8FAF9;
    width: auto;
}

.grid-content>div>span:nth-child(1) {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}

.grid-content>div>span:nth-child(2) {
    font-size: 15px;
    color: #B9C2D4;
    margin-bottom: 30px;
}

.grid-content>div>span:nth-child(3) {
    font-size: 15px;
    color: $--color-primary;
    border-radius: 20px;
    width: 117px;
    padding: 5px;
    text-align: center;
    border: 1px solid $--color-primary;
}

.hover:hover {
    background-color: #F8FAF9;
}
</style>
