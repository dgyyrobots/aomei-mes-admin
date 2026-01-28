<template>
  <div class="app-container">
    <!-- Tab分页 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="班组成员管理" name="member">
        <!-- 班组成员管理页面内容 -->
        <el-row v-if="optType != 'view'" :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleMemberAdd" v-hasPermi="['cal:team-member:create']">新增</el-button>
            <UserMultiSelect ref="memberUserSelect" @onSelected="memberUserSelected"></UserMultiSelect>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="memberMultiple" @click="handleMemberDelete" v-hasPermi="['cal:team-member:delete']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleMemberExport" v-hasPermi="['cal:team-member:export']">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="memberShowSearch" @queryTable="getMemberList"></right-toolbar>
        </el-row>

        <el-table v-loading="memberLoading" :data="memberList" @selection-change="handleMemberSelectionChange" :max-height="400">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="用户ID" align="center" prop="userId" />
          <el-table-column label="用户名" align="center" prop="userName" />
          <el-table-column label="用户昵称" align="center" prop="nickName" />
          <el-table-column label="班次" align="center" prop="shiftInfo" fixed="right">
            <template slot-scope="scope">
              <el-select v-model="scope.row.shiftInfo" placeholder="请选择班次" @change="handleMemberShiftChange(scope.row)">
                <el-option
                  v-for="dict in dict.type.mes_shift_info"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
          </el-table-column>

<!--          <el-table-column label="操作" align="center" v-if="optType != 'view'" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleMemberDelete(scope.row)" v-hasPermi="['cal:team-member:delete']">删除</el-button>
            </template>
          </el-table-column>-->
        </el-table>

        <pagination v-show="memberTotal > 0" :total="memberTotal" :page.sync="memberQueryParams.pageNo" :limit.sync="memberQueryParams.pageSize" @pagination="getMemberList" />
      </el-tab-pane>

      <el-tab-pane label="排班管理" name="schedule">
        <!-- 排班管理页面内容 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['cal:team-member:create']">新增</el-button>
            <UserMultiSelect ref="userSelect" @onSelected="userSelected"></UserMultiSelect>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['cal:team-member:delete']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['cal:team-member:export']">导出</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="info" plain icon="el-icon-close" size="mini" @click="handleClearAllSchedule" v-hasPermi="['cal:team-member:delete']">清除全部排班</el-button>
          </el-col>


          <el-col :span="10">
            <el-form :model="scheduleQueryParams" ref="queryForm" size="small" :inline="true" v-show="scheduleShowSearch">
              <el-form-item label="排班日期" label-width="120px">
                <el-date-picker
                  v-model="scheduleDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  @change="handleDateChange"
                  style="width: 200px;">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>

          <right-toolbar :showSearch.sync="scheduleShowSearch" @queryTable="getScheduleList"></right-toolbar>
        </el-row>

        <el-table v-loading="scheduleLoading" :data="scheduleList" @selection-change="handleSelectionChange" :max-height="400">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="用户ID" align="center" prop="userId" />
          <el-table-column label="用户名" align="center" prop="userName" />
          <el-table-column label="用户昵称" align="center" prop="nickName" />

          <!-- 班次列 - 根据是否选择日期显示不同内容 -->
          <el-table-column label="班次" align="center" prop="shiftInfo" fixed="right" width="200">
            <template slot-scope="scope">
              <!-- 如果选择了日期，显示班次选择器 -->
              <div v-if="scheduleDate">
                <el-radio-group
                  v-model="scope.row.currentShift"
                  @change="(value) => handleShiftChange(scope.row, value)"
                  size="small"
                >
                  <el-radio-button
                    v-for="dict in dict.type.mes_shift_info"
                    :key="dict.value"
                    :label="dict.value"
                  >{{ dict.label }}</el-radio-button>
                </el-radio-group>
                <div v-if="scope.row.hasSchedule" style="margin-top: 5px;">
                  <el-tag size="mini" type="success">已排班</el-tag>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleRemoveSchedule(scope.row)"
                    style="margin-left: 5px;"
                  >
                    清除
                  </el-button>
                </div>
                <!-- 添加未排班状态提示 -->
                <div v-else-if="!scope.row.currentShift || scope.row.currentShift === '2'" style="margin-top: 5px;">
                  <el-tag size="mini" type="info">未排班</el-tag>
                </div>
              </div>
              <div v-else>
                <el-tag v-if="scope.row.shiftInfo && scope.row.shiftInfo !== '2'" :type="getShiftTagType(scope.row.shiftInfo)">
                  {{ getDictLabel('mes_shift_info', scope.row.shiftInfo) }}
                </el-tag>
                <el-tag v-else type="info">未排班</el-tag>
              </div>
            </template>
          </el-table-column>

<!--          <el-table-column label="操作" align="center" v-if="optType != 'view'" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['cal:team-member:delete']">删除</el-button>
            </template>
          </el-table-column>-->
        </el-table>

        <pagination v-show="scheduleTotal > 0" :total="scheduleTotal" :page.sync="scheduleQueryParams.pageNo" :limit.sync="scheduleQueryParams.pageSize" @pagination="getScheduleList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { listTeammember, getTeammember, delTeammember, addTeammember, updateTeammember } from '@/api/mes/cal/teammember';
import { listTeamSchedule, createTeamSchedule, deleteTeamSchedule, updateTeamSchedule } from '@/api/mes/cal/teamSchedule';
import UserMultiSelect from '@/components/userSelect/multi.vue';

export default {
  name: 'TeamManagement',
  components: { UserMultiSelect },
  dicts: ['mes_shift_info'],
  props: {
    teamId: null,
    optType: null,
  },
  data() {
    return {
      // Tab相关
      activeTab: 'member', // 默认显示班组成员管理

      // 班组成员管理相关数据
      memberLoading: true,
      memberIds: [],
      memberSingle: true,
      memberMultiple: true,
      memberShowSearch: true,
      memberTotal: 0,
      memberList: [],
      memberQueryParams: {
        pageNo: 1,
        pageSize: 10,
        teamId: this.teamId,
        userId: null,
        userName: null,
        nickName: null,
        tel: null,
      },
      memberForm: {},

      // 排班管理相关数据
      scheduleDate: null,
      scheduleLoading: true,
      scheduleIds: [],
      scheduleSingle: true,
      scheduleMultiple: true,
      scheduleShowSearch: true,
      scheduleTotal: 0,
      scheduleList: [],
      scheduleQueryParams: {
        pageNo: 1,
        pageSize: 10,
        teamId: this.teamId,
        userId: null,
        userName: null,
        nickName: null,
        tel: null,
      },

      // 通用数据
      title: '',
      open: false,
      form: {},
    };
  },
  watch: {
    // 监听teamId变化，重新加载数据
    teamId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.scheduleQueryParams.teamId = newVal;
          this.memberQueryParams.teamId = newVal;
          if (this.activeTab === 'schedule') {
            this.getScheduleList();
          } else {
            this.getMemberList();
          }
        }
      }
    }
  },
  created() {
    this.getMemberList(); // 默认加载班组成员管理
  },
  methods: {
    /** Tab切换处理 */
    handleTabClick(tab) {
      if (tab.name === 'schedule') {
        this.getScheduleList();
      } else if (tab.name === 'member') {
        this.getMemberList();
      }
    },

    // ========== 班组成员管理方法 ==========
    /** 查询班组成员列表 */
    getMemberList() {
      this.memberLoading = true;
      listTeammember(this.memberQueryParams).then(response => {
        console.log(response);
        this.memberList = response.data.list;
        this.memberTotal = response.data.total;
        this.memberLoading = false;
      });
    },

    // 班组成员管理 - 用户选择
    memberUserSelected(rows) {
      console.log(rows);
      if (rows != null) {
        const promises = rows.map(user => {
          const formData = {
            teamId: this.teamId,
            userId: user.id,
            userName: user.username,
            nickName: user.nickname,
            tel: user.mobile,
            shiftInfo: '2' // 默认设为未排班
          };
          return addTeammember(formData);
        });

        Promise.all(promises).then(() => {
          this.getMemberList();
          this.$modal.msgSuccess('新增成功');
        });
      }
    },

    // 班组成员管理 - 删除
    handleMemberDelete(row) {
      const memberIds = row.id || this.memberIds;
      this.$modal
        .confirm('是否确认删除班组成员？')
        .then(function () {
          return delTeammember(memberIds);
        })
        .then(() => {
          this.getMemberList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },

    // 班组成员管理 - 导出
    handleMemberExport() {
      this.download(
        'mes/cal/teammember/export',
        {
          ...this.memberQueryParams,
        },
        `teammember_${new Date().getTime()}.xlsx`,
      );
    },

    // 班组成员管理 - 选择变化
    handleMemberSelectionChange(selection) {
      this.memberIds = selection.map(item => item.id);
      this.memberSingle = selection.length !== 1;
      this.memberMultiple = !selection.length;
    },

    // 班组成员管理 - 新增
    handleMemberAdd() {
      this.$refs.memberUserSelect.showFlag = true;
    },

    // 班组成员管理 - 班次修改
    handleMemberShiftChange(row) {
      updateTeammember(row).then(() => {
        this.$modal.msgSuccess('修改成功');
      });
    },

    // ========== 排班管理方法 ==========
    /** 查询排班列表 */
    getScheduleList() {
      this.scheduleLoading = true;
      listTeammember(this.scheduleQueryParams).then(response => {
        console.log(response);
        // 确保每个成员都有必要的属性，默认设为未排班状态
        this.scheduleList = response.data.list.map(member => ({
          ...member,
          currentShift: '2', // 默认设为未排班
          hasSchedule: false,
          scheduleId: null
        }));
        this.scheduleTotal = response.data.total;
        this.scheduleLoading = false;
        if (!this.scheduleDate) {
          this.scheduleDate = new Date().toISOString().slice(0, 10);
        }
        this.loadScheduleData();
      });
    },

    // 日期变更处理
    handleDateChange(date) {
      if (date) {
        this.loadScheduleData();
      } else {
        // 清除排班数据，重置为未排班状态
        this.scheduleList.forEach(member => {
          member.currentShift = '2'; // 重置为未排班
          member.hasSchedule = false;
          member.scheduleId = null;
        });
      }
    },

    // 加载排班数据
    async loadScheduleData() {
      if (!this.scheduleDate || !this.teamId) return;
      try {
        const scheduleResponse = await listTeamSchedule({
          teamId: this.teamId,
          workDate: this.scheduleDate,
        });

        const schedules = Array.isArray(scheduleResponse.data.list) ? scheduleResponse.data.list : [];
        console.log("schedules: ", schedules)
        const scheduleMap = new Map();
        schedules.forEach(item => {
          scheduleMap.set(item.userId, item);
        });

        console.log("schedules: ", schedules)

        // 合并排班数据到成员列表
        this.scheduleList = this.scheduleList.map(member => {
          if (!member) return member;

          const schedule = scheduleMap.get(member.userId);
          if (schedule) {
            return {
              ...member,
              currentShift: schedule.shiftType,
              hasSchedule: true,
              scheduleId: schedule.id
            };
          } else {
            return {
              ...member,
              currentShift: '2', // 未排班状态
              hasSchedule: false,
              scheduleId: null
            };
          }
        });
      } catch (error) {
        console.error('加载排班数据失败:', error);
        this.$modal.msgError('加载排班数据失败');
      }
    },

    // 班次变更处理
    async handleShiftChange(row, shiftType) {
      if (!row || !shiftType) return;

      // 如果选择的是"未排班"，则清除排班
      if (shiftType === '2') {
        await this.handleRemoveSchedule(row);
        return;
      }

      try {
        const scheduleData = {
          teamId: this.teamId,
          userId: row.userId,
          workDate: this.scheduleDate,
          shiftType: shiftType
        };

        if (row.scheduleId) {
          // 更新现有排班
          scheduleData.id = row.scheduleId;
          await updateTeamSchedule(scheduleData);
        } else {
          // 新增排班
          await createTeamSchedule(scheduleData);
        }

        this.$modal.msgSuccess('班次设置成功');
        // 重新加载排班数据，确保与服务器同步
        this.loadScheduleData();
      } catch (error) {
        console.error('设置班次失败:', error);
        this.$modal.msgError('设置班次失败');
        // 恢复原值
        this.loadScheduleData();
      }
    },

    // 清除单个排班
    async handleRemoveSchedule(row) {
      try {
        console.log("row: ", row)
        if (row.scheduleId) {
          await deleteTeamSchedule(row.scheduleId);
        }
        // 重置为未排班状态
        row.currentShift = '2';
        row.hasSchedule = false;
        row.scheduleId = null;

        this.$modal.msgSuccess('清除成功');
        // 重新加载数据确保同步
        this.loadScheduleData();
      } catch (error) {
        console.error('清除排班失败:', error);
        this.$modal.msgError('清除排班失败');
      }
    },

    // 清除全部排班
    async handleClearAllSchedule() {
      try {
        if (!this.scheduleList.length) {
          return;
        }

        const scheduleIds = this.scheduleList
          .filter(member => member.scheduleId)
          .map(member => member.scheduleId);

        if (scheduleIds.length === 0) {
          this.$modal.msgWarning('没有可清除的排班记录');
          return;
        }

        await this.$modal.confirm('确定要清除所有成员的排班吗？');

        // 批量删除排班记录
        for (const scheduleId of scheduleIds) {
          await deleteTeamSchedule(scheduleId);
        }

        // 重置所有成员为未排班状态
        this.scheduleList.forEach(member => {
          member.currentShift = '2';
          member.hasSchedule = false;
          member.scheduleId = null;
        });

        this.$modal.msgSuccess('清除全部排班成功');
      } catch (error) {
        if (error !== 'cancel') {
          console.error('清除全部排班失败:', error);
          this.$modal.msgError('清除全部排班失败');
        }
      }
    },

    // 排班管理 - 用户选择
    userSelected(rows) {
      console.log(rows);
      if (rows != null) {
        const promises = rows.map(user => {
          const formData = {
            teamId: this.teamId,
            userId: user.id,
            userName: user.username,
            nickName: user.nickname,
            tel: user.mobile,
            shiftInfo: '2' // 默认设为未排班
          };
          return addTeammember(formData);
        });

        Promise.all(promises).then(() => {
          this.getScheduleList();
          this.$modal.msgSuccess('新增成功');
        });
      }
    },

    // 排班管理 - 删除
    handleDelete(row) {
      const memberIds = row.id || this.scheduleIds;
      this.$modal
        .confirm('是否确认删除班组成员？')
        .then(function () {
          return delTeammember(memberIds);
        })
        .then(() => {
          this.getScheduleList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },

    // 排班管理 - 导出
    handleExport() {
      this.download(
        'mes/cal/teammember/export',
        {
          ...this.scheduleQueryParams,
        },
        `teammember_${new Date().getTime()}.xlsx`,
      );
    },

    // 排班管理 - 选择变化
    handleSelectionChange(selection) {
      this.scheduleIds = selection.map(item => item.id);
      this.scheduleSingle = selection.length !== 1;
      this.scheduleMultiple = !selection.length;
    },

    // 排班管理 - 新增
    handleAdd() {
      this.$refs.userSelect.showFlag = true;
    },

    // ========== 通用方法 ==========
    // 根据数据字典值获取标签
    getDictLabel(dictType, value) {
      const dictArray = this.dict.type[dictType];
      if (dictArray) {
        const item = dictArray.find(item => item.value === value);
        return item ? item.label : value;
      }
      return value;
    },

    // 获取班次标签类型
    getShiftTagType(shiftValue) {
      switch (shiftValue) {
        case '0': return 'success'; // 白班
        case '1': return 'warning'; // 夜班
        case '2': return 'info';    // 未排班
        default: return 'info';
      }
    },

    // 搜索按钮操作
    handleQuery() {
      if (this.activeTab === 'schedule') {
        this.scheduleQueryParams.pageNo = 1;
        this.getScheduleList();
      } else {
        this.memberQueryParams.pageNo = 1;
        this.getMemberList();
      }
    },

    // 重置按钮操作
    resetQuery() {
      if (this.activeTab === 'schedule') {
        this.resetForm('queryForm');
        this.handleQuery();
      }
    },
  },
};
</script>

<style scoped>
.app-container {
  padding: 30px;
}
</style>
