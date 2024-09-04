<template>
  <el-dialog title="修改订单地址" v-if="showFlag" :visible.sync="showFlag" :modal="true" width="750px" center>
    <el-form :model="form" :rules="rules" ref="form" size="small" :inline="true" label-width="90px">
      <el-row :gutter="20">
        <el-col :span="24" class="relative">
          <el-divider> 快速解析快递信息</el-divider>
        </el-col>
        <el-col :span="24" :xs="24">
          <el-form-item label="地址解析" prop="mobile">
            <el-input type="textarea" v-model="receiver_address_text" placeholder="请输入粘贴详细地址" class="!w-178 mr-2" :rows="8" />
            <el-button type="primary" @click="parseAddress">解析</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="relative">
          <el-divider> 快递信息</el-divider>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="收件人" prop="receiver_name">
            <el-input v-model="form.receiver_name" placeholder="请输入收件人名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="手机号码" prop="receiver_mobile">
            <el-input v-model="form.receiver_mobile" placeholder="请输入收件人手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="收件区域" prop="receiver_area_id">
            <el-cascader v-model="form.receiver_area_id" :options="areaOptions" :props="{ label: 'name', value: 'id' }"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="邮政编码" prop="receiver_post_code">
            <el-input v-model="form.receiver_post_code" placeholder="请输入区域邮政编码" />
          </el-form-item>
        </el-col>
        <el-col :span="24" :xs="24">
          <el-form-item label="详细地址" prop="receiver_detail_address">
            <el-input type="textarea" v-model="form.receiver_detail_address" placeholder="请输入收件人详细地址" class="!w-178" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { setOrderAddress } from '@/api/channel/order.js';
import { getAreaById, getAreaTree, getAreaIdsByNames } from '@/api/system/area.js';
import { parseAddress } from '@/api/infra/address.js';
import MemberSelect from '@/components/memberSelect/single.vue';

export default {
  components: { MemberSelect },
  data() {
    return {
      showFlag: false,
      order_id: 0,
      receiver_area_name: '',
      receiver_address_text: '',
      form: {
        receiver_name: '',
        receiver_mobile: '',
        receiver_area_id: [],
        receiver_post_code: '',
        receiver_detail_address: '',
      },
      areaOptions: [],
      rules: {
        receiver_name: [{ required: true, message: '请输入收货人名称', trigger: 'blur' }],
        receiver_mobile: [{ required: true, message: '请输入收货人手机号', trigger: 'blur' }],
        receiver_area_id: [{ required: true, message: '请选择收货区域', trigger: 'blur' }],
        receiver_post_code: [{ required: true, message: '请输入邮政编码', trigger: 'blur' }],
        receiver_detail_address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
      },
    };
  },
  watch: {
    'form.receiver_area_id': 'setPostCode',
  },
  created() {
    this.getAreas();
  },
  methods: {
    setPostCode() {
      if (this.form.receiver_area_id.length) {
        getAreaById(this.form.receiver_area_id[this.form.receiver_area_id.length - 1]).then(({ data: area }) => {
          if (area) {
            this.form.receiver_post_code = area.zipcode;
          }
        });
      }
    },
    getAreas() {
      getAreaTree().then(options => {
        this.areaOptions = this.treeFilter(options || [], (child, parent, deep) => {
          if (deep != 2) {
            return [child];
          }
          return [
            {
              ...child,
              children: undefined,
            },
          ];
        });
      });
    },
    reset() {
      this.form = {
        receiver_name: '',
        receiver_mobile: '',
        receiver_area_id: '',
        receiver_post_code: '',
        receiver_detail_address: '',
      };
    },
    open(order_id) {
      this.order_id = order_id;
      this.reset();
      this.showFlag = true;
    },
    handleSelectMember() {
      this.$refs.memberSelect.showFlag = true;
    },
    async confirm() {
      await this.$refs.form.validate();
      const ret = await setOrderAddress(this.order_id, {
        receiverName: this.form.receiver_name,
        receiverMobile: this.form.receiver_mobile,
        receiverAreaId: this.form.receiver_area_id ? this.form.receiver_area_id[2] : 0,
        receiverPostCode: this.form.receiver_post_code,
        receiverDetailAddress: this.form.receiver_detail_address,
      });
      if (ret.code == 0) {
        this.$modal.msgSuccess('修改收货地址成功');
        this.$emit('success');
        this.showFlag = false;
        return;
      }
    },
    async parseAddress() {
      if (this.receiver_address_text) {
        const result = await parseAddress(this.receiver_address_text);
        if (result.data) {
          this.form.receiver_name = result.data.name;
          this.form.receiver_mobile = result.data.mobile;
          this.form.receiver_detail_address = result.data.address;
          this.form.receiver_area_id = await getAreaIdsByNames([result.data.provinceName, result.data.cityName, result.data.expAreaName]);
        }
      }
    },
  },
};
</script>
