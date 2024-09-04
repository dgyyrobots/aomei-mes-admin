<template>
  <el-dialog inline v-loading="tab == 'loading'" title="订单发货" v-if="showFlag" :visible.sync="showFlag" width="900px"
    center>
    <el-form v-if="tab == 'edit'" ref="form" :model="form" :rules="rules" label-width="90px"
      class="grid grid-cols-2 gap-4">
      <el-form-item label="发货类型" prop="express_type">
        <el-radio-group v-model="form.express_type">
          <template v-for="dict in this.getDictDatas(DICT_TYPE.TRADE_EXPRESS_TYPE)">
            <el-radio
              v-if="((type == 1 || type == 4) && dict.value == 'electron') || ((type == 1 || type == 4 || type == 5 || type == 3 || type == 2) && dict.value == 'manual')"
              :key="dict.value" :label="dict.value">{{
                dict.label }}
            </el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发货方式" v-if="form.express_type == 'manual'" prop="express_method">
        <el-radio-group v-model="form.express_method">
          <template v-for="dict in this.getDictDatas(DICT_TYPE.TRADE_EXPRESS_METHOD)">
            <el-radio :key="dict.value" :label="dict.value">{{ dict.label }}
            </el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="( type == 3 || type == 2) ? '联系人名称' : '发货主体'" prop="express_company_type_id"
        v-if="form.express_type == 'manual' && form.express_method == 'express'" label-width="93px">
        <el-select v-model="form.express_company_type_id" :placeholder="type == ( type == 3 || type == 2)  ? '请选择联系人名称' : '请选择发货主体'">
          <el-option v-for="dict in company_types" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item :label="(type == 3 || type == 2) ? '联系人电话' : '快递单号'" prop="express_waybill_code"
        v-if="form.express_type == 'manual' && form.express_method == 'express'" label-width="93px">
      <el-input v-model="form.express_waybill_code"
          :placeholder="(type == 3 || type == 2) ? '请输入联系人电话' : '请输入快递单号'"></el-input>
      </el-form-item>


      <template v-if="form.express_type == 'electron'">
        <el-form-item label="物流公司" prop="express_company_id">
          <el-select v-model="form.express_company_id" placeholder="请选择物流公司">
            <el-option v-for=" dict  in  companies " :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发货仓库" prop="warehouse_id">
          <el-select v-model="form.warehouse_id" placeholder="请选择发货仓库">
            <el-option v-for=" dict  in  warehouses " :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
          <!-- <el-input :value="form.warehouse_id ? form.warehouse_name : ''" placeholder="请选择发货仓库" readonly>
            <el-button slot="append" @click="handleSelectWarehouse()" icon="el-icon-search"></el-button>
          </el-input> -->
        </el-form-item>
        <el-form-item label="包裹数量" prop="total_packages_count">
          <el-input-number v-model="form.total_packages_count" placeholder="请输入包裹数量" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="保价金额" prop="declared_value">
          <el-input-number v-model="form.declared_value" placeholder="请输入保价金额" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="体积(ml)" prop="volume">
          <el-input-number v-model="form.volume" placeholder="请输入包裹体积" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="重量(g)" prop="weight">
          <el-input-number v-model="form.weight" placeholder="请输入包裹重量" :min="1" controls-position="right" />
        </el-form-item>
        <!-- <el-form-item label="发货商品" prop="items" class="col-span-2" label-class="block">
          <el-table :data="goodsList" :show-header="false" ref="goodsTable" @selection-change="form.items = $event">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="title">
              <template v-slot="{ row }">
                {{ row.spuName }}
                <el-tag size="medium" v-for="property in row.properties" :key="property.propertyId"> {{ property.propertyName }}：{{ property.valueName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="num" width="155">
              <template v-slot="{ row }">
                <el-input-number v-model="row.count" :min="1" :max="row.num" v-if="row.num > 1" size="mini" />
                <div class="text-center" v-else>{{ row.num }}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item> -->
      </template>
    </el-form>
    <div v-else-if="tab == 'list'">
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="sendTicket">发 货</el-button>
          <el-button type="default" @click="tab = 'edit'">添加面单</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" ref="ticketTable">
        <el-table-column type="selection" width="55" :selectable="canUseTicket"></el-table-column>
        <el-table-column label="物流单号" width="180"></el-table-column>
        <el-table-column label="物流公司"></el-table-column>
        <el-table-column label="创建时间" width="120"></el-table-column>
        <el-table-column label="状态" width="60"></el-table-column>
        <el-table-column label="操作" width="120">
          <template v-slot="{ row }">
            <el-button type="text" @click="printTicket(row)">打印</el-button>
            <el-button type="text" @click="sendTicket(row)">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer" v-if="tab == 'edit'">
      <el-button type="primary" @click="addTicket">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
    <!-- <WarehouseSelect ref="warehouseSelect" @onSelected="setWarehouse"></WarehouseSelect>
    <ExpressCompanySelect ref="expressCompanySelect" @onSelected="setExpressCompany"></ExpressCompanySelect> -->
    <!-- <ExpressCompanyTypeSelect ref="expressCompanyTypeSelect" @onSelected="setExpressCompanyType"></ExpressCompanyTypeSelect> -->
  </el-dialog>
</template>
<script>
// import WarehouseSelect from '@/components/warehouseSelect/address.vue';
// import ExpressCompanySelect from '@/components/expressCompanySelect/single.vue';
// import { getElectronicsheetPackageList, createElectronicsheetPackageByDot3, createElectronicsheetPackage } from '@/api/mall/trade/electronicsheetPackage.js';
// import ExpressCompanyTypeSelect from '@/components/expressCompanyTypeSelect/single.vue';
import { getElectronSheetList } from '@/api/system/expressElectronicsheet.js';
import { getWarehouseList } from '@/api/mes/wm/warehouse.js';
import { getExpressCompanyList } from '@/api/system/expressCompany.js';
import { getShop } from '@/api/channel/shop.js';
import { getAreaFieldsById } from '@/api/system/area.js';
import { setOrderExpressPass, setOrderExpressPassByDot3Virtual, setOrderExpressPassByDot3, setOrderExpressPassByKdbird } from '@/api/mall/trade/order.js';

export default {
  props: ['type'],
  // components: { WarehouseSelect, ExpressCompanySelect },
  data() {
    return {
      showFlag: false,
      order_id: 0,
      tab: 'edit',
      list: [],
      companies: [],
      company_types: [],
      warehouses: [],
      selection: [],
      goodsList: [],
      form: {
        express_type: 'electron',
        express_method: '',
        express_waybill_code: '',
        warehouse_id: '',
        warehouse_name: '',
        express_company_id: '',
        express_company_name: '',
        express_company_type_id: '',
        express_company_type_name: '',
        total_packages_count: 1,
        declared_value: 0,
        weight: 1,
        volume: 1,
        items: [],
        push: false,
      },
      rules: {
        warehouse_id: [{ type: 'number', min: 1, required: true, message: '请选择发货仓库', trigger: 'blur' }],
        express_company_id: [{ type: 'number', min: 1, required: true, message: '请选择物流公司', trigger: 'blur' }],
        express_company_type_id: [{ min: 1, required: true, message: '请选择物流公司', trigger: 'blur' }],
        items: [{ type: 'array', required: true, message: '请选择发货商品', trigger: 'blur' }],
        express_method: [{ required: true, message: '请选择发货方式', trigger: 'blur' }],
        express_type: [{ required: true, message: '请选择发货类型', trigger: 'blur' }],
        express_waybill_code: [{ required: true, message: this.messages(), trigger: 'blur' }],
      },
      order: { channel: null },
      obj: {
        3: '同城配送',
        2: '用户自提'
      }
    };
  },
  watch: {
    type(a, b) {
      if (a == 1 || a == 4) {
        // 电子面单
        console.log(a)
        this.form.express_type = 'electron';
      }
      if (a == 5 || a == 3 || this.type == 2) {
        this.form.express_type = 'manual';
        this.form.express_method = 'express';
      }
    }
  },
  created() {
    getExpressCompanyList().then(res => {
      this.company_types = (res.data || []).map(company => {
        return {
          ...company,
          value: company.expressNo,
          label: company.companyName,
        };
      });
    });
    getElectronSheetList().then(res => {
      this.companies = (res.data || []).map(company => {
        return {
          ...company,
          value: company.id,
          label: company.companyName,
        };
      });
    });
    getWarehouseList().then(res => {
      this.warehouses = (res.data || []).map(warehouse => {
        return {
          ...warehouse,
          value: warehouse.id,
          label: warehouse.warehouseName,
        };
      });
    });
  },
  methods: {
    messages() {
      return (this.type == 3 || this.type == 2) ? '请输入联系人电话' : '请输入快递单号'
    },
    reset() {
      this.form = {
        express_type: '',
        express_method: '',
        express_waybill_code: '',
        warehouse_id: '',
        warehouse_name: '',
        express_company_id: '',
        express_company_name: '',
        express_company_type_id: '',
        express_company_type_name: '',
        total_packages_count: 1,
        declared_value: 0,
        weight: 1,
        volume: 1,
        items: [],
        push: true,
      };
      if (this.type == 1 || this.type == 4) {
        this.form.express_type = 'electron';
      }
      if (this.type == 5 || this.type == 3 || this.type == 2) {
        this.form.express_type = 'manual';
        this.form.express_method = 'express';
      }
      this.selection = [];
    },
    async open(order_id, goodsList, order) {
      this.order = order;
      this.reset();
      this.goodsList = (goodsList || []).map(goods => {
        return {
          num: goods.count,
          count: goods.count,
          title: goods.title,
          id: goods.id,
          properties: goods.properties,
          spuName: goods.spuName,
        };
      });
      this.order_id = order_id;
      this.showFlag = true;
      this.tab = 'loading';
      await this.getList();
      if (this.list && this.list.length) {
        this.tab = 'list';
        return;
      }
      this.tab = 'edit';
      this.$nextTick(() => {
        // this.$refs.goodsTable.clearSelection();
        // this.$refs.goodsTable.toggleAllSelection();
      });
    },
    async getList() {
      // const { data } = await getElectronicsheetPackageList(this.order_id);
      this.list = [];
    },
    canUseTicket(row) {
      return true;
    },
    getCompany() {
      for (let i = 0; i < this.companies.length; i++) {
        const company = this.companies[i];
        if (company.id == this.form.express_company_id) {
          return company;
        }
      }
      return null;
    },
    getWarehouse() {
      for (let i = 0; i < this.warehouses.length; i++) {
        const warehouse = this.warehouses[i];
        if (warehouse.id == this.form.warehouse_id) {
          return warehouse;
        }
      }
      return null;
    },
    addTicket() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return;
        }
        try {
          this.tab = 'loading';
          const confirmSend = await this.$modal.confirm('确定要立即发货吗?', '提示').catch(() => false);
          const { data: shop } = await getShop(this.order.channelShopId);
          if (!confirmSend) {
            this.tab = 'edit';
            return;
          }
          if (this.form.express_type == 'electron') {
            const company = this.getCompany();
            console.log(company)
            const warehouse = this.getWarehouse();
            if (company) {
              const area_names = await getAreaFieldsById(this.order.receiverAreaId, 'name');
              console.log(area_names);
              if (company.type == 'kdbird') {
                let das = await setOrderExpressPassByKdbird(
                  {
                    order_id: this.order_id || this.order.id,
                    currencyCode: 'CHY',
                    isSubscribe: 1,
                    wareHouseID: this.form.warehouse_id,
                    addService: null,
                    customArea: this.order.userRemark,
                    theOrderCode: this.order.id,
                    commodity: this.goodsList.map(goods => {
                      return {
                        refOlId: goods.channelOrderGoodsId,
                        refSkuId: goods.channelOrderGoodsSkuId,
                        goodsName: goods.spuName || '商品',
                        goodsquantity: goods.count,
                      };
                    }),
                    expType: company.config.expType,
                    templateSize: company.template.id,
                    sender: {
                      mobile: warehouse.sendMobile,
                      address: warehouse.sendDetail,
                      tel: warehouse.sendPhone,
                      provinceName: warehouse.sendState,
                      cityName: warehouse.sendCity,
                      expAreaName: warehouse.sendDistrict,
                      company: warehouse.warehouseName,
                      postCode: '100000',
                      name: warehouse.sendName,
                    },
                    remark: '',
                    shipperCode: company.kdnCode,
                    customerName: company.config.customerName,
                    customerPwd: company.config.customerPwd,
                    sendSite: company.config.sendSite,
                    sendStaff: company.config.sendStaff,
                    monthCode: company.config.monthCode,
                    orderCode: this.order.no,
                    payType: company.config.payType,
                    receiver: {
                      mobile: this.order.receiverMobile,
                      address: this.order.receiverDetailAddress,
                      tel: this.order.receiverMobile,
                      provinceName: area_names[0],
                      cityName: area_names[1],
                      expAreaName: area_names[2],
                      postCode: this.order.receiverPostCode,
                      name: this.order.receiverName,
                    },
                    quantity: this.form.total_packages_count,
                    weight: this.form.weight,
                    volume: this.form.volume,
                    cost: 0,
                    otherCost: 0,
                    isReturnPrintTemplate: 0,
                    transType: company.config.transType,
                    packingType: 4,
                    deliveryMethod: 1,
                    callback: undefined,
                    isNotice: 1,
                    startDate: undefined,
                    endDate: undefined,
                    memberID: this.order.userId,
                    isReturnSignBill: 0, //是否签回单
                    operateRequire: '',
                    isSendMessage: 0,
                    logisticCode: undefined,
                    dot3LogisticCode: company.dot3Code,
                  },
                  shop?.shopCode && this.order.channel && company.dot3Code
                    ? {
                      refOid: this.order.channelOrderNo,
                      posCode: shop?.shopCode,
                      feature: '',
                    }
                    : null,
                );
                if (das.data) {
                  // 加一个发货成功判断
                  this.tab = 'edit';
                  this.showFlag = false;
                  this.$emit('success');
                };
                return;
              } else if (company.type == 'dot3') {
                if (shop) {
                  await setOrderExpressPassByDot3({
                    cpCode: company.config.id,
                    templateUrl: company.template?.url,
                    send: {
                      province: warehouse.sendState,
                      city: warehouse.sendCity,
                      district: warehouse.sendDistrict,
                      town: warehouse.sendStreet,
                      detail: warehouse.sendDetail,
                      name: warehouse.sendName,
                      mobile: warehouse.sendMobile,
                      phone: warehouse.sendPhone,
                    },
                    packages: [
                      {
                        outerCode: this.order_id,
                        posCode: shop.shopCode,
                        refOid: this.order.channelOrderNo,
                        items: this.goodsList.map(item => {
                          return {
                            name: item.spuName || '商品',
                            num: item.count,
                          };
                        }),
                        receipt: {
                          province: area_names[0],
                          city: area_names[1],
                          district: area_names[2],
                          town: '',
                          detail: this.order.receiverDetailAddress,
                          name: this.order.receiverName,
                          mobile: this.order.receiverMobile,
                          phone: this.order.receiverMobile,
                        },
                        channelType: 'OTHERS',
                        totalPackagesCount: this.form.total_packages_count,
                        declaredValue: this.form.declared_value,
                        volume: this.form.volume,
                        weight: this.form.weight,
                        packageId: '',
                      },
                    ],
                  });
                  return;
                }
              }
            }

            this.$message.error('快递公司无效');
            this.tab = 'edit';
            return;
          } else if (this.form.express_method == 'express') {
            await setOrderExpressPass({
              id: this.order_id,
              logisticsId: this.form.express_company_type_id,
              logisticsNo: this.form.express_waybill_code,
            });
          } else {
            if (!this.order.channel) {
              this.$message.error('商城订单暂不支持无物流发货');
              this.tab = 'edit';
              return;
            }
            if (shop) {
              await setOrderExpressPassByDot3Virtual({
                refOid: this.order.channelOrderNo,
                posCode: getShop.shopCode,
              });
            } else {
              this.showFlag = true;
              this.tab = 'edit';
            }
          }
          this.showFlag = false;
          this.$emit('success');
        } catch (e) {
          this.showFlag = true;
          this.tab = 'edit';
        }
      });
    },
    handleSelectCompany() {
      this.$refs.expressCompanySelect.open(this.order_id);
    },
    handleSelectWarehouse() {
      this.$refs.warehouseSelect.open(this.order_id);
    },
    setExpressCompany(company) {
      this.form.express_company_id = company.id;
      this.form.express_company_name = company.name;
      this.company = company;
    },
    setWarehouse(warehouse) {
      this.form.warehouse_id = warehouse.id;
      this.form.warehouse_name = warehouse.name;
    },
    async sendTicket(row) {
      /**
       1选中发货-全部
       2行发货
       */
      // let isAll = !row;
      // const rows = isAll ? this.$refs.ticketTable.selection : [row];
      // if (this.list.length <= 1) {
      //   isAll = true;
      //   rows.splice(0, rows.length, this.list[0]);
      // }
      // if (isAll && rows.length <= 0) {
      //   await this.$modal.confirm('当前未选择要发货的物流单,你确认要全部选择全部吗?', '提示');
      //   this.$refs.ticketTable.clearSelection();
      //   this.$refs.ticketTable.toggleAllSelection();
      //   rows.splice(0, rows.length, ...this.list);
      // }
      // await this.$modal.confirm(`你确认要${isAll ? '全部' : '部分'}发货吗?`, '提示');
      await this.$modal.confirm(`你确认要发货吗?`, '提示');
      this.showFlag = false;
      this.$emit('success');
    },
    cancel() {
      if (this.list && this.list.length) {
        this.tab = 'list';
      } else {
        this.showFlag = false;
      }
    },
    async confirmPrintTicket(row) {
      await this.$modal.confirm(`你确认要打印这账电子面单吗?`, '提示');
      this.showFlag = false;
    },
    async printTicket(row) {
      console.log(row);
    },
  },
};
</script>
