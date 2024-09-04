<template>
  <div class="app-container">
    <el-form :model="form" :rules="rules" ref="form" label-width="90px" @submit="createOrder">
      <el-descriptions title="客户信息" :column="1">
        <el-descriptions-item label-class-name="no-colon">
          <el-form-item label="客户" prop="user_id">
            <div class="border border-solid border-gray-3 p-2 flex min-w-90" v-if="form.user_id"
              @click="handleSelectMember()">
              <!--              <el-image class="w-15 h-15" :src="form.user_avatar" fit="cover"></el-image>-->
              <div class="mr-2" style="line-height: 22px">
                <div>{{ form.user_name }}</div>
                <div>{{ form.user_mobile }}</div>
              </div>
            </div>
            <div class="border border-solid border-gray-3 p-5 flex min-w-90" v-else @click="handleSelectMember()">
              <i class="el-icon-user text-14"></i>
              <div class="ml-2">选择客户</div>
            </div>
            <MemberSelect ref="memberSelect" @onSelected="setMember($event)"></MemberSelect>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item label-class-name="no-colon">
          <el-form-item label="收货地址" prop="address_id" @click="handleSelectAddress()">
            <div class="border border-solid border-gray-3 p-2 min-w-90" v-if="form.address_id" style="line-height: 22px"
              @click="handleSelectAddress()">
              <div>{{ form.address_name }}&nbsp;&nbsp;&nbsp;{{ form.address_mobile }}</div>
              <div>{{ form.address_area_name.join(' ') }}&nbsp;&nbsp;&nbsp;{{ form.address_post_code }}</div>
              <div>{{ form.address_detail }}</div>
            </div>
            <div class="border border-solid border-gray-3 p-5 flex min-w-90" v-else-if="form.user_id"
              @click="handleSelectAddress()">
              <i class="el-icon-location text-14"></i>
              <div class="ml-2">选择收货地址</div>
            </div>
            <div class="text-1 text-red" v-else>请先选择客户</div>
            <!-- 此处可以修改地址 需要介入后端 -->
            <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="addressU(form)"
              v-if="form.address_id">修改</el-button> -->
            <AddressSelect ref="addressSelect" @onSelected="setAddress($event)"></AddressSelect>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item label-class-name="no-colon">
          <el-form-item label="配送方式" prop="deliveryType">
            <el-radio-group v-model="form.deliveryType">
              <el-radio v-for="(dict, i) in this.getDictDatas(DICT_TYPE.TRADE_DELIVERY_TYPE)" :label="dict.value"
                :key="i"> {{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="商品信息" :column="1"></el-descriptions>
      <el-form-item label-width="0" prop="items">
        <div class="flex w-full max-h-150">
          <div class="border border-gray-1 border-solid flex h-150 flex-1">
            <div class="relative overflow-y-auto min-w-60">
              <el-tree :data="categories" :props="{ label: 'name' }" node-key="id"
                @node-click="handleCategorySelect($event)"></el-tree>
            </div>
            <div class="h-full overflow-y-auto flex-1" style="border-left: 1px solid #eee">
              <el-row class="w-full p-2" v-for="spu in spus.filter(({ status }) => status == 1)" :key="spu.id"
                style="border-bottom: 1px solid #eee; min-width: 305px">
                <el-col :span="12">
                  <div class="flex">
                    <el-image class="w-15 h-15" :src="spu.picUrls[0]" fit="cover"></el-image>
                    <div class="flex-1 ml-2" style="line-height: 22px">{{ spu.name }}</div>
                  </div>
                </el-col>
                <el-col :span="12" class="text-right">￥{{ (spu.marketPrice / 100).toFixed(2) }}&nbsp;详细规格如下 </el-col>
                <template v-for="sku in skus.filter(sku => sku.spuId == spu.id)">
                  <el-col :span="15" :offset="1" class="border-t">{{ sku.name || '暂无标签' }}&nbsp;</el-col>
                  <el-col :span="6" class="border-t">￥{{ (sku.price / 100).toFixed(2) }}</el-col>
                  <el-col :span="2" class="border-t">
                    <el-link type="primary" @click="addItem({ spu, sku, count: 1 })" class="break-keep">添加</el-link>
                  </el-col>
                </template>
              </el-row>
              <el-empty v-if="!spus || spus.length <= 0"></el-empty>
            </div>
          </div>
          <el-table :data="form.items" border class="h-150 ml-5 w-150">
            <el-table-column label="商品" prop="spu.name"></el-table-column>
            <el-table-column label="标签" prop="sku.name"></el-table-column>
            <el-table-column label="库存" prop="sku.stock">
              <template v-slot="{ row }">
                <div>{{ row.sku.stock - row.count }}</div>
              </template>
            </el-table-column>
            <el-table-column label="价格" prop="sku.price">
              <template v-slot="{ row }">
                <div>{{ (row.sku.price / 100).toFixed(2) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="数量" fixed="right">
              <template v-slot="{ row, $index }">
                <el-input-number v-model="row.count" :min="0" @input="changeItemCount($index, $event)"
                  style="width: 100px" size="small"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <!-- <el-form-item label="支付方式" prop="payType">
        <el-radio-group v-model="payType">
          <el-radio v-for="(dict, i) in ['线下支付', '微信支付', '支付宝支付']" :label="dict" :key="i" style="padding: 7px 8px">{{ dict
          }} </el-radio>
        </el-radio-group>
        <br />
        <el-radio-group v-model="form.payType">
          <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.PAY_CHANNEL_CODE_TYPE)" :key="dict.value"
            :label="dict.value" v-if="checkDisplay(dict, payType)"
            style="border: 1px solid #ddd; padding: 6px 8px; border-radius: 4px; margin-bottom: 8px">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="总价:" prop="payPrice">
        <el-input-number v-model="form.payPrice" :min="0"></el-input-number>
        <!-- <span style="color: red;font-weight: bold;font-size: 20px;">{{ form.payPrice }}元</span> -->
      </el-form-item>
      <el-form-item label="销售员" prop="system_user_id">
        <el-input :value="form.system_user_id ? form.system_user_name : ''" placeholder="请选择销售员" style="width:200px"
          readonly>
          <el-button slot="append" @click="handleSelectUser" icon="el-icon-search"></el-button>
        </el-input>
        <UserSelect ref="userSelect" @onSelected="setUser"></UserSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="reset">重置</el-button>
        <el-button type="primary" submit @click="createOrder">确定</el-button>
      </el-form-item>
    </el-form>
    <AddAddressDetail ref="addDetail" @onCreated="handleRowDbClick"></AddAddressDetail>

  </div>
</template>
<script>
import MemberSelect from '@/components/memberSelect/single.vue';
import AddressSelect from '@/components/addressSelect/single.vue';
import UserSelect from '@/components/userSelect/single.vue';
import { getAreaById, getAreaFieldsById, getAreaTree } from '@/api/system/area';
import { createTradeOrder } from '@/api/mall/trade/order';
import { getProductCategoryList } from '@/api/mall/product/category';
import { getSpuSimpleList } from '@/api/mall/product/spu';
import { getSkuOptionList } from '@/api/mall/product/sku';
import AddAddressDetail from '@/components/addAddressDetail/single.vue';
export default {
  components: { MemberSelect, AddressSelect, UserSelect, AddAddressDetail },
  data() {
    return {
      categories: [],
      spus: [],
      skus: [],
      payType: '',
      form: {
        payPrice: 0,
        payType: '',
        user_id: '',
        user_name: '',
        user_mobile: '',
        system_user_id: '',
        system_user_name: '',
        coupon_id: '',
        coupon_name: '',
        address_id: '',
        address_name: '',
        address_mobile: '',
        address_area_id: [],
        address_area_name: [],
        address_post_code: '',
        address_detail: '',
        from_cart: false,
        items: [],
        deliveryType: ''
      },
      areaOptions: [],
      rules: {
        user_id: [{ type: 'number', required: true, message: '请选择客户', trigger: 'blur' }],
        items: [{ required: true, message: '请选择商品信息', trigger: 'blur' }],
        address_id: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        deliveryType: [{ required: true, message: '请选择配送方式', trigger: 'blur' }],
      },
    };
  },
  watch: {
    'form.address_area_id': 'setPostCode',
  },
  created: function () {
    getProductCategoryList().then(res => {
      this.categories = this.handleTree(res.data);
    });
    getSpuSimpleList().then(res => {
      console.log(res)
      this.spus = res.data;
    });
    getSkuOptionList().then(res => {
      this.skus = res.data;
    });
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
    addressU(form) {
      this.$refs.addDetail.open(form);
    },
    checkDisplay(dict, payType) {
      if (!payType) {
        return false;
      }
      payType = payType.replace(/(.*)支付/, '$1');
      if (payType == '线下') {
        return !/(支付宝|微信).*/.test(dict.label);
      }
      return new RegExp(`${payType}.*`).test(dict.label);
    },
    handleCategorySelect(row) {
      getSpuSimpleList().then(res => {
        this.spus = res.data.filter(({ categoryId }) => {
          return categoryId == row.id;
        });
      });
    },
    reset() {
      this.form = {
        payPrice: 0,
        payType: '',
        user_id: '',
        user_name: '',
        system_user_id: '',
        system_user_name: '',
        coupon_id: '',
        coupon_name: '',
        use_address_id: true,
        address_id: '',
        address_name: '',
        address_mobile: '',
        address_area_id: [],
        address_post_code: '',
        address_detail: '',
        items: [],
      };
    },
    handleSelectMember() {
      this.$refs.memberSelect.showFlag = true;
    },
    handleSelectUser() {
      this.$refs.userSelect.showFlag = true;
    },
    setMember(member) {
      this.form.user_id = member.id;
      this.form.user_name = member.nickname;
      this.form.user_mobile = member.mobile;
    },
    setUser(user) {
      this.form.system_user_id = user.id;
      this.form.system_user_name = user.nickname;
    },
    handleSelectAddress() {
      this.$refs.addressSelect.open(this.form.user_id);
    },
    async setAddress(address) {
      this.form.address_id = address.id;
      this.form.address_name = address.name;
      this.form.address_mobile = address.mobile;
      this.form.address_post_code = address.postCode;
      this.form.address_detail = address.detailAddress;
      this.form.address_area_id = await getAreaFieldsById(address.areaId, 'id');
      this.form.address_area_name = await getAreaFieldsById(address.areaId, 'name');
    },
    async handleRowDbClick(address) {
      this.form.address_id = address.id;
      this.form.address_name = address.name;
      this.form.address_mobile = address.mobile;
      this.form.address_post_code = address.postCode;
      this.form.address_detail = address.detailAddress;
      this.form.address_area_id = await getAreaFieldsById(address.areaId, 'id');
      this.form.address_area_name = await getAreaFieldsById(address.areaId, 'name');
    },
    setPostCode() {
      if (this.form.address_area_id.length) {
        getAreaById(this.form.address_area_id[this.form.address_area_id.length - 1]).then(({ data: area }) => {
          if (area) {
            this.form.address_post_code = area.zipcode;
          }
        });
      }
    },
    handleSelectSkus() {
      this.$refs.skuSelect.open(this.form.items);
    },
    addItem(item) {
      for (let i = 0; i < this.form.items.length; i++) {
        const current = this.form.items[i];
        if (current.sku.id == item.sku.id && current.spu.id == item.spu.id) {
          this.form.items[i].count += item.count;
          return;
        }
      }
      this.form.items.push(item);
      this.calculate();
    },
    calculate() {
      this.form.payPrice = (
        this.form.items.reduce((value, item) => {
          return value + item.sku.price * item.count;
        }, 0) / 100
      ).toFixed(2);
    },
    async changeItemCount(rowIndex, value) {
      if (value <= 0) {
        const sure = await this.$modal.confirm('你确定要删除这条商品吗?', '提示').catch(() => false);
        if (sure) {
          this.form.items.splice(rowIndex, 1);
          return;
        }
        this.form.items[rowIndex].count = 1;
      }
      this.calculate();
    },
    async createOrder() {
      try {
        await this.$refs.form.validate();
        const { data: orderId } = await createTradeOrder({
          payType: this.form.payType,
          payPrice: this.form.payPrice*100,
          deliveryType: this.form.deliveryType * 1,
          price: this.form.payPrice,
          addressId: this.form.address_id,
          userId: this.form.user_id,
          systemUserId: this.form.system_user_id,
          systemUserName: this.form.system_user_name,
          couponId: this.form.coupon_id,
          remark: this.form.remark,
          fromCart: this.form.from_cart,
          items: this.form.items.map(item => {
            return {
              skuId: item.sku.id,
              count: item.count,
            };
          }),
        });
        if (orderId) {
          const confirm = await this.$modal.confirm('订单创建成功, 是否跳转到订单详情页?').catch(e => false);
          if (confirm) {
            this.$router.push({ name: 'TradeOrderDetail', query: { id: orderId } });
          }
          this.reset();
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.border-t {
  border-top: 1px solid #eee;
  line-height: 35px;
}

:deep(.el-descriptions) {
  &:not(:nth-child(1)) {
    margin-top: 20px;
  }

  .el-descriptions__title {
    display: flex;
    align-items: center;

    &::before {
      content: '';
      display: inline-block;
      margin-right: 10px;
      width: 3px;
      height: 20px;
      background-color: #409eff;
    }
  }

  .el-descriptions-item__container {
    margin: 0 10px;

    .no-colon {
      margin: 0;

      &::after {
        content: '';
      }
    }
  }

  .el-descriptions--medium.is-bordered .el-descriptions-row {
    .no-colon {
      display: none;
    }

    .el-descriptions-item__cell {
      padding: 0;
    }
  }
}
</style>
