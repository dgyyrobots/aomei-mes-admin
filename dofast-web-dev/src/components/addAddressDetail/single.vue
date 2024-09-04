<template>
  <el-dialog :visible.sync="showFlag" width="800px">
    <el-form ref="form" :model="form" :rules="rules" inline label-width="90px" class="address-detail-form">
      <el-form-item label="详细地址" prop="fastAddress">
        <el-input v-model="fastAddress" type="textarea" placeholder="请输入详细地址" class="!w-180 mr-5"></el-input>
        <el-button type="primary" @click="parseAddress()" class="ml-5">解析</el-button>
      </el-form-item>
      <el-form-item label="收件人" prop="name">
        <el-input v-model="form.name" placeholder="请输入收件人"></el-input>
      </el-form-item>
      <el-form-item label="收件电话" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入收件电话"></el-input>
      </el-form-item>
      <el-form-item label="省市区" prop="areaId">
        <el-cascader v-model="form.areaId" placeholder="请选择省市区" :options="areaOptions"
          :props="{ label: 'name', value: 'id' }"></el-cascader>
      </el-form-item>
      <el-form-item label="邮政编码">
        <el-input v-model="form.postCode" placeholder="请输入邮政编码"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input v-model="form.detailAddress" placeholder="请输入详细地址" class="!w-220"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showFlag = false">取消</el-button>
      <el-button type="primary" @click="addAddress()">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { getAreaById, getAreaIdsByNames, getAreaTree } from '@/api/system/area';
import { parseAddress } from '@/api/infra/address';
import { createMemberAddress } from '@/api/member/address';

export default {
  data() {
    return {
      userId: '',
      areaOptions: [],
      showFlag: false,
      fastAddress: '',
      form: {
        userId: '',
        name: '',
        mobile: '',
        areaId: [],
        postCode: '',
        detailAddress: '',
      },
      rules: {
        name: [{ required: !this.disableEditAddress, message: '请输入收件人', trigger: 'blur' }],
        mobile: [{ required: !this.disableEditAddress, message: '请输入收件电话', trigger: 'blur' }],
        areaId: [{ required: !this.disableEditAddress, message: '请输入收件人区域', trigger: 'blur' }],
        postCode: [{ required: !this.disableEditAddress, message: '请输入邮政编码', trigger: 'blur' }],
        detailAddress: [{ required: !this.disableEditAddress, message: '请输入收件详情', trigger: 'blur' }],
      },
    };
  },
  watch: {
    'form.areaId': 'setPostCode',
  },
  created() {
    getAreaTree().then(
      data =>
      (this.areaOptions = this.treeFilter(data || [], (child, parent, deep) => {
        if (deep != 2) {
          return [child];
        }
        return [
          {
            ...child,
            children: undefined,
          },
        ];
      })),
    );
  },
  methods: {
    setPostCode() {
      if (this.form.areaId.length) {
        getAreaById(this.form.areaId[this.form.areaId.length - 1]).then(({ data: area }) => {
          if (area) {
            this.form.postCode = area.zipcode;
          }
        });
      }
    },
    reset() {
      this.form = {
        userId: this.userId,
        name: '',
        mobile: '',
        areaId: [],
        postCode: '',
        detailAddress: '',
      };
    },
    open(userId) {
      if (typeof (userId) == 'object') {
        this.reset();
        this.form = {
          ...userId,
          name: userId.address_name,
          mobile: userId.address_mobile,
          areaId: userId.address_area_id,
          postCode: userId.address_post_code,
          detailAddress: userId.address_detail,
        };
        this.showFlag = true;
        return;
      }
      this.userId = userId;
      this.reset();
      this.showFlag = true;
    },
    async addAddress() {
      await this.$refs.form.validate();
      this.form.postCode = this.form.postCode ? this.form.postCode : 111111
      const data = {
        ...this.form,
        userId: this.userId,
        areaId: this.form.areaId[this.form.areaId.length - 1],
        defaulted: false,
      };
      if (this.form.address_id) {
        this.$emit('onCreated', {
          ...data,
          id: data.address_id,
        });
        this.showFlag = false;
        return;
      }
      const { data: id } = await createMemberAddress(data);
      this.$emit('onCreated', {
        ...data,
        id,
      });
      this.showFlag = false;
    },
    async parseAddress() {
      if (this.fastAddress) {
        const result = await parseAddress(this.fastAddress);
        if (result.data) {
          this.form.name = result.data.name;
          this.form.mobile = result.data.mobile;
          this.form.detailAddress = (result.data.streetName || '') + (result.data.address || '');
          this.form.areaId = await getAreaIdsByNames([result.data.provinceName, result.data.cityName, result.data.expAreaName]);
        }
      }
    },
  },
};
</script>

<style>
.address-detail-form .el-form-item {
  margin-bottom: 25px;
}
</style>
