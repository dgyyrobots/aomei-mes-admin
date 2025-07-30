<template>
  <div class="center-bottom-container">
    <!-- 左侧当板信息 -->
    <!-- <div class="top-action-btns">
      <button class="cyber-btn">
        <i class="btn-icon el-icon-s-grid" :style="{ color: '#1ecfff' }" />
        任务明细
      </button>
      <button class="cyber-btn">
        <i class="btn-icon el-icon-search" />
        报表查询
      </button>
    </div> -->
    <div class="panel-container">
      <div class="left-panel">
        <div class="cyber-divider divider1">
          <svg height="8" viewBox="0 0 148 8" width="148">
            <!-- 左4个短条 -->
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="0" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="9" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="18" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="27" y="2" />
            <!-- 中间长条 -->
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="40" x="36" y="2" />
            <!-- 右3个短条 -->
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="82" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="91" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="100" y="2" />
            <defs>
              <filter id="glow" height="24" width="40" x="-10" y="-10">
                <feGaussianBlur result="coloredBlur" stdDeviation="2" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
        <div class="panel-title">上料明细</div>
        <div class="panel-content">
          <div class="scroll-board" v-if="data && data.length">
            <table>
              <thead>
                <tr>
                  <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in tableFields" :key="index">
                  <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <el-empty title="请双击批次产出明细"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MesIssueLine',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      searchKeyword: '',
      tableHeaders: ['日期', '版号', '领用量', '领料人'],
      tableFields: [
        (row) => this.parseDate(row.createTime),
        (row) => row.batchCode,
        (row) => row.quantityIssued + row.unitOfMeasure,
        (row) => row.creator,
      ],
    }
  },
  watch: {
    data: {
      handler(newData) {
        this.tableFields = newData.map((row) => {
          return this.tableFields.map((field) => {
            return typeof field === 'function' ? field(row) : field
          })
        })
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.center-bottom-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 20, 40, 0.7);

  .top-action-btns {
    width: 100%;
    display: flex;
    gap: 12px;
    margin-bottom: 14px;
    justify-content: flex-start;
  }

  .panel-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    height: calc(100% - 48px); /* 稍微减少一点高度确保边框可见 */
    margin-bottom: 2px; /* 添加底部margin */
  }

  .left-panel {
    flex: 1;
    position: relative;
    border: 1px solid #1ecfff;
    box-shadow: 0 0 5px rgba(30, 207, 255, 0.3);
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    .divider1 {
      position: absolute;
      top: -10px;
      left: -12px;
    }
  }

  .right-panel {
    width: 200px;
    border: 1px solid #1ecfff;
    box-shadow: 0 0 5px rgba(30, 207, 255, 0.3);
    position: relative;
    .divider2 {
      position: absolute;
      top: -10px;
      left: -12px;
    }
  }

  .panel-title {
    height: 32px;
    width: 100%;
    // background: linear-gradient(90deg, #1ecfff 40%, #1ecfff00 100%);
    display: flex;
    align-items: center;
    padding-left: 16px;
    color: #eef1f2;
    font-size: 16px;
    letter-spacing: 2px;
    text-shadow: 0 0 6px #1ecfff88;
    line-height: 32px;
    // box-shadow: 0 0 8px 0 #1ecfff88;
  }

  .panel-content {
    padding: 16px 10px 10px 16px;
  }

  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    height: 32px;
  }

  .info-label,
  .info-label-right {
    color: #1ecfff;
    font-size: 14px;
    white-space: nowrap;
  }

  .info-label-right {
    margin-left: auto;
    margin-right: 10px;
  }

  .info-value {
    color: #fff;
    font-size: 14px;
    margin-right: 20px;
    border-bottom: 1px solid rgba(30, 207, 255, 0.4);
    padding-bottom: 2px;
    min-width: 80px;
  }

  .flow-no {
    flex: 1;
    margin-right: 10px;
  }

  .action-buttons {
    margin-left: auto;
    display: flex;
    gap: 10px;
  }

  .query-btn {
    background-color: #1ecfff;
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

  .action-btn {
    background-color: transparent;
    border: 1px solid #1ecfff;
    color: #1ecfff;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;

    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
  }

  .select-box {
    display: flex;
    align-items: center;
    background-color: rgba(30, 207, 255, 0.1);
    border: 1px solid #1ecfff;
    padding: 4px 10px;
    border-radius: 2px;
    min-width: 120px;
    justify-content: space-between;

    span {
      color: #fff;
    }
  }

  .icon-placeholder {
    width: 30px;
    height: 30px;
  }

  .timestamp {
    position: absolute;
    top: 8px;
    right: 20px;
    color: #ffff00;
    font-size: 14px;
  }

  .right-row {
    display: flex;
    margin-bottom: 20px;
  }

  .right-label {
    color: #1ecfff;
    font-size: 14px;
    white-space: nowrap;
  }

  .right-value {
    color: #fff;
    font-size: 14px;
    margin-left: 5px;
  }
}

.cyber-divider {
  display: flex;
  justify-content: flex-start;
  margin: 0 0 8px 16px;
  pointer-events: none;
  user-select: none;
}

.cyber-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 30, 60, 0.18);
  border: 1.2px solid #1ecfff;
  color: #eef1f2;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  padding: 0 16px 0 14px;
  height: 32px;
  min-width: 90px;
  cursor: pointer;
  box-shadow: 0 0 6px 0 #1ecfff55;
  transition:
    border-color 0.2s,
    color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
  outline: none;
  justify-content: flex-start;
}

.cyber-btn:hover {
  border-color: #4fdfff;
  color: #fff;
  box-shadow: 0 0 10px 2px #1ecfff99;
  background: rgba(30, 207, 255, 0.1);
}

.btn-icon {
  font-size: 16px;
  margin-right: 4px;
  color: #1ecfff;
  vertical-align: middle;
  flex-shrink: 0;
}

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
</style>
