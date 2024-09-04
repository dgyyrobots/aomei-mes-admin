<template>
  <el-dialog v-loading="tab == 'loading'" title="打印电子面单" v-if="showFlag" :visible.sync="showFlag" width="800px" center>
    <el-form v-if="tab == 'edit'" ref="form" :model="form" :rules="rules" label-width="90px"
      class="grid grid-cols-2 gap-4">
      <el-form-item label="物流公司" prop="express_company_id">
        <el-input :value="form.express_company_id ? form.express_company_name : ''" placeholder="请选择物流公司" readonly>
          <el-button slot="append" @click="handleSelectCompany()" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="发货仓库" prop="warehouse_id">
        <el-input :value="form.warehouse_id ? form.warehouse_name : ''" placeholder="请选择发货仓库" readonly>
          <el-button slot="append" @click="handleSelectWarehouse()" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="包裹数量" prop="total_packages_count">
        <el-input-number v-model="form.total_packages_count" placeholder="请输入包裹数量" :min="1" controls-position="right" />
      </el-form-item>
      <el-form-item label="保价金额(元)" prop="declared_value" label-width="100px">
        <el-input-number v-model="form.declared_value" placeholder="请输入保价金额" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="体积(ml)" prop="volume">
        <el-input-number v-model="form.volume" placeholder="请输入包裹体积" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="重量(g)" prop="weight">
        <el-input-number v-model="form.weight" placeholder="请输入包裹重量" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="发货" prop="push">
        <el-radio-group v-model="form.push">
          <el-radio :key="true" :label="true">是</el-radio>
          <el-radio :key="false" :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发货商品" prop="items" class="col-span-2" label-class="block">
        <el-table :data="goodsList" :show-header="false" ref="goodsTable" @selection-change="form.items = $event">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="title">
            <template v-slot="{ row }">
              {{ row.spuName }}
              <el-tag size="medium" v-for="property in row.properties" :key="property.propertyId"> {{
                property.propertyName }}：{{ property.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="num" width="155">
            <template v-slot="{ row }">
              <el-input-number v-model="row.count" :min="1" :max="row.num" v-if="row.num > 1" size="mini" />
              <div class="text-center" v-else>{{ row.num }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div v-else-if="tab == 'list'">
      <el-form>
        <el-form-item>
          <el-button type="default" @click="tab = 'edit'">添加面单</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" ref="ticketTable">
        <el-table-column type="selection" width="55" :selectable="canUseTicket"> </el-table-column>
        <el-table-column label="物流单号" width="180"></el-table-column>
        <el-table-column label="物流公司"></el-table-column>
        <el-table-column label="创建时间" width="120"></el-table-column>
        <el-table-column label="状态" width="60"></el-table-column>
        <el-table-column label="操作" width="120">
          <template v-slot="{ row }">
            <el-button type="text" @click="printTicket(row)">打印</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer" v-if="tab == 'edit'">
      <el-button type="primary" @click="addTicket">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
    <WarehouseSelect ref="warehouseSelect" @onSelected="setWarehouse"></WarehouseSelect>
    <ExpressCompanySelect ref="expressCompanySelect" @onSelected="setExpressCompany"></ExpressCompanySelect>
  </el-dialog>
</template>
<script>
import WarehouseSelect from '@/components/warehouseSelect/address.vue';
import ExpressCompanySelect from '@/components/expressCompanySelect/single.vue';
import { getElectronSheetList } from '@/api/system/expressElectronicsheet.js';
export default {
  components: { WarehouseSelect, ExpressCompanySelect },
  data() {
    return {
      showFlag: false,
      order_id: 0,
      tab: 'edit',
      list: [],
      goodsList: [],
      form: {
        warehouse_id: 0,
        warehouse_name: '',
        express_company_id: 0,
        express_company_name: '',
        total_packages_count: 1,
        declared_value: 0,
        weight: 0,
        volume: 0,
        items: [],
        push: false,
      },
      rules: {
        warehouse_id: [{ type: 'number', min: 1, required: true, message: '请选择发货仓库', trigger: 'blur' }],
        express_company_id: [{ type: 'number', min: 1, required: true, message: '请选择物流公司', trigger: 'blur' }],
        items: [{ type: 'array', required: true, message: '请选择发货商品', trigger: 'blur' }],
      },
    };
  },
  methods: {
    reset() {
      this.form = {
        warehouse_id: 0,
        warehouse_name: '',
        express_company_id: 0,
        express_company_name: '',
        total_packages_count: 1,
        declared_value: 0,
        weight: 0,
        volume: 0,
        items: [],
        push: false,
      };
    },
    async open(order_id, goodsList) {
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
        this.$refs.goodsTable.clearSelection();
        this.$refs.goodsTable.toggleAllSelection();
      });
    },
    async getList() {
      const { data } = await getElectronSheetList(this.order_id);
      console.log(data);
      this.list = data;
    },
    addTicket() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        this.tab = 'loading';
        setTimeout(() => {
          this.showFlag = false;
          this.$modal.confirm('电子面单已生成,你确认要立刻打印吗?', '提示').then(ret => {
            console.log(ret);
          });
        }, 1000);
      });
    },
    handleSelectCompany() {
      this.$refs.expressCompanySelect.open(this.order_id);
    },
    handleSelectWarehouse() {
      this.$refs.warehouseSelect.open(this.order_id);
    },
    setExpressCompany(company) {
      this.form.express_company_id = company.id * 1;
      this.form.express_company_name = company.name;
      this.company = company;
    },
    setWarehouse(warehouse) {
      this.form.warehouse_id = warehouse.id;
      this.form.warehouse_name = warehouse.name;
    },
    cancel() {
      if (this.list && this.list.length) {
        this.tab = 'list';
      } else {
        this.showFlag = false;
      }
    },
    async printTicket(row) {
      await this.$modal.confirm(`你确认要打印这账电子面单吗?`, '提示');
      this.showFlag = false;
    },
  },
};
</script>
