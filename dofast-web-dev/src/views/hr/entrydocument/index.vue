<template>
  <div style="border: 15px solid #f7f7f7; ">
    <div class="top">
      <template v-for="(item, i) in arr">
        <div :key="i" :class="index == i ? 'active' : ''" @click="indexs(i)">
          <span class="tb">{{ i + 1 }}</span>
          <span style="margin-bottom: 10px;font-weight: bold;">
            {{ item.title }}
          </span>
          <span>
            {{ item.text }}
          </span>
        </div>
      </template>
    </div>

    <div class="form0" v-show="index == 0"
      style="background-color: #fff;margin-top: 10px; padding-left:20px ; overflow: hidden;">
      <span style="padding: 30px 0; display: block;">基本信息</span>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-form-item label="形象照" prop="employeePhoto">
          <imageUpload v-model="form.employeePhoto" />
        </el-form-item>
        <el-form-item label="头像" prop="nickImg">
          <imageUpload v-model="form.nickImg" />
        </el-form-item>
        <br>
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
          <!-- <el-input v-model="form.employeeBirthday" placeholder="请输入生日" /> -->
          <!-- format="yyyy 年 MM 月 dd 日" -->
          <el-date-picker v-model="form.employeeBirthday" type="date" format="yyyy 年 MM 月 dd 日" placeholder="选择生日" />
          <!-- <el-date-picker v-model="form.employeeBirthday" type="date" placeholder="选择生日" format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker> -->
        </el-form-item>
        <el-form-item label="身高" prop="employeeHeight">
          <el-input v-model="form.employeeHeight" placeholder="请输入身高" />
        </el-form-item>
        <el-form-item label="户籍地址" prop="dizhijihe">
          <el-cascader v-model="form.dizhijihe" placeholder="请选择户籍地址" @change="change" :options="areaOptions"
            :props="{ label: 'name', value: 'obj' }"></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="户籍省份id" prop="householdProvinceId">
          <el-input v-model="form.householdProvinceId" placeholder="请输入户籍省份id" />
        </el-form-item> -->
        <el-form-item label="户籍省份" prop="householdProvinceName">
          <el-input v-model="form.householdProvinceName" placeholder="请输入户籍省份" />
        </el-form-item>
        <el-form-item label="户籍市" prop="householdCityName">
          <el-input v-model="form.householdCityName" placeholder="请输入户籍市" />
        </el-form-item>
        <el-form-item label="详细地址" prop="householdAddress">
          <el-input v-model="form.householdAddress" placeholder="请输入户籍详细地址" />
        </el-form-item>
        <el-form-item label="国籍" prop="householdNature">
          <el-input v-model="form.householdNature" placeholder="请输入国籍" />
        </el-form-item>
        <!-- <el-form-item label="户籍市id" prop="householdCityId">
          <el-input v-model="form.householdCityId" placeholder="请输入户籍市id" />
        </el-form-item> -->
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
        <el-form-item label="开卡姓名" prop="cardName">
          <el-input v-model="form.cardName" placeholder="请输入工资卡姓名" />
        </el-form-item>
        <el-form-item label="工资卡号" prop="cardNo">
          <el-input v-model="form.cardNo" placeholder="请输入工资卡号" />
        </el-form-item>
        <el-form-item label="开户行" prop="cardAddress">
          <el-input v-model="form.cardAddress" placeholder="请输入工资卡开户行" />
        </el-form-item>
        <el-form-item label="现居信息" prop="dizhijihe">
          <el-cascader v-model="form.xjzdizhijihe" placeholder="请选择现居住地址" @change="change2" :options="areaOptions"
            :props="{ label: 'name', value: 'obj' }"></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="现居住省份id" prop="nowProvinceId">
          <el-input v-model="form.nowProvinceId" placeholder="请输入现居住省份id" />
        </el-form-item> -->
        <el-form-item label="现居省份" prop="nowProvinceName">
          <el-input v-model="form.nowProvinceName" placeholder="请输入现居住省份" />
        </el-form-item>
        <el-form-item label="现居住市" prop="nowCityName">
          <el-input v-model="form.nowCityName" placeholder="请输入现居住市" />
        </el-form-item>
        <el-form-item label="现居地址" prop="nowProvinceAddress">
          <el-input v-model="form.nowProvinceAddress" placeholder="请输入现居住地址" />
        </el-form-item>
        <!-- <el-form-item label="现居住市id" prop="nowCityId">
          <el-input v-model="form.nowCityId" placeholder="请输入现居住市id" />
        </el-form-item> -->

        <el-form-item label="紧急联系人" prop="urgentNameOne">
          <el-input v-model="form.urgentNameOne" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="urgentNameOnePhone">
          <el-input v-model="form.urgentNameOnePhone" placeholder="请输入紧急联系人电话" />
        </el-form-item>
        <el-form-item label="性格" prop="chara">
          <el-input v-model="form.chara" placeholder="请输入性格" />
        </el-form-item>
        <el-form-item label="爱好" prop="specialty">
          <el-input v-model="form.specialty" placeholder="请输入爱好" />
        </el-form-item>
        <el-form-item label="状态" prop="stus">
          <el-radio-group v-model="form.stus">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.EMPLOYEE_BASIC_STATUS)" :key="dict.value"
              :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="部门" prop="depId">
          <treeselect v-model="form.depId" :options="deptOptions" :show-count="true" :clearable="false"
            placeholder="请选择部门" :normalizer="normalizer" style="width: 200px;" />
        </el-form-item>
        <!-- <el-form-item label="部门id" prop="depId"> -->
        <!-- <el-input v-model="form.depId" placeholder="请输入部门id" /> -->
        <!-- </el-form-item> -->
        <!-- <el-form-item label="部门" prop="depName">
          <el-input v-model="form.depName" placeholder="请输入部门" />
        </el-form-item> -->
        <!-- <el-form-item label="职位id" prop="positionId">
          <el-input v-model="form.positionId" placeholder="请输入职位id" />
        </el-form-item> -->
        <!-- <el-form-item label="职位" prop="positionName">
          <el-input v-model="form.positionName" placeholder="请输入职位" />
        </el-form-item> -->
        <el-form-item label="职位" prop="positionId">
          <el-select v-model="form.positionId" placeholder="请选择" @change="change4">
            <el-option v-for="item in postOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="花名" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入花名" />
        </el-form-item>
        <el-form-item label="首次缴纳社保" prop="socialPaymentTime">
          <el-date-picker clearable v-model="form.socialPaymentTime" type="date" format="yyyy 年 MM 月 dd 日"
            placeholder="选择毕业后首次缴纳社保" />
        </el-form-item>
        <el-form-item label="阴历生日" prop="dateOfBirthTime">
          <el-date-picker clearable v-model="form.dateOfBirthTime" type="date" format="yyyy 年 MM 月 dd 日"
            placeholder="选择阴历生日" />
        </el-form-item>
        <el-form-item label="工作年限" prop="workAge">
          <el-input v-model="form.workAge" placeholder="请输入工作年限" />
        </el-form-item>
        <el-form-item label="职称" prop="workLevel">
          <el-input v-model="form.workLevel" placeholder="请输入职称" />
        </el-form-item>
        <el-form-item label="入职时间" prop="entryTime">
          <el-date-picker clearable v-model="form.entryTime" type="date" format="yyyy 年 MM 月 dd 日" placeholder="选择入职时间" />
        </el-form-item>
        <el-form-item label="转正时间" prop="workerTime">
          <el-date-picker clearable v-model="form.workerTime" type="date" format="yyyy 年 MM 月 dd 日"
            placeholder="选择转正时间" />
        </el-form-item>
        <el-form-item label="工作区域" prop="workName">
          <el-input v-model="form.workName" placeholder="请输入入职工作区域" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="index++" style="margin-bottom:30px;width: 150px;" size="small">下一步</el-button>
        <el-button type="primary" style="margin-left: 50px;" @click="submitForm">保存</el-button>
      </div>
    </div>
    <div class="form1" v-show="index == 1"
      style="background-color: #fff;margin-top: 10px; padding-left:20px ; overflow: hidden;">
      <span style="padding: 30px 0; ">教育培训</span><span style="color:#d4757b">（最多添加{{ 10 }}条）</span><span
        style="color: #12840a;">已添加{{ tableDatajy.length }}条</span> <el-button type="primary"
        @click="handleAdd1">添加</el-button><br>

      <el-table :data="tableDatajy" :border="true" style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f1f2f5', margin: '30px 0' }">
        <el-table-column label="起止时间">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 起止时间
          </template>
          <templat slot-scope="{row}">
            <el-date-picker readonly :value="[row.educationStarttime, row.educationEndtime]" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" clear-icon="1" prefix-icon="1"
              value-format="timestamp" style="width: 100%;border:none">
            </el-date-picker>
          </templat>
        </el-table-column>
        <el-table-column prop="educationSchool" label="学校（培训机构）">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 学校（培训机构）<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
        <el-table-column prop="educationSpecialty" label="专业">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 专业<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
        <el-table-column prop="educationHonor" label="反映你学习或培训时得到的荣誉">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 反映你学习或培训时得到的荣誉<span
              style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>

      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="index--" style="margin-bottom:30px;width: 150px;" size="small">上一步</el-button>
        <el-button type="primary" @click="index++" style="margin-bottom:30px;width: 150px;" size="small">下一步</el-button>
      </div>
    </div>
    <div class="form2" v-show="index == 2"
      style="background-color: #fff;margin-top: 10px; padding-left:20px ; overflow: hidden;">
      <span style="padding: 30px 0; ">工作经历</span><span style="color:#d4757b">（最多添加{{ 10 }}条）</span><span
        style="color: #12840a;">已添加{{ tableDatajl.length }}条</span><el-button type="primary"
        @click="handleAdd2">添加</el-button><br>
      <el-table :data="tableDatajl" :border="true" style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f1f2f5', margin: '30px 0' }">
        <!-- <el-table-column prop="sj" label="起止时间">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 起止时间
          </template>
          <templat slot-scope="scope">
            <el-date-picker v-model="scope.row.sj" type="daterange" range-separator="-" start-placeholder="开始日期"
              end-placeholder="结束日期" clear-icon="1" prefix-icon="1" value-format="timestamp"
              style="width: 100%;border:none">
            </el-date-picker>
          </templat>
        </el-table-column> -->
        <el-table-column prop="companyName" label="公司名称">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 公司名称<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
        <el-table-column prop="treatment" label="待遇">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 待遇<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
        <el-table-column prop="treatmentPost" label="部门岗位">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 部门岗位<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
        <el-table-column prop="reasonForLeave" label="离职原因">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 离职原因<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="index--" style="margin-bottom:30px;width: 150px;" size="small">上一步</el-button>
        <el-button type="primary" @click="index++" style="margin-bottom:30px;width: 150px;" size="small">下一步</el-button>
      </div>
    </div>
    <div class="form4" v-show="index == 3"
      style="background-color: #fff;margin-top: 10px; padding-left:20px ; overflow: hidden;">
      <span style="padding: 30px 0; ">家庭及成员</span><span style="color:#d4757b">（最多添加{{ 10 }}条）</span><span
        style="color: #12840a;">已添加{{ tableDatajt.length }}条</span><el-button type="primary"
        @click="handleAdd3">添加</el-button><br>
      <el-table :data="tableDatajt" style="width: 100%" border
        :header-cell-style="{ backgroundColor: '#f1f2f5', margin: '30px 0' }">
        <el-table-column prop="familesName" label="姓名">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 姓名<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
        <el-table-column prop="familesRealtion" label="关系">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 关系<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
        <el-table-column prop="familesWorkunit" label="工作单位">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 工作单位<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
        <el-table-column prop="familesWorkplace" label="地址">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 地址<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
        <el-table-column prop="familesPhone" label="联系电话">
          <template slot="header" slot-scope="scope">
            <span style="color: red;padding-right: 5px;">*</span> 联系电话<span style="color:#d68286">(1-50个字符)</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="index--" style="margin-bottom:30px;width: 150px;" size="small">上一步</el-button>
        <el-button type="primary" @click="index++" style="margin-bottom:30px;width: 150px;" size="small">下一步</el-button>
      </div>
    </div>
    <div class="form5" v-show="index == 4"
      style="background-color: #fff;margin-top: 10px; padding-left:20px ; overflow: hidden;">
      <span style="padding: 30px 0; ">资料上传:</span><span
        style="font-size: 16px;color:#ff1f33 ;">本人承诺所提供材料均真实有效，若有虚假，愿意承担一切责任后果。</span><br>
      <el-table :data="tableData" style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f1f2f5', margin: '30px 0' }">
        <el-table-column prop="xuhao" label="序号">
             <template slot-scope="scope">
                        {{ scope.row.xuhao }}
            <span style="color: red;" v-if="scope.row.bx">*</span>
             </template>
        </el-table-column>
        <el-table-column prop="name" label="资料名称">

        </el-table-column>
        <el-table-column prop="fag" label="资料图片">
          <template slot-scope="scope">
            <div
              style="background-color: #52c41a; width: 25px; height: 25px;border-radius: 50%; display: flex;justify-content: center;align-items: center;"
              v-if="scope.row.fag">
              <i class="el-icon-check" style="color: #fff; font-weight:bold"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fag" label="资料状态">
          <template slot-scope="scope">
            <div @click="upindex(scope.row)">
              <span style="color:#c6eda3;cursor: pointer;" v-if="scope.row.fag">已上传</span>
              <el-upload name="file" :headers="headers" :limit="1" :action="uploadFileUrl" :on-success="upload" v-else>
                <span style="color:#f28081">未上传</span>
              </el-upload>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="index--" style="margin-bottom:30px;width: 150px;" size="small">上一步</el-button>
        <el-button type="primary" @click="ts">提交审核</el-button>
      </div>
    </div>
    <!-- 教育对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open1" width="500px" v-dialogDrag append-to-body>
      <el-form ref="formt1" :model="form1" :rules="rules1" label-width="80px">
        <el-form-item label="学校" prop="educationSchool">
          <el-input v-model="form1.educationSchool" placeholder="请输入学校" />
        </el-form-item>
        <el-form-item label="专业" prop="educationSpecialty">
          <el-input v-model="form1.educationSpecialty" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="所获荣誉" prop="educationHonor">
          <el-input v-model="form1.educationHonor" placeholder="请输入所获荣誉" />
        </el-form-item>
        <el-form-item label="教育开始时间" prop="educationStarttime">
          <el-date-picker clearable v-model="form1.educationStarttime" type="date" value-format="timestamp"
            placeholder="选择教育开始时间" />
        </el-form-item>
        <el-form-item label="教育结束时间" prop="educationEndtime">
          <el-date-picker clearable v-model="form1.educationEndtime" type="date" value-format="timestamp"
            placeholder="选择教育结束时间" />
        </el-form-item>
        <!-- <el-form-item label="租户id" prop="tenandId">
          <el-input v-model="form1.tenandId" placeholder="请输入租户id" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="open1 = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 工作对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open2" width="500px" v-dialogDrag append-to-body>
      <el-form ref="formt2" :model="form2" :rules="rules2" label-width="80px">
        <el-form-item label="从业公司" prop="companyName">
          <el-input v-model="form2.companyName" placeholder="请输入从业公司" />
        </el-form-item>
        <el-form-item label="从业薪资" prop="treatment">
          <el-input v-model="form2.treatment" type="number" placeholder="请输入从业薪资" />
        </el-form-item>
        <el-form-item label="担任职位" prop="treatmentPost">
          <el-input v-model="form2.treatmentPost" placeholder="请输入担任职位" />
        </el-form-item>
        <el-form-item label="离职原因" prop="reasonForLeave">
          <el-input v-model="form2.reasonForLeave" placeholder="请输入离职原因" />
        </el-form-item>
        <!-- <el-form-item label="工作开始时间" prop="educationStarttime">
          <el-date-picker clearable v-model="form2.educationStarttime" type="date" value-format="timestamp"
            placeholder="选择工作开始时间" />
        </el-form-item>
        <el-form-item label="工作结束时间" prop="educationEndtime">
          <el-date-picker clearable v-model="form2.educationEndtime" type="date" value-format="timestamp"
            placeholder="选择工作结束时间" />
        </el-form-item> -->
        <!-- <el-form-item label="租户id" prop="tenandId">
          <el-input v-model="form2.tenandId" placeholder="请输入租户id" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm2">确 定</el-button>
        <el-button @click="open2 = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 家庭成员对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open3" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form3" :model="form3" :rules="rules3" label-width="80px">
        <el-form-item label="家庭成员姓名" prop="familesName">
          <el-input v-model="form3.familesName" placeholder="请输入家庭成员姓名" />
        </el-form-item>
        <el-form-item label="家庭成员关系" prop="familesRealtion">
          <el-input v-model="form3.familesRealtion" placeholder="请输入家庭成员关系" />
        </el-form-item>
        <el-form-item label="家庭成员工作单位" prop="familesWorkunit">
          <el-input v-model="form3.familesWorkunit" placeholder="请输入家庭成员工作单位" />
        </el-form-item>
        <el-form-item label="家庭成员工作地区" prop="familesWorkplace">
          <el-input v-model="form3.familesWorkplace" placeholder="请输入家庭成员工作地区" />
        </el-form-item>
        <el-form-item label="家庭成员电话" prop="familesPhone">
          <el-input v-model="form3.familesPhone" placeholder="请输入家庭成员电话" />
        </el-form-item>
        <!-- <el-form-item label="租户id" prop="tenandId">
          <el-input v-model="form3.tenandId" placeholder="请输入租户id" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm3">确 定</el-button>
        <el-button @click="open3 = false">取 消</el-button>
      </div>
    </el-dialog>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <!-- <employeeBasic></employeeBasic>
    <employeeEducation></employeeEducation>
    <employeeFamiles></employeeFamiles>
    <employeeFile></employeeFile>
    <employeeWorkhistory></employeeWorkhistory> -->
  </div>
</template>

<script>
// import employeeBasic from '@/views/hr/employeeBasic/index.vue'
// import employeeEducation from '@/views/hr/employeeEducation/index.vue'
// import employeeFamiles from '@/views/hr/employeeFamiles/index.vue'
// import employeeFile from '@/views/hr/employeeFile/index.vue'
// import employeeWorkhistory from '@/views/hr/employeeWorkhistory/index.vue'
import Treeselect from '@riophae/vue-treeselect';
import { listSimpleDepts } from '@/api/system/dept';
import { listSimplePosts } from '@/api/system/post';
import { getAreaTree } from '@/api/system/area';
import ImageUpload from '@/components/ImageUpload';
import { getAccessToken } from '@/utils/auth';
// 基本信息
import { getEmployeeBasic, createEmployeeBasic, updateEmployeeBasic, updateEmployeeBasicmy, createEmployeeBasicmy, getEmployeeBasicmy } from '@/api/hr/employeeBasic';
// 教育
import { getEmployeeEducation, createEmployeeEducation, updateEmployeeEducation, createEmployeeEducationmy, getEmployeeEducationmy } from '@/api/hr/employeeEducation';
// 家庭
import { getEmployeeFamiles, getEmployeeFamilesmy, createEmployeeFamilesmy } from '@/api/hr/employeeFamiles';
// 工作
import { getEmployeeWorkhistory, createEmployeeWorkhistory, createEmployeeWorkhistorymy, getEmployeeWorkhistorymy } from '@/api/hr/employeeWorkhistory';
// 文件
import { getEmployeeFile, getEmployeeFilemy, createEmployeeFilemy, updateEmployeeFilemy } from '@/api/hr/employeeFile';
export default {
  name: 'EntryDocument',
  components: {
    // employeeBasic, employeeEducation, employeeFamiles, employeeFile, employeeWorkhistory,
    ImageUpload, Treeselect
  },
  data() {
    return {
      // 部门树选项
      postOptions: [],
      deptOptions: undefined,
      areaOptions: [],
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/admin-api/infra/file/upload', // 请求地址
      headers: { Authorization: 'Bearer ' + getAccessToken() }, // 设置上传的请求头部
      arr: [{ title: '基本信息', text: '请填写您的基本信息' }, { title: '教育培训', text: '请填写您接受过的教育培训', }, { title: '工作经历', text: '请填写您的以往工作经历 ', }, { title: '家庭及成员', text: '请填写您的家庭成员信息', }, { title: '资料上传', text: '新人入职需上传所需资料', }],
      index: 0,
      title: '',
      // 基本信息
      form: {
        employeeBirthday: "",
        dateOfBirthTime: "",
        socialPaymentTime: "",
        workerTime: "",
        entryTime: "",
        depName: '部门',
        positionName: '职位',
        householdAddress: ''
      },
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
        chara: [{ required: true, message: '性格不能为空', trigger: 'blur' }],
        specialty: [{ required: true, message: '爱好不能为空', trigger: 'blur' }],
        stus: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        depId: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
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
        workName: [{ required: true, message: '入职工作区域不能为空', trigger: 'blur' }]
      },
      // 资料上传
      zlid: null,
      scindex: '',
      tableData: [{
        xuhao: '1',
        name: '居民身份证原件正面',
        fag: false,
        bx: true,
        value: 'idCardFront'
      }, {
        xuhao: '2',
        name: '居民身份证原件反面',
        fag: false,
        bx: true,
        value: 'idCardBack'
      }, {
        xuhao: '3',
        name: '毕业证原件（学历）',
        fag: false,
        value: 'graduationCertificate',
        bx: true,
      }, {
        xuhao: '4',
        name: '毕业证原件（学位证书）',
        fag: false,
        value: 'degreeCertificate',
        bx: false,
      }, {
        xuhao: '5',
        name: '离职证明（应届生除外）',
        fag: false,
        value: 'resignationCertificate',
        bx: false,
      }, {
        xuhao: '6',
        name: '银行储蓄卡',
        fag: false,
        value: 'bankCard',
        bx: true,
      }, {
        xuhao: '7',
        name: '白底一寸照',
        fag: false,
        value: 'oneInchPhoto',
        bx: true,
      }, {
        xuhao: '8',
        name: '居住登记告知单/登记证',
        fag: false,
        value: 'residencePermit',
        bx: true,
      }, {
        xuhao: '9',
        name: '入职承诺书签订（扫描PDF单个上传)',
        fag: false,
        value: 'signingCommitmentLetter',
        bx: true,
      },
      {
        xuhao: '10',
        name: '专业技术职称原件、职业资格证书原件、上岗证书原件',
        fag: false,
        bx: true,
        value: 'qualification',
      }, {
        xuhao: '11',
        name: '	社会保险参保证明(应届生除外)',
        fag: false,
        bx: true,
        value: 'participationCertificate',
      }, {
        xuhao: '12',
        name: '近三个月三甲医院体检证明',
        fag: false,
        bx: true,
        value: 'physicalCertificate',
      }],
      // 家庭及成员
      tableDatajt: [{
        xm: '宋',
        gx: '无',
        dw: '无',
        dz: '无',
        dh: 123
      }],
      open3: false,
      form3: {},
      rules3: {
        familesName: [{ required: true, message: '家庭成员姓名不能为空', trigger: 'blur' }],
        familesRealtion: [{ required: true, message: '家庭成员关系不能为空', trigger: 'blur' }],
        familesWorkunit: [{ required: true, message: '家庭成员工作单位不能为空', trigger: 'blur' }],
        familesWorkplace: [{ required: true, message: '家庭成员工作地区不能为空', trigger: 'blur' }],
        familesPhone: [{ required: true, message: '家庭成员电话不能为空', trigger: 'blur' }],
        tenandId: [{ required: true, message: '租户id不能为空', trigger: 'blur' }],
      },
      // 工作经历
      tableDatajl: [{
        sj: '',
        mc: '无',
        dy: '500',
        gw: '无',
        yy: '无'
      }],
      open2: false,
      form2: {},
      rules2: {
        companyName: [{ required: true, message: '从业公司不能为空', trigger: 'blur' }],
        treatment: [{ required: true, message: '从业薪资不能为空', trigger: 'blur' }],
        treatmentPost: [{ required: true, message: '担任职位不能为空', trigger: 'blur' }],
        reasonForLeave: [{ required: true, message: '离职原因不能为空', trigger: 'blur' }],
        educationStarttime: [{ required: true, message: '工作开始时间不能为空', trigger: 'blur' }],
        educationEndtime: [{ required: true, message: '工作结束时间不能为空', trigger: 'blur' }],
        tenandId: [{ required: true, message: '租户id不能为空', trigger: 'blur' }],
      },
      // 教育
      tableDatajy: [{
        sj: '',
        xx: '无',
        zy: '无',
        ry: '无',
      }],
      open1: false,
      form1: {
        // educationId: undefined,
        // educationSchool: undefined,
        // educationSpecialty: undefined,
        // educationHonor: undefined,
        // educationStarttime: undefined,
        // educationEndtime: undefined,
        // tenandId: undefined,
        // id: undefined,
      },
      rules1: {
        educationSchool: [{ required: true, message: '学校不能为空', trigger: 'blur' }],
        educationSpecialty: [{ required: true, message: '专业不能为空', trigger: 'blur' }],
        educationHonor: [{ required: true, message: '所获荣誉不能为空', trigger: 'blur' }],
        educationStarttime: [{ required: true, message: '教育开始时间不能为空', trigger: 'blur' }],
        educationEndtime: [{ required: true, message: '教育结束时间不能为空', trigger: 'blur' }],
        // tenandId: [{ required: true, message: '租户id不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getTreeselect();
    setTimeout(() => {
      console.log(this.postOptions)
    }, 1500)
    getAreaTree().then(
      data =>
      (this.areaOptions = this.treeFilter(data || [], (child, parent, deep) => {
        if (deep != 2) {
          return [{ ...child, obj: JSON.stringify({ name: child.name, id: child.id }) }];
        }
        return [
          {
            ...child,
            obj: JSON.stringify({ name: child.name, id: child.id }),
            children: undefined,
          },
        ];
      })),
    );
    this.getEmployeeBasic();
    this.getEmployeeEducation();
    this.getEmployeeFamiles();
    this.getEmployeeWorkhistory();
    this.getEmployeeFile();
    console.log(this.$store.state);
    // this.form = {
    //   // id: 1,
    //   cardAddress: "1",
    //   depName: "1",
    //   emails: "1",
    //   employeePolitics: "1",
    //   employeeRealname: "1",
    //   employeeWeight: "1",
    //   householdProvinceId: "1",
    //   householdProvinceName: "1",
    //   idNo: "1",
    //   nickName: "1",
    //   nowCityName: "1",
    //   nowProvinceId: "1",
    //   positionId: "1",
    //   qq: "1",
    //   remark: "1",
    //   specialty: "1",
    //   urgentNameOne: "1"
    // }
  },
  methods: {
    ts() {
      this.$confirm('确认提交审核？')
        .then(res => {
          this.$message.success('已提交审核')
        })
        .catch(res => {
          this.$message.error('已取消提交审核')
        });

    },
    // 格式化部门的下拉框
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 + 岗位下拉 */
    getTreeselect() {
      listSimpleDepts().then(response => {
        // 处理 deptOptions 参数
        this.deptOptions = [];
        this.deptOptions.push(...this.handleTree(response.data, 'id'));
        console.log(this.deptOptions)
        this.digui(this.deptOptions)
        console.log(this.deptOptions)
      });
      listSimplePosts().then(response => {
        // 处理 postOptions 参数
        this.postOptions = [];
        this.postOptions.push(...response.data);
      });
    },
    // 转换数据结构函数
    digui(obj) {
      obj.forEach(item => {
        if (item.children && item.children.length) {
          this.digui(item.children);
        } else {
          item.id = JSON.stringify({ id: item.id, name: item.name });
        }
      })
    },
    change4(v) {
     this.form.positionName = this.postOptions.filter(item => item.id == v)[0].name
    },
    change2(a) {
      a = a.map(item => JSON.parse(item));
      this.form.nowCityName = a[0].name;
      this.form.nowProvinceName = a[1].name;
      this.form.nowCityId = a[1].id;
      this.form.nowProvinceId = a[0].id;
      this.form.nowProvinceAddress = a[0].name + a[1].name + a[2].name;
    },
    change(a) {
      a = a.map(item => JSON.parse(item));
      this.form.householdProvinceName = a[0].name;
      this.form.householdCityName = a[1].name;
      this.form.householdCityId = a[1].id;
      this.form.householdProvinceId = a[0].id;
      this.form.householdAddress = a[0].name + a[1].name + a[2].name;
    },
    // 切换内容
    indexs(i) {
      this.index = i
    },
    // 上传成功
    upload(a, b, c) {
      console.log(a);
      console.log(b);
      console.log(c);
      console.log(this.scindex);
      this.scindex.fag = a.data;
      let obj = {};
      this.tableData.forEach(item => {
        if (item.fag) {
          obj[item.value] = item.fag;
        }
      })
      if (this.zlid) {
        console.log('走修改');
        updateEmployeeFilemy({ ...obj, id: this.zlid }).then(res => {
          console.log(res);
          this.$modal.msgSuccess('上传成功');
        })
      } else {
        console.log('走创建');
        createEmployeeFilemy(obj).then(res => {
          console.log(res);
          if (res.data) {
            this.$modal.msgSuccess('上传成功');
          } else {
            this.scindex.fag = false;
          }
          this.getEmployeeFile();
        })
      }
    },
    // 上传内容索引
    upindex(i) {
      console.log(i);
      this.scindex = i
      if (i.fag) {
        window.open(i.fag);
      }
    },
    // 获取用户基本信息
    getEmployeeBasic() {
      getEmployeeBasicmy().then(res => {
        if (res.data) {
          let obj = res.data;
          obj.depId = JSON.stringify({ id: obj.depId, name: obj.depName });
          // if (obj.workerTime.length) obj.workerTime = `${obj.workerTime[0]}-${obj.workerTime[1]}-${obj.workerTime[2]}`;
          // if (obj.socialPaymentTime.length) obj.socialPaymentTime = `${obj.socialPaymentTime[0]}-${obj.socialPaymentTime[1]}-${obj.socialPaymentTime[2]}`;
          // if (obj.employeeBirthday.length) obj.employeeBirthday = `${obj.employeeBirthday[0]}-${obj.employeeBirthday[1]}-${obj.employeeBirthday[2]}`;
          // if (obj.dateOfBirthTime.length) obj.dateOfBirthTime = `${obj.dateOfBirthTime[0]}-${obj.dateOfBirthTime[1]}-${obj.dateOfBirthTime[2]}`;
          // if (obj.entryTime.length) obj.entryTime = `${obj.entryTime[0]}-${obj.entryTime[1]}-${obj.entryTime[2]}`;
          this.form = obj;
        }
      })
    },
    // 获取教育基本信息
    getEmployeeEducation() {
      getEmployeeEducationmy(this.$store.state.user.id).then(res => {
        console.log(res)
        this.tableDatajy = res.data
      })
    },
    // 添加基本信息
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        let obj = JSON.parse(JSON.stringify(this.form));
        obj.depName = JSON.parse(obj.depId).name;
        obj.depId = JSON.parse(obj.depId).id;
        // if (obj.workerTime) obj.workerTime = (obj.workerTime / 1000);
        // if (obj.employeeBirthday) obj.employeeBirthday = (obj.employeeBirthday / 1000);
        // if (obj.socialPaymentTime) obj.socialPaymentTime = (obj.socialPaymentTime / 1000);
        // if (obj.dateOfBirthTime) obj.dateOfBirthTime = (obj.dateOfBirthTime / 1000);
        // if (obj.entryTime) obj.entryTime = (obj.entryTime / 1000);
        // 修改的提交
        if (obj.id != null) {
          updateEmployeeBasicmy(obj).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            // this.getList();
          });
          return;
        }
        // 添加的提交
        createEmployeeBasicmy(obj).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open = false;
          this.getEmployeeBasic();
          // this.getList();
        });
      });
    },
    // 打开添加教育对话框
    handleAdd1() {
      if (this.tableDatajy.length >= 10) return this.$message.error('已达到最大添加数量');
      this.form1 = {
        educationId: undefined,
        educationSchool: undefined,
        educationSpecialty: undefined,
        educationHonor: undefined,
        educationStarttime: undefined,
        educationEndtime: undefined,
        tenandId: undefined,
        id: undefined,
      };
      this.resetForm('formt1');
      this.open1 = true;
      this.title = '添加员工教育培训经历';
    },
    // 添加教育信息
    submitForm1() {
      this.$refs['formt1'].validate(valid => {
        if (!valid) {
          return;
        }
        let obj = JSON.parse(JSON.stringify(this.form1));
        // if (obj.educationStarttime) obj.educationStarttime = (obj.educationStarttime / 1000);
        // if (obj.educationEndtime) obj.educationEndtime = (obj.educationEndtime / 1000);
        // 修改的提交
        if (obj.employeeId != null) {
          updateEmployeeEducation(obj).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            // this.getList();
          });
          return;
        }
        // 添加的提交
        createEmployeeEducationmy({ ...obj, employeeId: this.$store.state.user.id }).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open1 = false;
          this.getEmployeeEducation();
        });
      });
    },
    // 获取家庭基本信息
    getEmployeeFamiles() {
      getEmployeeFamilesmy().then(res => {
        console.log(res)
        this.tableDatajt = res.data;
      })
    },
    // 打开家庭及成员
    handleAdd3() {
      if (this.tableDatajt.length >= 10) return this.$message.error('已达到最大添加数量');
      this.form3 = {
        familesId: undefined,
        familesName: undefined,
        familesRealtion: undefined,
        familesWorkunit: undefined,
        familesWorkplace: undefined,
        familesPhone: undefined,
        tenandId: undefined,
        id: undefined,
      };
      this.resetForm('formt3');
      this.open3 = true;
      this.title = '添加家庭及成员';
    },
    // 添加家庭及成员
    submitForm3() {
      this.$refs['form3'].validate(valid => {
        console.log(this.form3);
        if (!valid) {
          return;
        }
        // 修改的提交
        // if (this.form.familesId != null) {
        //   updateEmployeeFamiles(this.form).then(response => {
        //     this.$modal.msgSuccess('修改成功');
        //     this.open = false;
        //     this.getList();
        //   });
        //   return;
        // }
        // 添加的提交
        createEmployeeFamilesmy({ ...this.form3, employeeId: this.$store.state.user.id }).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open3 = false;
          this.getEmployeeFamiles();
          // this.getList();
        });
      });
    },
    // 获取工作基本信息
    getEmployeeWorkhistory() {
      getEmployeeWorkhistorymy().then(res => {
        this.tableDatajl = res.data
      })
    },
    // 打开工作对话框
    handleAdd2() {
      if (this.tableDatajl.length >= 10) return this.$message.error('已达到最大添加数量');
      this.form2 = {
        employeeId: undefined,
        companyName: undefined,
        treatment: undefined,
        treatmentPost: undefined,
        reasonForLeave: undefined,
        tenandId: undefined,
        id: undefined,
      };
      this.resetForm('formt2');
      this.open2 = true;
      this.title = '添加员工工作经历';
    },
    // 添加工作经历
    submitForm2() {
      this.$refs['formt2'].validate(valid => {
        if (!valid) {
          return;
        }
        console.log(this.form2);
        // 修改的提交
        // if (this.form.employeeId != null) {
        //   updateEmployeeWorkhistory(this.form).then(response => {
        //     this.$modal.msgSuccess('修改成功');
        //     this.open = false;
        //     this.getList();
        //   });
        //   return;
        // }
        // 添加的提交
        createEmployeeWorkhistorymy({ ...this.form2, employeeId: this.$store.state.user.id }).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open2 = false;
          this.getEmployeeWorkhistory();
        });
      });
    },
    // 获取文件基本信息
    getEmployeeFile() {
      getEmployeeFilemy().then(res => {
        console.log(res, '文件信息')
        if (res.data) {
          this.zlid = res.data.id;
          this.tableData.forEach(item => {
            if (res.data[item.value]) {
              item.fag = res.data[item.value];
            }
          })
        }
      })
    },
  }
};
</script>
<style lang="scss">
@import '@/assets/styles/element-variables.scss';

.top {
  height: 100px;
  display: flex;
}

.top>div {
  flex: 1;
  margin-left: 20px;
  background-color: #fff;
  border-top: 5px solid $--color-primary;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 30px 0 0 20px;
  cursor: pointer;
}

.top>div.active {
  background-color: rgba($--color-primary, 0.1);
}

.top>div:nth-child(1) {
  margin-left: 0;
}

.top>div>span.tb {
  width: 20px;
  height: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 3px solid $--color-primary;
  display: flex;
  position: absolute;
  left: 10%;
  top: -10px;
  background-color: #fff;
}
</style>
