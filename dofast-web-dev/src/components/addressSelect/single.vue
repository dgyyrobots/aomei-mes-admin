<template>
  <div>
    <el-dialog title="选择收货地址" v-if="showFlag" :visible.sync="showFlag" modal>
      <div>
        <el-button type="primary" @click="addAddress()">添加收货地址</el-button>
        <el-button type="primary" icon="el-icon-refresh" circle @click="getList()"></el-button>
        <el-form-item label="姓名" style="display: inline-block;">
          <el-input v-model="sx.xm" @input="change" clearable style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="地址" style="display: inline-block;">
          <el-input v-model="sx.dz" @input="change" clearable style="width: 220px"></el-input>
        </el-form-item>
      </div>
      <el-table :data="lists" @current-change="handleCurrent" @row-dblclick="handleRowDbClick">
        <el-table-column width="50" align="center">
          <template v-slot="scope">
            <el-radio v-model="selectedId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ '' }} </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="收件人" prop="name" width="90px"></el-table-column>
        <el-table-column label="收件电话" prop="mobile" width="120px"></el-table-column>
        <el-table-column label="邮编" prop="postCode" width="75px"></el-table-column>
        <el-table-column label="地址" width="250px">
          <template v-slot="{ row }">
            <div>{{ row.areaName }}{{ row.detailAddress }}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否默认" width="75px">
          <template v-slot="{ row }">
            <el-tag v-if="row.defaulted" type="primary">默认</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180px">
          <template v-slot="{ row }">
            <div>{{ parseTime(row.createTime) }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
        <el-button @click="showFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <AddAddressDetail ref="addDetail" @onCreated="handleRowDbClick($event)"></AddAddressDetail>
  </div>
</template>
<script>
import { getAddressListByUserId } from '@/api/member/address';
import { getAreaFieldsById } from '@/api/system/area';
import AddAddressDetail from '@/components/addAddressDetail/single.vue';

export default {
  components: { AddAddressDetail },
  data() {
    return {
      list: [],
      userId: 0,
      selectedId: 0,
      selectedRow: null,
      showFlag: false,
      sx: {
        xm: '',
        dz: ''
      },
      fag: null,
      lists: []
    };
  },
  methods: {
    change() {
      clearInterval(this.fag);
      this.fag = setTimeout(() => {
        if (!this.list.length) return;
        let das = [];
        das = this.list.filter(item => ((new RegExp(this.sx.xm)).test(item.name)));
        console.log(das, '筛选姓名');
        das = das.filter(item => ((new RegExp(this.sx.dz)).test(item.areaName) || (new RegExp(this.sx.dz)).test(item.detailAddress)));
        console.log(das, '第二次筛选地址')
        // && ((new RegExp(this.sx.dz)).test(item.areaName) || (new RegExp(this.sx.dz)).test(item.detailAddress))
        this.lists = das;
      }, 300)
    },
    addAddress() {
      this.$refs.addDetail.open(this.userId);
    },
    open(userId) {
      this.userId = userId;
      this.getList();
      this.showFlag = true;
    },
    getList() {
      this.list = [];
      getAddressListByUserId(this.userId).then(async res => {
        const addresses = await Promise.all(
          res.data.map(async address => {
            const names = await getAreaFieldsById(address.areaId, 'name');
            return {
              ...address,
              areaName: names.join(''),
            };
          }),
        );
        console.log(addresses);
        this.list = addresses;
        this.lists = addresses;
      });
    },
    handleRowChange(row) {
      this.selectedId = row.id;
      this.selectedRow = row;
    },
    handleCurrent() {
      console.log(arguments);
    },
    handleRowDbClick(row) {
      this.handleRowChange(row);
      this.confirmSelect();
    },
    confirmSelect() {
      if (this.selectedRow && this.selectedRow.id) {
        this.$emit('onSelected', this.selectedRow);
        this.showFlag = false;
        return;
      }
      this.$notify({
        title: '提示',
        type: 'warning',
        message: '请至少选择一条数据!',
      });
    },
  },
};
</script>
