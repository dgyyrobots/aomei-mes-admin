<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="employeeRealname">
        <el-input v-model="queryParams.employeeRealname" placeholder="请输入姓名" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="性别" prop="employeeSex">
        <el-select v-model="queryParams.employeeSex" placeholder="请选择性别" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_USER_SEX)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="婚姻状态" prop="employeeMarried">
        <el-select v-model="queryParams.employeeMarried" placeholder="请选择婚姻状态" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.HR_EMPLOYEE_MARRIED)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="政治身份" prop="employeePolitics">
        <el-input v-model="queryParams.employeePolitics" placeholder="请输入政治身份" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="祖籍" prop="employeeNativeplace">
        <el-input v-model="queryParams.employeeNativeplace" placeholder="请输入祖籍" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="民族" prop="ethnic">
        <el-input v-model="queryParams.ethnic" placeholder="请输入民族" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="生日" prop="employeeBirthday">
        <el-input v-model="queryParams.employeeBirthday" placeholder="请输入生日" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="身高" prop="employeeHeight">
        <el-input v-model="queryParams.employeeHeight" placeholder="请输入身高" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="户籍省份id" prop="householdProvinceId">
        <el-input v-model="queryParams.householdProvinceId" placeholder="请输入户籍省份id" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="户籍省份" prop="householdProvinceName">
        <el-input v-model="queryParams.householdProvinceName" placeholder="请输入户籍省份" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="国籍" prop="householdNature">
        <el-input v-model="queryParams.householdNature" placeholder="请输入国籍" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="户籍市id" prop="householdCityId">
        <el-input v-model="queryParams.householdCityId" placeholder="请输入户籍市id" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="户籍地址" prop="householdAddress">
        <el-input v-model="queryParams.householdAddress" placeholder="请输入户籍地址" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="户籍市" prop="householdCityName">
        <el-input v-model="queryParams.householdCityName" placeholder="请输入户籍市" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="体重" prop="employeeWeight">
        <el-input v-model="queryParams.employeeWeight" placeholder="请输入体重" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="血型" prop="bloodtype">
        <el-select v-model="queryParams.bloodtype" placeholder="请选择血型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.BLOOD_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="毕业院校" prop="educationName">
        <el-input v-model="queryParams.educationName" placeholder="请输入毕业院校" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-input v-model="queryParams.education" placeholder="请输入学历" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="邮箱" prop="emails">
        <el-input v-model="queryParams.emails" placeholder="请输入邮箱" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="qq" prop="qq">
        <el-input v-model="queryParams.qq" placeholder="请输入qq" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="身份号" prop="idNo">
        <el-input v-model="queryParams.idNo" placeholder="请输入身份号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="工资卡姓名" prop="cardName">
        <el-input v-model="queryParams.cardName" placeholder="请输入工资卡姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="工资卡号" prop="cardNo">
        <el-input v-model="queryParams.cardNo" placeholder="请输入工资卡号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工资卡开户行" prop="cardAddress">
        <el-input v-model="queryParams.cardAddress" placeholder="请输入工资卡开户行" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="现居住省份id" prop="nowProvinceId">
        <el-input v-model="queryParams.nowProvinceId" placeholder="请输入现居住省份id" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="现居住省份" prop="nowProvinceName">
        <el-input v-model="queryParams.nowProvinceName" placeholder="请输入现居住省份" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="现居住地址" prop="nowProvinceAddress">
        <el-input v-model="queryParams.nowProvinceAddress" placeholder="请输入现居住地址" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="现居住市id" prop="nowCityId">
        <el-input v-model="queryParams.nowCityId" placeholder="请输入现居住市id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="现居住市" prop="nowCityName">
        <el-input v-model="queryParams.nowCityName" placeholder="请输入现居住市" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="紧急联系人" prop="urgentNameOne">
        <el-input v-model="queryParams.urgentNameOne" placeholder="请输入紧急联系人" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="紧急联系人电话" prop="urgentNameOnePhone">
        <el-input v-model="queryParams.urgentNameOnePhone" placeholder="请输入紧急联系人电话" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="性格" prop="character">
        <el-input v-model="queryParams.character" placeholder="请输入性格" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="爱好" prop="specialty">
        <el-input v-model="queryParams.specialty" placeholder="请输入爱好" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.EMPLOYEE_BASIC_STATUS)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="备注" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="请输入备注" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="部门id" prop="depId">
        <el-input v-model="queryParams.depId" placeholder="请输入部门id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="部门" prop="depName">
        <el-input v-model="queryParams.depName" placeholder="请输入部门" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="职位id" prop="positionId">
        <el-input v-model="queryParams.positionId" placeholder="请输入职位id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="职位" prop="positionName">
        <el-input v-model="queryParams.positionName" placeholder="请输入职位" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="花名" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入花名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="毕业后首次缴纳社保" prop="socialPaymentTime">
        <el-date-picker v-model="queryParams.socialPaymentTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="阴历生日" prop="dateOfBirthTime">
        <el-date-picker v-model="queryParams.dateOfBirthTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item> -->
      <el-form-item label="工作年限" prop="workAge">
        <el-input v-model="queryParams.workAge" placeholder="请输入工作年限" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="职称" prop="workLevel">
        <el-input v-model="queryParams.workLevel" placeholder="请输入职称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="入职时间" prop="entryTime">
        <el-date-picker v-model="queryParams.entryTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="转正时间" prop="workerTime">
        <el-date-picker v-model="queryParams.workerTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="入职工作区域" prop="workName" label-width="96">
        <el-input v-model="queryParams.workName" placeholder="请输入入职工作区域" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <!-- <el-form-item label="租户id" prop="tenandId">
        <el-input v-model="queryParams.tenandId" placeholder="请输入租户id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="varchar" prop="ethnic">
        <el-input v-model="queryParams.ethnic" placeholder="请输入varchar" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hr:employee-basic:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['hr:employee-basic:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="员工id" align="center" prop="id" />
      <!-- <el-table-column label="员工id" align="center" prop="employeeId" /> -->
      <!-- <el-table-column label="形象照" align="center" prop="employeePhoto" /> -->
      <el-table-column label="姓名" align="center" prop="employeeRealname" />
      <el-table-column label="性别" align="center" prop="employeeSex">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="scope.row.employeeSex" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="婚姻状态" align="center" prop="employeeMarried">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.HR_EMPLOYEE_MARRIED" :value="scope.row.employeeMarried" />
        </template>
      </el-table-column> -->
      <el-table-column label="政治身份" align="center" prop="employeePolitics" />
      <!-- <el-table-column label="祖籍" align="center" prop="employeeNativeplace" /> -->
      <el-table-column label="民族" align="center" prop="ethnic" />
      <el-table-column label="生日" align="center" prop="employeeBirthday">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.employeeBirthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="身高" align="center" prop="employeeHeight" /> -->
      <!-- <el-table-column label="户籍省份id" align="center" prop="householdProvinceId" /> -->
      <!-- <el-table-column label="户籍省份" align="center" prop="householdProvinceName" /> -->
      <!-- <el-table-column label="国籍" align="center" prop="householdNature" /> -->
      <!-- <el-table-column label="户籍市id" align="center" prop="householdCityId" /> -->
      <el-table-column label="户籍地址" align="center" prop="householdAddress" />
      <!-- <el-table-column label="户籍市" align="center" prop="householdCityName" /> -->
      <!-- <el-table-column label="体重" align="center" prop="employeeWeight" /> -->
      <!-- <el-table-column label="血型" align="center" prop="bloodtype">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.BLOOD_TYPE" :value="scope.row.bloodtype" />
        </template>
      </el-table-column> -->
      <el-table-column label="毕业院校" align="center" prop="educationName" />
      <el-table-column label="学历" align="center" prop="education" />
      <!-- <el-table-column label="邮箱" align="center" prop="emails" /> -->
      <!-- <el-table-column label="qq" align="center" prop="qq" /> -->
      <!-- <el-table-column label="身份号" align="center" prop="idNo" /> -->
      <el-table-column label="手机号" align="center" prop="phone" />
      <!-- <el-table-column label="工资卡姓名" align="center" prop="cardName" /> -->
      <!-- <el-table-column label="工资卡号" align="center" prop="cardNo" /> -->
      <!-- <el-table-column label="工资卡开户行" align="center" prop="cardAddress" /> -->
      <!-- <el-table-column label="现居住省份id" align="center" prop="nowProvinceId" /> -->
      <!-- <el-table-column label="现居住省份" align="center" prop="nowProvinceName" /> -->
      <!-- <el-table-column label="现居住地址" align="center" prop="nowProvinceAddress" /> -->
      <!-- <el-table-column label="现居住市id" align="center" prop="nowCityId" /> -->
      <!-- <el-table-column label="现居住市" align="center" prop="nowCityName" /> -->
      <!-- <el-table-column label="紧急联系人" align="center" prop="urgentNameOne" /> -->
      <!-- <el-table-column label="紧急联系人电话" align="center" prop="urgentNameOnePhone" /> -->
      <!-- <el-table-column label="性格" align="center" prop="character" /> -->
      <!-- <el-table-column label="爱好" align="center" prop="specialty" /> -->
      <!-- <el-table-column label="状态" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.EMPLOYEE_BASIC_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <!-- <el-table-column label="部门id" align="center" prop="depId" /> -->
      <el-table-column label="部门" align="center" prop="depName" />
      <!-- <el-table-column label="职位id" align="center" prop="positionId" /> -->
      <el-table-column label="职位" align="center" prop="positionName" />
      <!-- <el-table-column label="花名" align="center" prop="nickName" /> -->
      <!-- <el-table-column label="毕业后首次缴纳社保" align="center" prop="socialPaymentTime" /> -->
      <!-- <el-table-column label="阴历生日" align="center" prop="dateOfBirthTime" /> -->
      <el-table-column label="工作年限" align="center" prop="workAge" />
      <el-table-column label="职称" align="center" prop="workLevel" />
      <el-table-column label="入职时间" align="center" prop="entryTime">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.entryTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="转正时间" align="center" prop="workerTime">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.workerTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职工作区域" align="center" prop="workName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="租户id" align="center" prop="tenandId" /> -->
      <!-- <el-table-column label="varchar" align="center" prop="ethnic" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template v-slot="scope">
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['hr:employee-basic:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hr:employee-basic:delete']">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="形象照">
          <imageUpload v-model="form.employeePhoto" />
        </el-form-item>
        <el-form-item label="姓名" prop="employeeRealname">
          <el-input v-model="form.employeeRealname" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="employeeSex">
          <el-radio-group v-model="form.employeeSex">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.SYSTEM_USER_SEX)" :key="dict.value"
              :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="婚姻状态" prop="employeeMarried">
          <el-select v-model="form.employeeMarried" placeholder="请选择婚姻状态">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.HR_EMPLOYEE_MARRIED)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="政治身份" prop="employeePolitics">
          <el-input v-model="form.employeePolitics" placeholder="请输入政治身份" />
        </el-form-item>
        <el-form-item label="祖籍" prop="employeeNativeplace">
          <el-input v-model="form.employeeNativeplace" placeholder="请输入祖籍" />
        </el-form-item>
        <el-form-item label="民族" prop="ethnic">
          <el-input v-model="form.ethnic" placeholder="请输入民族" />
        </el-form-item>
        <el-form-item label="生日" prop="employeeBirthday">
          <el-input v-model="form.employeeBirthday" placeholder="请输入生日" />
        </el-form-item>
        <el-form-item label="身高" prop="employeeHeight">
          <el-input v-model="form.employeeHeight" placeholder="请输入身高" />
        </el-form-item>
        <el-form-item label="户籍省份id" prop="householdProvinceId">
          <el-input v-model="form.householdProvinceId" placeholder="请输入户籍省份id" />
        </el-form-item>
        <el-form-item label="户籍省份" prop="householdProvinceName">
          <el-input v-model="form.householdProvinceName" placeholder="请输入户籍省份" />
        </el-form-item>
        <el-form-item label="国籍" prop="householdNature">
          <el-input v-model="form.householdNature" placeholder="请输入国籍" />
        </el-form-item>
        <el-form-item label="户籍市id" prop="householdCityId">
          <el-input v-model="form.householdCityId" placeholder="请输入户籍市id" />
        </el-form-item>
        <el-form-item label="户籍地址" prop="householdAddress">
          <el-input v-model="form.householdAddress" placeholder="请输入户籍地址" />
        </el-form-item>
        <el-form-item label="户籍市" prop="householdCityName">
          <el-input v-model="form.householdCityName" placeholder="请输入户籍市" />
        </el-form-item>
        <el-form-item label="体重" prop="employeeWeight">
          <el-input v-model="form.employeeWeight" placeholder="请输入体重" />
        </el-form-item>
        <el-form-item label="血型" prop="bloodtype">
          <el-select v-model="form.bloodtype" placeholder="请选择血型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.BLOOD_TYPE)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="毕业院校" prop="educationName">
          <el-input v-model="form.educationName" placeholder="请输入毕业院校" />
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-input v-model="form.education" placeholder="请输入学历" />
        </el-form-item>
        <el-form-item label="邮箱" prop="emails">
          <el-input v-model="form.emails" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="form.qq" placeholder="请输入qq" />
        </el-form-item>
        <el-form-item label="身份号" prop="idNo">
          <el-input v-model="form.idNo" placeholder="请输入身份号" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="工资卡姓名" prop="cardName">
          <el-input v-model="form.cardName" placeholder="请输入工资卡姓名" />
        </el-form-item>
        <el-form-item label="工资卡号" prop="cardNo">
          <el-input v-model="form.cardNo" placeholder="请输入工资卡号" />
        </el-form-item>
        <el-form-item label="工资卡开户行" prop="cardAddress">
          <el-input v-model="form.cardAddress" placeholder="请输入工资卡开户行" />
        </el-form-item>
        <el-form-item label="现居住省份id" prop="nowProvinceId">
          <el-input v-model="form.nowProvinceId" placeholder="请输入现居住省份id" />
        </el-form-item>
        <el-form-item label="现居住省份" prop="nowProvinceName">
          <el-input v-model="form.nowProvinceName" placeholder="请输入现居住省份" />
        </el-form-item>
        <el-form-item label="现居住地址" prop="nowProvinceAddress">
          <el-input v-model="form.nowProvinceAddress" placeholder="请输入现居住地址" />
        </el-form-item>
        <el-form-item label="现居住市id" prop="nowCityId">
          <el-input v-model="form.nowCityId" placeholder="请输入现居住市id" />
        </el-form-item>
        <el-form-item label="现居住市" prop="nowCityName">
          <el-input v-model="form.nowCityName" placeholder="请输入现居住市" />
        </el-form-item>
        <el-form-item label="紧急联系人" prop="urgentNameOne">
          <el-input v-model="form.urgentNameOne" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="urgentNameOnePhone">
          <el-input v-model="form.urgentNameOnePhone" placeholder="请输入紧急联系人电话" />
        </el-form-item>
        <el-form-item label="性格" prop="character">
          <el-input v-model="form.character" placeholder="请输入性格" />
        </el-form-item>
        <el-form-item label="爱好" prop="specialty">
          <el-input v-model="form.specialty" placeholder="请输入爱好" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.EMPLOYEE_BASIC_STATUS)" :key="dict.value"
              :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="部门id" prop="depId">
          <el-input v-model="form.depId" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item label="部门" prop="depName">
          <el-input v-model="form.depName" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="职位id" prop="positionId">
          <el-input v-model="form.positionId" placeholder="请输入职位id" />
        </el-form-item>
        <el-form-item label="职位" prop="positionName">
          <el-input v-model="form.positionName" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="花名" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入花名" />
        </el-form-item>
        <el-form-item label="头像">
          <imageUpload v-model="form.nickImg" />
        </el-form-item>
        <el-form-item label="毕业后首次缴纳社保" prop="socialPaymentTime">
          <el-date-picker clearable v-model="form.socialPaymentTime" type="date" value-format="timestamp"
            placeholder="选择毕业后首次缴纳社保" />
        </el-form-item>
        <el-form-item label="阴历生日" prop="dateOfBirthTime">
          <el-date-picker clearable v-model="form.dateOfBirthTime" type="date" value-format="timestamp"
            placeholder="选择阴历生日" />
        </el-form-item>
        <el-form-item label="工作年限" prop="workAge">
          <el-input v-model="form.workAge" placeholder="请输入工作年限" />
        </el-form-item>
        <el-form-item label="职称" prop="workLevel">
          <el-input v-model="form.workLevel" placeholder="请输入职称" />
        </el-form-item>
        <el-form-item label="入职时间" prop="entryTime">
          <el-date-picker clearable v-model="form.entryTime" type="date" value-format="timestamp" placeholder="选择入职时间" />
        </el-form-item>
        <el-form-item label="转正时间" prop="workerTime">
          <el-date-picker clearable v-model="form.workerTime" type="date" value-format="timestamp" placeholder="选择转正时间" />
        </el-form-item>
        <el-form-item label="入职工作区域" prop="workName">
          <el-input v-model="form.workName" placeholder="请输入入职工作区域" />
        </el-form-item>
        <el-form-item label="租户id" prop="tenandId">
          <el-input v-model="form.tenandId" placeholder="请输入租户id" />
        </el-form-item>
        <el-form-item label="varchar" prop="varchar">
          <el-input v-model="form.varchar" placeholder="请输入varchar" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createEmployeeBasic, updateEmployeeBasic, deleteEmployeeBasic, getEmployeeBasic, getEmployeeBasicPage, exportEmployeeBasicExcel } from '@/api/hr/employeeBasic';
import ImageUpload from '@/components/ImageUpload';

export default {
  name: 'EmployeeBasic',
  components: {
    ImageUpload,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 员工基本信息列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        employeePhoto: null,
        employeeRealname: null,
        employeeSex: null,
        employeeMarried: null,
        employeePolitics: null,
        employeeNativeplace: null,
        ethnic: null,
        employeeBirthday: null,
        employeeHeight: null,
        householdProvinceId: null,
        householdProvinceName: null,
        householdNature: null,
        householdCityId: null,
        householdAddress: null,
        householdCityName: null,
        employeeWeight: null,
        bloodtype: null,
        educationName: null,
        education: null,
        emails: null,
        qq: null,
        idNo: null,
        phone: null,
        cardName: null,
        cardNo: null,
        cardAddress: null,
        nowProvinceId: null,
        nowProvinceName: null,
        nowProvinceAddress: null,
        nowCityId: null,
        nowCityName: null,
        urgentNameOne: null,
        urgentNameOnePhone: null,
        character: null,
        specialty: null,
        status: null,
        remark: null,
        depId: null,
        depName: null,
        positionId: null,
        positionName: null,
        nickName: null,
        socialPaymentTime: [],
        dateOfBirthTime: [],
        workAge: null,
        workLevel: null,
        entryTime: [],
        workerTime: [],
        workName: null,
        createTime: [],
        tenandId: null,
        varchar: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        employeePhoto: [{ required: true, message: '形象照不能为空', trigger: 'blur' }],
        employeeRealname: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        employeeSex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        employeeMarried: [{ required: true, message: '婚姻状态不能为空', trigger: 'change' }],
        employeePolitics: [{ required: true, message: '政治身份不能为空', trigger: 'blur' }],
        employeeNativeplace: [{ required: true, message: '祖籍不能为空', trigger: 'blur' }],
        ethnic: [{ required: true, message: '民族不能为空', trigger: 'blur' }],
        employeeBirthday: [{ required: true, message: '生日不能为空', trigger: 'blur' }],
        employeeHeight: [{ required: true, message: '身高不能为空', trigger: 'blur' }],
        householdProvinceId: [{ required: true, message: '户籍省份id不能为空', trigger: 'blur' }],
        householdProvinceName: [{ required: true, message: '户籍省份不能为空', trigger: 'blur' }],
        householdNature: [{ required: true, message: '国籍不能为空', trigger: 'blur' }],
        householdCityId: [{ required: true, message: '户籍市id不能为空', trigger: 'blur' }],
        householdAddress: [{ required: true, message: '户籍地址不能为空', trigger: 'blur' }],
        householdCityName: [{ required: true, message: '户籍市不能为空', trigger: 'blur' }],
        employeeWeight: [{ required: true, message: '体重不能为空', trigger: 'blur' }],
        bloodtype: [{ required: true, message: '血型不能为空', trigger: 'change' }],
        educationName: [{ required: true, message: '毕业院校不能为空', trigger: 'blur' }],
        education: [{ required: true, message: '学历不能为空', trigger: 'blur' }],
        emails: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        qq: [{ required: true, message: 'qq不能为空', trigger: 'blur' }],
        idNo: [{ required: true, message: '身份号不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        cardName: [{ required: true, message: '工资卡姓名不能为空', trigger: 'blur' }],
        cardNo: [{ required: true, message: '工资卡号不能为空', trigger: 'blur' }],
        cardAddress: [{ required: true, message: '工资卡开户行不能为空', trigger: 'blur' }],
        nowProvinceId: [{ required: true, message: '现居住省份id不能为空', trigger: 'blur' }],
        nowProvinceName: [{ required: true, message: '现居住省份不能为空', trigger: 'blur' }],
        nowProvinceAddress: [{ required: true, message: '现居住地址不能为空', trigger: 'blur' }],
        nowCityId: [{ required: true, message: '现居住市id不能为空', trigger: 'blur' }],
        nowCityName: [{ required: true, message: '现居住市不能为空', trigger: 'blur' }],
        urgentNameOne: [{ required: true, message: '紧急联系人不能为空', trigger: 'blur' }],
        urgentNameOnePhone: [{ required: true, message: '紧急联系人电话不能为空', trigger: 'blur' }],
        character: [{ required: true, message: '性格不能为空', trigger: 'blur' }],
        specialty: [{ required: true, message: '爱好不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        depId: [{ required: true, message: '部门id不能为空', trigger: 'blur' }],
        depName: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        positionId: [{ required: true, message: '职位id不能为空', trigger: 'blur' }],
        positionName: [{ required: true, message: '职位不能为空', trigger: 'blur' }],
        nickName: [{ required: true, message: '花名不能为空', trigger: 'blur' }],
        nickImg: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
        socialPaymentTime: [{ required: true, message: '毕业后首次缴纳社保不能为空', trigger: 'blur' }],
        dateOfBirthTime: [{ required: true, message: '阴历生日不能为空', trigger: 'blur' }],
        workAge: [{ required: true, message: '工作年限不能为空', trigger: 'blur' }],
        workLevel: [{ required: true, message: '职称不能为空', trigger: 'blur' }],
        entryTime: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }],
        workerTime: [{ required: true, message: '转正时间不能为空', trigger: 'blur' }],
        workName: [{ required: true, message: '入职工作区域不能为空', trigger: 'blur' }],
        tenandId: [{ required: true, message: '租户id不能为空', trigger: 'blur' }],
        varchar: [{ required: true, message: 'varchar不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getEmployeeBasicPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        employeeId: undefined,
        employeePhoto: undefined,
        employeeRealname: undefined,
        employeeSex: undefined,
        employeeMarried: undefined,
        employeePolitics: undefined,
        employeeNativeplace: undefined,
        ethnic: undefined,
        employeeBirthday: undefined,
        employeeHeight: undefined,
        householdProvinceId: undefined,
        householdProvinceName: undefined,
        householdNature: undefined,
        householdCityId: undefined,
        householdAddress: undefined,
        householdCityName: undefined,
        employeeWeight: undefined,
        bloodtype: undefined,
        educationName: undefined,
        education: undefined,
        emails: undefined,
        qq: undefined,
        idNo: undefined,
        phone: undefined,
        cardName: undefined,
        cardNo: undefined,
        cardAddress: undefined,
        nowProvinceId: undefined,
        nowProvinceName: undefined,
        nowProvinceAddress: undefined,
        nowCityId: undefined,
        nowCityName: undefined,
        urgentNameOne: undefined,
        urgentNameOnePhone: undefined,
        character: undefined,
        specialty: undefined,
        status: undefined,
        remark: undefined,
        depId: undefined,
        depName: undefined,
        positionId: undefined,
        positionName: undefined,
        nickName: undefined,
        nickImg: undefined,
        socialPaymentTime: undefined,
        dateOfBirthTime: undefined,
        workAge: undefined,
        workLevel: undefined,
        entryTime: undefined,
        workerTime: undefined,
        workName: undefined,
        tenandId: undefined,
        id: undefined,
        varchar: undefined,
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加员工基本信息';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const employeeId = row.employeeId;
      getEmployeeBasic(employeeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改员工基本信息';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.employeeId != null) {
          updateEmployeeBasic(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createEmployeeBasic(this.form).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const employeeId = row.employeeId;
      this.$modal
        .confirm('是否确认删除员工基本信息编号为"' + employeeId + '"的数据项?')
        .then(function () {
          return deleteEmployeeBasic(employeeId);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有员工基本信息数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportEmployeeBasicExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '员工基本信息.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
