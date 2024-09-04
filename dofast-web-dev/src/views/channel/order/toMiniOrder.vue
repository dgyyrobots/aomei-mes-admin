<template>
  <el-dialog title="转为商城订单" v-if="showFlag" :visible.sync="showFlag" :modal="true" width="750px" center>
    <el-form :model="form" :rules="rules" ref="form" size="small" :inline="true" label-width="90px">
      <el-row :gutter="20">
        <el-col :span="24" class="relative">
          <el-divider> 收货信息</el-divider>
        </el-col>
        <el-col :span="24" :xs="24">
          <el-form-item label="地址解析" prop="mobile">
            <el-input type="textarea" v-model="receiver_address_text" placeholder="请输入粘贴详细地址" class="!w-178 mr-2"
              :rows="8" resize="none" />
            <el-button type="primary" @click="parseAddress">解析</el-button>
          </el-form-item>
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
            <el-cascader v-model="form.receiver_area_id" :options="areaOptions"
              :props="{ label: 'name', value: 'id' }"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="邮政编码" prop="receiver_post_code">
            <el-input v-model="form.receiver_post_code" placeholder="请输入区域邮政编码" />
          </el-form-item>
        </el-col>
        <el-col :span="24" :xs="24">
          <el-form-item label="详细地址" prop="receiver_detail_address">
            <el-input type="textarea" v-model="form.receiver_detail_address" placeholder="请输入收件人详细地址" class="!w-200"
              :rows="5" resize="none" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-divider> 其他设置</el-divider>
        </el-col>
        <el-col :span="24" :xs="24">
          <el-form-item label-width="0" v-if="order">
            <span class="mr-4 mb-2">单号: {{ order.refOid }}</span>
            <span class="mr-4 mb-2">下单人: {{ order.openBuyerNick }}</span>
            <span class="mr-4 mb-2">销售员昵称: {{ order.openSellerNick }}</span>
            <span class="mr-4 mb-2">发货人ID: {{ order.receiverId }}</span>
            <span class="mr-4 mb-2">发货地址: {{ order.receiverCountry }} {{ order.receiverState }} {{ order.receiverCity }}
              {{ order.receiverDistrict }} {{ order.receiverTown }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="下单人一致" prop="canSetUser">
            <el-radio-group v-model="form.canSetUser" @change="form.user_id = 0">
              <el-radio :key="true" :label="false">是</el-radio>
              <el-radio :key="false" :label="true">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="销售员" prop="canSetUser">
            <el-input :value="form.salesman_id ? form.salesman_nickname : ''" placeholder="请选择销售员" readonly>
              <el-button slot="append" @click="handleSelectUser('salesman')" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.canSetUser">
          <el-divider> 用户信息</el-divider>
        </el-col>
        <el-col :span="12" :xs="24" v-if="form.canSetUser">
          <el-form-item label="是已有用户" prop="hasUser">
            <el-radio-group v-model="form.hasUser" @change="form.user_id = 0">
              <el-radio :key="true" :label="true">是</el-radio>
              <el-radio :key="false" :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24" v-if="form.canSetUser">
          <el-form-item label="选择客户" prop="user_id" v-if="form.hasUser">
            <el-input :value="form.user_id ? form.user_mobile : ''" placeholder="请选择客户" readonly>
              <el-button slot="append" @click="handleSelectMember" icon="el-icon-search"></el-button>
            </el-input>
            <MemberSelect ref="memberSelect" @onSelected="setMember"></MemberSelect>
          </el-form-item>
          <div v-else style="height: 50px">&nbsp;</div>
        </el-col>
        <el-col :span="12" :xs="24" v-if="!form.hasUser && form.canSetUser">
          <el-form-item label="姓名/昵称" prop="user_nickname">
            <el-input v-model="form.user_nickname" placeholder="请输入用户姓名或者昵称" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24" v-if="!form.hasUser && form.canSetUser">
          <el-form-item label="手机号码" prop="user_mobile">
            <el-input v-model="form.user_mobile" placeholder="请输入用户手机号" />
          </el-form-item>
        </el-col>
      </el-row>
      <UserSelect ref="userSelect" @onSelected="setUser"></UserSelect>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { toTrade } from '@/api/channel/order.js';
import { getAreaById, getAreaTree, getAreaIdsByNames, getAreaFieldsById } from '@/api/system/area.js';
import { parseAddress } from '@/api/infra/address.js';
import MemberSelect from '@/components/memberSelect/single.vue';
import UserSelect from '@/components/userSelect/single.vue';

export default {
  components: { MemberSelect, UserSelect },
  data() {
    return {
      order: null,
      userField: '',
      showFlag: false,
      order_id: 0,
      receiver_address_text: '',
      form: {
        canSetUser: false,
        hasUser: true,
        user_id: 0,
        user_nickname: '',
        user_mobile: '',
        receiver_name: '',
        receiver_mobile: '',
        receiver_area_id: [],
        receiver_post_code: '',
        receiver_detail_address: '',
        salesman_id: '',
        salesman_nickname: '',
      },
      areaOptions: [],
      rules: {
        user_id: [{ required: true, message: '请选择绑定用户', trigger: 'blur' }],
        user_nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
        user_mobile: [{ required: true, message: '请输入用户手机号', trigger: 'blur' }],
        receiver_name: [{ required: true, message: '请输入收货人名称', trigger: 'blur' }],
        receiver_mobile: [{ required: true, message: '请输入收货人手机号', trigger: 'blur' }],
        receiver_area_id: [{ required: true, message: '请选择收货区域', trigger: 'blur' }],
        // receiver_post_code: [{ required: true, message: '请输入邮政编码', trigger: 'blur' }],
        receiver_detail_address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
        salesman_id: [{ required: true, message: '请选择销售员', trigger: 'blur' }],
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
        canSetUser: false,
        hasUser: true,
        user_id: 0,
        user_nickname: '',
        user_mobile: '',
        receiver_name: '',
        receiver_mobile: '',
        receiver_area_id: [],
        receiver_post_code: '',
        receiver_detail_address: '',
        salesman_id: this.$store.getters.userId,
        salesman_nickname: this.$store.getters.nickname,
      };
    },
    async open(order_id, order) {
      this.order_id = order_id;
      this.order = order;
      this.reset();
      this.showFlag = true;
      if (order) {
        this.form.receiver_name = order.receiverName;
        const ids = await getAreaIdsByNames([order.receiverState, order.receiverCity, order.receiverDistrict]);
        if (ids.some(id => !id)) {
          return;
        }
        this.form.receiver_area_id = ids;
      }
    },
    async confirm() {
      try {
        await this.$refs.form.validate();
        const area_names = await getAreaFieldsById(this.form.receiver_area_id, 'name');
        const order = this.order;
        if (!order || !(order.receiverState == area_names[0] && order.receiverCity == area_names[1] && order.receiverDistrict == area_names[2])) {
          await this.$modal.confirm('你确认以上收货地址正确吗?');
        }
        const ret = await toTrade({
          channelOrderId: this.order_id,
          userId: this.form.canSetUser && this.form.hasUser && this.form.user_id > 0 ? this.form.user_id : undefined,
          userNickname: this.form.canSetUser ? this.form.user_nickname : this.form.receiver_name,
          userMobile: this.form.canSetUser ? this.form.user_mobile : this.form.receiver_mobile,
          receiverName: this.form.receiver_name,
          receiverMobile: this.form.receiver_mobile,
          receiverAreaId: this.form.receiver_area_id ? this.form.receiver_area_id[2] : 0,
          receiverPostCode: this.form.receiver_post_code,
          receiverDetailAddress: this.form.receiver_detail_address,
          systemUserId: this.form.salesman_id,
          systemUserName: this.form.salesman_nickname,
        });
        if (ret.code == 0) {
          this.$modal.msgSuccess('生成商城订单成功');
          this.$emit('success');
          this.showFlag = false;
          return;
        }
      } catch (e) {
        console.log(e);
        // this.$modal.msgError('生成商城订单失败');
      }
    },
    handleSelectMember() {
      this.$refs.memberSelect.showFlag = true;
    },
    setMember(member) {
      this.form.user_id = member.id;
      this.form.user_nickname = member.nickname;
      this.form.user_mobile = member.mobile;
    },
    handleSelectUser(field) {
      this.userField = field;
      this.$refs.userSelect.showFlag = true;
    },
    setUser(user) {
      this.form[this.userField + '_id'] = user.id;
      this.form[this.userField + '_nickname'] = user.nickname;
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
