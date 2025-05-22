<template>
  <Card class="StaffInfo" content-padding="6px 0" :title="`员工信息(${currentName})`">
    <template #titleRight>
      <div class="tabs">
        <span :calss="{active: active == 0 }" class="tab" @click="active=0"> 白班 </span>
        <span :calss="{active: active == 1 }" class="tab" @click="active=1"> 夜班 </span>
      </div>
    </template>
    <div class="scroll-board">
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index" :class="{ warning: row[3] === '警告' }">
            <td
              v-for="(getField, cellIndex) in tableFields"
              :key="cellIndex"
              :class="{
                'status-online': cellIndex === 3 && getField(row) === '在线',
                'status-offline': cellIndex === 3 && getField(row) === '离线',
              }"
            >
              {{ getField(row) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'StaffInfo',
  components: {
    Card,
  },
  props: {
    current: {
      type: Number,
      default: 0,
    },
    data: {
      type: Array,
      default: () => [
        [],
        []
      ]
    }
  },
  data() {
    return {
      active: this.current,
      tableHeaders: ['姓名', '工号', '职位', '状态'],
      tableFields: [
        (row) => row.nickName,
        (row) => row.userName,
        (row) => row.principalName == row.nickName ? '组长' : row.principalName,
        (row) => row.postIds
      ],
    }
  },
  computed: {
    tableData() {
      return this.data[this.active]
    },
    currentName() {
      return {
        0: '白班',
        1: '夜班',
      }[this.current]
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs{
  .tab {
    padding: 0 10px;
    color: #fff;
    &.active {
      background: #00bcd4;
      color: #fff;
    }
  }
}
.StaffInfo {
  width: 100%;
  height: 100%;
  /* background: rgba(10, 30, 60, 0.85); */
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;

  .scroll-board {
    height: 100%;
    overflow: hidden;

    table {
      width: 100%;
      border-collapse: collapse;

      th {
        padding: 10px 6px;
        text-align: center;
        font-size: 15px;
        color: #00bcd4;
        border-bottom: 1px solid rgba(0, 188, 212, 0.3);
      }

      td {
        padding: 12px 6px;
        text-align: center;
        font-size: 15px;
        color: #86c9f2;
        border-bottom: 1px solid rgba(0, 161, 255, 0.2);
      }

      tr {
        transition: all 0.3s;

        &:nth-child(even) {
          background: rgba(#00a1ff, 0.05);
        }

        &.warning {
          background: rgba(#ffb74d, 0.1);

          td {
            color: #ffb74d;
          }
        }

        &:hover {
          background: rgba(#00a1ff, 0.15);
        }
      }
    }
  }

  .query-btn {
    background-color: #00bcd4;
    color: #fff;
    border: none;
    padding: 4px 15px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #19b8e6;
    }
  }
}

.status-online {
  color: #22cc55 !important;
  font-weight: 500;
}

.status-offline {
  color: #999999 !important;
  font-weight: 400;
}
</style>
