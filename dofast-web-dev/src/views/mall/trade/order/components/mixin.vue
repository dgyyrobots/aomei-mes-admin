<template>
  <el-dialog title="创建销售单" :visible.sync="showFlag" width="811px" center>
    <el-form ref="form" :model="form" :rules="rules" class="grid grid-cols-2" label-width="80px">
      <el-form-item label="销售单号" prop="saleNo">
        <el-input v-model="form.saleNo" placeholder="请输入销售单号" :readonly="autoGenFlag">
          <el-switch slot="append" v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成"
            @change="handleAutoGenChange(autoGenFlag)"></el-switch>
        </el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title" class="col-span-2">
        <el-input v-model="form.title" type="textarea" placeholder="请输入标题,用于便于识别"></el-input>
      </el-form-item>
      <el-form-item label="地址信息" prop="address" class="col-span-2">
        <el-input v-model="form.address" type="textarea" placeholder="请输入地址信息" :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="总价格" prop="price">
        <el-input v-model="form.price" placeholder="请输入总价格(单独记录)" />
      </el-form-item>
      <el-form-item label="销售员" props="saler">
        <el-input :value="form.saler ? form.salerName : ''" placeholder="请选择销售员" readonly>
          <el-button slot="append" @click="handleSelectUser('saler')" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="结算类型" prop="settlementMethod">
        <el-select v-model="form.settlementMethod">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.TRADE_MIXIN_SETTLEMENT_METHOD)" :key="dict.value"
            :value="dict.value" :label="dict.label">{{ dict.label }} </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预计交付" prop="estimatedDeliveryTime">
        <el-date-picker clearable v-model="form.estimatedDeliveryTime" type="date" value-format="timestamp"
          placeholder="选择预计交付时间" />
      </el-form-item>
      <el-form-item prop="orderList" label-position="top" label-width="auto" class="col-span-2"
        label="直接关联订单(将可关联相关任务,图片,商品)">
        <br />
        <el-button type="primary" @click="handleSelectOrder()">添加其他订单</el-button>
        <el-button type="warning" @click="handleSelectOrder(true)">添加相关订单</el-button>
        <el-table :data="form.orderList">
          <el-table-column label="订单编号" align="center" key="no" prop="no" width="185px" />
          <el-table-column label="用户编号" align="center" key="userId" prop="userId" :show-overflow-tooltip="true"
            width="80px" />
          <el-table-column label="支付金额" align="center" key="payPrice" prop="payPrice" :show-overflow-tooltip="true"
            width="80px">
            <template v-slot="{ row }">
              <div>￥{{ row.payPrice ? (row.payPrice / 100).toFixed(2) : '0.00' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="收件人手机号" align="center" key="receiverMobile" prop="receiverMobile" width="120px" />
          <el-table-column label="收件人" align="center" key="receiverName" prop="receiverName"
            :show-overflow-tooltip="true" width="120px" />
          <el-table-column label="收件地址" align="center" key="receiverAreaName" prop="receiverAreaName"
            :show-overflow-tooltip="true" width="180px" />
          <el-table-column label="状态" align="center" key="status">

            <template v-slot="scope">
              <dict-tag :type="DICT_TYPE.TRADE_ORDER_STATUS" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">

            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60px" fixed="right">

            <template v-slot="{ $index, row }">
              <div v-if="row.id != mainOrderId">
                <el-link type="danger" @click="removeOrder($index)">移出</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label-width="auto" class="col-span-2" label="关联物料">
        <ItemSelect ref="itemSelect" @onSelected="onItemSelected"></ItemSelect>
        <el-button type="primary" @click="handleSelectProduct">添加物料</el-button>
        <el-table :data="list">
          <el-table-column label="物料编码" width="120" align="center" key="itemCode" prop="itemCode"> </el-table-column>
          <el-table-column label="物料名称" min-width="120" align="left" key="itemName" prop="itemName"
            :show-overflow-tooltip="true" />
          <el-table-column label="规格型号" align="left" key="specification" prop="specification"
            :show-overflow-tooltip="true" />
          <el-table-column label="单位" align="center" key="unitOfMeasure" prop="unitOfMeasure"
            :show-overflow-tooltip="true" />
          <el-table-column label="物料/产品" align="center" key="itemOrProduct" prop="itemOrProduct"
            :show-overflow-tooltip="true">

            <template slot-scope="scope">
              <dict-tag :options="dict.type.mes_item_product" :value="scope.row.itemOrProduct" />
            </template>
          </el-table-column>
          <el-table-column label="所属分类" align="center" key="itemTypeName" prop="itemTypeName" width="120" />
          <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column> -->
        </el-table>
      </el-form-item>
      <el-form-item prop="pics" label-width="auto" class="col-span-2" label="产品资料"
        @paste.native.capture.prevent="handlePaste">
        <br />
        <el-button type="primary" @click="handleSelectImage('tasks')">添加任务采集的图片</el-button>
        <el-button type="warning" @click="handleSelectImage('orders')">选择订单中的图片</el-button>
        <!--        <el-button type="warning" @click="handleSelectImage('goods')">选择商品中的图片</el-button>-->
        <el-upload ref="uploadMutiple" class="!inline-block ml-2" :accept="fileAccept" :show-file-list="false"
          :action="uploadFileUrl" :on-success="handleUploadSuccess" :before-upload="handleBeforeUpload" name="file"
          :headers="headers">
          <el-button type="success">上传商品图片</el-button>
        </el-upload>
        <div class="relative mt-5" v-if="form.pics.length">
          <!-- <div class="group-item w-56 h-36 overflow-hidden relative inline-block mr-5 mb-5" v-for="(pic, i) in form.pics"
            :key="i">
            <template v-if="(pic.url || pic).substr(-3) != 'zip'">
              <img :src="pic.url" class="w-full" />
              <div class="flex-center inset-0 absolute group-item-hover-visible bg-gray-4 bg-opacity-50">
                <div class="p-2" @click="form.pics.splice(i, 1)">
                  <i class="el-icon-delete-solid c-white text-10"></i>
                </div>
              </div>
            </template>
          </div> -->
          <div class="flex" style="flex-wrap: wrap;">

            <template v-for="(item, i) in form.pics">
              <!-- v-if="(item.url || item).substr(-3) == 'zip'" -->
              <div :key="i"
                class="w-60 h-60 border border-solid border-gray overflow-hidden mr-2 mb-2 flex flex-center flex-col"
                :style="`background-image: url(${item.url || item});background-size: cover;`">
                <i class="el-icon-document text-5xl"></i>
                <!-- :href="(item.url || item)" -->
                <el-link class="mt-2" @click.stop="xinyetiaozhuan(item.url || item)">{{ (item.url ||
    item).split('.').pop().toUpperCase()
                  }}(点击下载)</el-link>
              </div>
            </template>
          </div>
        </div>
        <el-empty v-else :image-size="120"></el-empty>
      </el-form-item>
    </el-form>
    <UserSelect ref="userSelect" @onSelected="setUser"></UserSelect>
    <TradeOrderSelect ref="orderSelect" @onSelected="addOrders"></TradeOrderSelect>
    <TradeGoodsSelect ref="goodsSelect" @onSelected="addGoods"></TradeGoodsSelect>
    <ImageSelect ref="imageSelect" @onSelected="addImages"></ImageSelect>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import UserSelect from '@/components/userSelect/single.vue';
import TradeOrderSelect from '@/components/tradeOrderSelect/mutli.vue';
import TradeGoodsSelect from '@/components/tradeGoodsSelect/mutli.vue';
import ImageSelect from '@/components/imageSelect/mutli.vue';
import { genCode } from '@/api/mes/autocode/rule';
import { flatten, uniq, compact, reduce, difference } from 'lodash';
import { getProductCategoryList } from '@/api/mall/product/category';
import { getAccessToken } from '@/utils/auth';
import { createMixinOrder, createMixinOrder2, updateStatWl } from '@/api/mall/trade/mixinOrder';
import ItemSelect from '@/components/itemSelect/single.vue';
import { getOrderPage } from '@/api/mall/trade/order';
export default {
  dicts: ['sys_yes_no', 'mes_item_product'],
  components: { UserSelect, TradeOrderSelect, TradeGoodsSelect, ImageSelect, ItemSelect },
  data() {
    return {
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/admin-api/infra/file/upload', // 请求地址
      headers: { Authorization: 'Bearer ' + getAccessToken() }, // 设置上传的请求头部
      autoGenFlag: true,
      showFlag: false,
      goodsCategories: [],
      fileAccept: 'image/*',
      userField: '',
      form: {
        saleNo: '',
        title: '',
        address: '',
        price: '',
        saler: '',
        salerName: '',
        settlementMethod: '',
        estimatedDeliveryTime: '',
        pics: [],
        orderList: [],
        goodsList: [],
        ids: [],
      },
      rules: {
        saleNo: [{ required: true, message: '销售订单号不能为空', trigger: 'blur' }],
        saler: [{ required: true, message: '销售员不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        settlementMethod: [{ required: true, message: '结算类型不能为空', trigger: 'blur' }],
        estimatedDeliveryTime: [{ required: true, message: '预计发货时间不能为空', trigger: 'blur' }],
        orderList: [{ type: 'array', required: true, message: '关联订单不能为空', trigger: 'blur' }],
      },
      mainOrderId: 0,
    };
  },
  created() {
    getProductCategoryList().then(({ data }) => {
      this.goodsCategories = (data || []).map(item => {
        return {
          ...item,
          value: item.id + '',
          label: item.name,
        };
      });
    });
  },
  activated() {
    this.handleAutoGenChange(true);
  },
  methods: {
    xinyetiaozhuan(url) {
      window.open(url)
    },
    onItemSelected(obj) {
      this.form.ids.push(obj.id);
      this.list.push(obj);
    },
    handleSelectProduct() {
      this.$refs.itemSelect.showFlag = true;
    },
    async open(order, tasks) {
      (tasks || []).map(item => item.record.files).filter(item => item)
      let pics = [];
      (tasks || []).forEach(item => {
        if (item?.record?.main?.length) {
          item.record.main.map(ite => ite.image ? pics.push(ite.image) : null);
        }
        if (item?.record?.files) {
          pics = [...pics, ...item.record.files.split(',')]
        };

      })
      let confirm;
      this.form = {
        saleNo: '',
        // order.receiverAreaName,
        title: [order.receiverMobile, order.receiverName, (order.items || []).map(({ spuName, count }) => (spuName && count ? (count == 1 ? spuName : `${spuName} x ${count}`) : '')).join(' ')].join(' '),
        price: (order.payPrice / 100).toFixed(2),
        saler: '',
        salerName: '',
        settlementMethod: '',
        estimatedDeliveryTime: '',
        pics,
        orderList: [],
        goodsList: [],
        ids: [],
      };

      this.list = [];
      if (order.systemUserId) {
        confirm = await this.$modal.confirm('你需要使用该订单的销售员管理该销售单吗?', '提示').catch(() => false);
        if (confirm) {
          this.form.saler = order.systemUserId;
          this.form.salerName = order.systemUserName;
        }
      } else {
        confirm = await this.$modal.confirm('该订单暂无销售员,您要成为该销售单的销售员吗?', '提示').catch(() => false);
        if (confirm) {
          this.form.saler = this.$store.getters.userId;
          this.form.salerName = this.$store.getters.nickname;
        }
      }
      this.mainOrderId = order.id;
      let orders = await getOrderPage({ userMobile: order.receiverMobile, receiverName: order.receiverName })
      this.form.orderList = orders.data.list.some(x => x.id == order.id) ? orders.data.list : [order, ...orders.data.list];
      this.form.price = (this.form.orderList.reduce((result, { payPrice }) => payPrice + result, 0) / 100).toFixed(2);
      confirm = await this.$modal.confirm('你要导入该订单的收件信息吗?', '提示').catch(() => false);
      if (confirm) {
        this.form.address = [
          ['收件人', order.receiverName],
          ['收件电话', order.receiverMobile],
          ['收件区域', order.receiverAreaName],
          ['收件地址', order.receiverDetailAddress],
        ]
          .map(row => row.join(': '))
          .join('\n');
      }
      this.handleAutoGenChange(true);
      setTimeout(() => {
        this.showFlag = true;
      }, 300);
    },
    // 上传成功回调
    handleUploadSuccess(res) {
      if (res.data) {
        this.form.pics.push({ url: res.data, type: 'custom' });
        console.log(this.form.pics)
      } else {
        this.$message.error('上传失败');
      }
      // edit by 惠制造
      this.$modal.closeLoading();
    },
    // 上传前loading加载
    handleBeforeUpload(file) {
      this.$modal.loading('正在上传图片，请稍候...');
      this.number++;
    },
    handleSelectUser(field) {
      this.userField = field;
      this.$refs.userSelect.showFlag = true;
    },
    handleSelectOrder(hasRelation) {
      this.$refs.orderSelect.open(this.form.orderList, hasRelation);
    },
    handleSelectImage(type) {
      this.$refs.imageSelect.open(
        type,
        uniq(compact(this.form.pics.map(({ url }) => url))),
        {
          orders: this.form.orderList,
          goods: this.form.goodsList,
          tasks: this.form.orderList,
        }[type],
      );
    },
    handleSelectGoods(isIn) {
      const goodsIds = uniq(compact(this.form.goodsList || []).map(({ id }) => id));
      const orderGoodsSpuIds = reduce(
        [flatten, uniq, compact],
        (result, fn) => fn(result),
        (this.form.orderList || []).map(({ items }) => {
          return (items || []).map(({ spuId }) => {
            return spuId;
          });
        }),
      );
      if (isIn) {
        this.$refs.goodsSelect.open(difference(orderGoodsSpuIds, goodsIds), goodsIds);
        return;
      }
      this.$refs.goodsSelect.open(null, uniq(goodsIds.concat(orderGoodsSpuIds)));
    },
    handleAutoGenChange(flag) {
      if (flag) {
        genCode('TRADE_MIXIN_CODE').then(response => {
          this.form.saleNo = response;
        });
      } else {
        this.form.saleNo = null;
      }
    },
    setUser(user) {
      this.form[this.userField] = user.id;
      this.form[this.userField + 'Name'] = user.nickname;
    },
    addOrders(orders) {
      this.form.orderList = this.form.orderList.concat(orders);
      this.reprice();
    },
    addGoods(goods) {
      this.form.goodsList = this.form.goodsList.concat(
        goods.map(item => {
          return {
            ...item,
            num: 1,
          };
        }),
      );
    },
    addImages(images) {
      this.form.pics = this.form.pics.concat(images);
      console.log(this.form.pics);
    },
    async confirm() {
      await this.$refs.form.validate();
      const formData = {
        ...this.form,
        pics: JSON.stringify(this.form.pics),
        goodsList: JSON.stringify(
          this.form.goodsList.map(spu => {
            return {
              spuId: spu.id,
              skuId: sku.id,
              num: spu.num,
            };
          }),
        ),
        orderList: this.form.orderList.map(({ id }) => id),
      };
      // console.log(formData);
      // return;
      const mixinOrderId = await createMixinOrder(formData);
      await updateStatWl({ ids: formData.ids.join(','), id: mixinOrderId.data });
      this.$emit('success');
      this.$message.success('创建销售订单成功');
      this.showFlag = false;
      setTimeout(async () => {
        await this.$modal.confirm('是否立即查看销售单详情');
        this.$router.push({ name: 'TradeMixinOrderDetail', query: { id: mixinOrderId.data } });
      }, 300);
    },
    removeOrder(rowIndex) {
      if (this.form.orderList[rowIndex].id == this.mainOrderId) {
        this.$message.warning('请主订单无法移除');
        return;
      }
      if (this.form.orderList.length <= 1) {
        this.$message.warning('请至少保留一个订单');
        return;
      }
      this.form.orderList.splice(rowIndex, 1);
      this.reprice();
    },
    async removeGoods(rowIndex) {
      const sure = await this.$modal.confirm('你确定要删除这条商品吗?', '提示').catch(() => false);
      if (sure) {
        this.form.goodsList.splice(rowIndex, 1);
        return;
      }
      this.form.goodsList[rowIndex].num = 1;
    },
    async reprice() {
      await this.$modal.confirm('订单发生改变,您是否需要重新计算订单金额?', '提示');
      this.form.price = (this.form.orderList.reduce((result, { payPrice }) => payPrice + result, 0) / 100).toFixed(2);
    },
    handlePaste(event) {
      console.log('粘贴');
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;
      if (!items || items.length === 0) {
        this.$message.error("当前浏览器不支持本地");
        return;
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        this.$message.error("粘贴内容非图片");
        return;
      }
      // if (this.fileList.length >= this.limit) {
      //   this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`); // 图片数量超出
      //   return
      // }
      this.$refs.uploadMutiple.handleStart(file); // 将粘贴过来的图片加入预上传队列
      this.$refs.uploadMutiple.submit(); // 提交图片上传队列
    }
  },
};
</script>

<style lang="scss">
.group-item-hover-visible {
  display: none;
}

.group-item:hover .group-item-hover-visible {
  display: flex;
}
</style>
