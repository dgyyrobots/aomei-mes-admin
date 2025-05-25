<template>
  <el-dialog
    :visible.sync="visible"
    class="time-registration-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="false"
    :modal-append-to-body="false"
    modal-class="cyber-modal"
    title="设备管理"
    :top="'8vh'"
    width="1200px"
  >
    <div class="dialog-content">
      <MesDvMachineryView />
    </div>

  </el-dialog>
</template>

<script>
import MesDvMachineryView from '@/views/mes/dv/machinery/index.vue'
// 控制对话框显示状态
export default {
  name: 'MesDvMachineryDialog',
  data() {
    return {
      visible: false,
    }
  },
  components: {
    MesDvMachineryView,
  },
  methods: {
    openDialog() {
      this.visible = true
    },
  },
  mounted() {
  },
}
</script>

<style lang="scss">
/* 全局样式，不使用scoped */
.cyber-modal {
  background-color: rgba(0, 21, 41, 0.85) !important;
  backdrop-filter: blur(5px);
}

/* 强制覆盖Element Plus对话框样式 */
.el-dialog__wrapper.time-registration-dialog {
  .el-dialog {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    margin-top: 8vh !important; /* 确保优先级足够高 */

    .el-dialog__body {
      padding: 0 !important;
    }

    .el-dialog__header {
      height: 40px !important;
      color: #1ecfff !important;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
    }

    .el-dialog__title {
      color: #1ecfff !important;
      font-weight: 500;
      letter-spacing: 1px;
      text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
      font-size: 16px;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #1ecfff !important;

      &:hover {
        color: #4fdcff !important;
      }
    }

    .el-dialog__body {
      padding: 0 !important;
    }
  }
}

/* 修改loading样式 */
.el-loading-mask {
  background-color: rgba(0, 21, 41, 0.7) !important;

  .el-loading-spinner {
    .circular {
      .path {
        stroke: #1ecfff !important;
      }
    }

    .el-loading-text {
      color: #1ecfff !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.time-registration-dialog {
  :deep(.el-dialog__body) {
    max-height: calc(100vh - 200px);
    overflow: hidden;
    padding: 0 !important;
  }
  :deep(.pagination-container) {
    background-color: transparent;
  }

  :deep(.el-dialog) {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    backdrop-filter: blur(5px);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    .el-dialog__header {
      padding: 4px 16px;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
      margin-right: 0;
    }

    .el-dialog__body {
      flex: 1;
      overflow: hidden;
    }

    .el-dialog__footer {
      padding: 10px 20px;
      border-top: 1px solid rgba(30, 207, 255, 0.3);
    }
  }

  :deep(.el-dialog__headerbtn) {
    top: 12px;
    right: 16px;
  }

  :deep(.el-dialog__headerbtn .el-dialog__close) {
    /* 移除这里的颜色设置，改为全局样式 */
  }

  :deep(.el-loading-mask) {
    background-color: rgba(0, 21, 41, 0.7) !important;
  }

  :deep(.el-loading-spinner .circular .path) {
    stroke: #1ecfff !important;
  }

  :deep(.el-loading-spinner .el-loading-text) {
    color: #1ecfff !important;
  }
  :deep(.el-tree) {
    background-color: transparent;
    color: #fff;
  }
  :deep(.el-form-item__label) {
    color: #fff;
  }
  .dialog-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .search-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-shrink: 0;

    .cyber-input {
      width: 300px;

      :deep(.el-input__wrapper) {
        background-color: rgba(13, 35, 65, 0.7);
        border: 1px solid #1ecfff;
        box-shadow: 0 0 8px rgba(30, 207, 255, 0.2);

        &.is-focus {
          box-shadow: 0 0 10px rgba(30, 207, 255, 0.4);
        }

        input {
          color: #eef1f2;
          background-color: transparent;

          &::placeholder {
            color: #8e9dab;
          }
        }
      }

      .search-icon {
        color: #1ecfff;
      }
    }
  }

  .table-divider {
    height: 1px;
    background: rgba(30, 207, 255, 0.3);
    margin: 10px 0 15px;
    width: 100%;
  }

  .table-container {
    position: relative;
    overflow: hidden;

    &.upper-table {
      height: 200px;
      margin-bottom: 10px;
      position: relative;
      z-index: 2;
    }

    &.bottom-table {
      flex: 1;
      min-height: 200px;
      position: relative;
      z-index: 1;
    }

    .table-border-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      border: 1px solid rgba(30, 207, 255, 0.5);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    .scroll-board {
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
      flex: 1;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(30, 207, 255, 0.4);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(13, 35, 65, 0.3);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        border: none;
        background-color: transparent;

        thead {
          position: sticky;
          top: 0;
          z-index: 15;

          &::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 1px;
            background-color: rgba(30, 207, 255, 0.5);
            z-index: 16;
          }

          &::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 1px;
            background-color: rgba(30, 207, 255, 0.5);
            z-index: 16;
          }

          tr {
            background-color: rgba(0, 21, 41, 0.95);
          }
        }

        th {
          padding: 8px 6px;
          text-align: center;
          font-size: 14px;
          color: #1ecfff;
          border: none;
          background-color: rgba(0, 21, 41, 0.95);
          font-weight: normal;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

          &:not(:last-child) {
            border-right: 1px solid rgba(30, 207, 255, 0.2);
          }
        }

        td {
          padding: 8px 6px;
          text-align: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          border: none;
          border-bottom: 1px solid rgba(0, 161, 255, 0.2);

          &:not(:last-child) {
            border-right: 1px solid rgba(30, 207, 255, 0.1);
          }
        }

        tr {
          transition: all 0.3s;

          &:nth-child(even) {
            background: rgba(13, 35, 65, 0.3);
          }

          &:hover {
            background: rgba(30, 207, 255, 0.1);
          }
        }

        .empty-data {
          padding: 30px 0;
          color: rgba(134, 201, 242, 0.6);
          font-size: 16px;
        }
      }
    }

    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      background-color: #1ecfff;
      border-color: #1ecfff;
    }

    :deep(.el-checkbox__inner) {
      background-color: rgba(30, 207, 255, 0.1);
      border-color: #1ecfff;
    }
  }

  .pagination-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 0;
    color: #1ecfff;
    font-size: 14px;
    flex-shrink: 0;
    height: 40px;

    &.top-pagination {
      margin-bottom: 5px;
    }

    .total-info {
      margin-right: 15px;
    }

    .page-size-selector {
      position: relative;
      margin-right: 15px;
      padding: 4px 8px;
      border: 1px solid rgba(30, 207, 255, 0.4);
      border-radius: 2px;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;

      .selector-icon {
        margin-left: 5px;
        font-size: 12px;
      }

      .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: rgba(0, 21, 41, 0.95);
        border: 1px solid #1ecfff;
        border-top: none;
        z-index: 10;

        .dropdown-item {
          padding: 4px 8px;

          &:hover {
            background-color: rgba(30, 207, 255, 0.2);
          }
        }
      }

      &:hover .dropdown-menu {
        display: block;
      }
    }

    .pagination-btns {
      display: flex;
      margin-right: 15px;

      .page-btn {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(30, 207, 255, 0.4);
        margin-right: 4px;
        cursor: pointer;
        user-select: none;
        border-radius: 2px;
        font-size: 13px;

        &:hover:not(.disabled) {
          background-color: rgba(30, 207, 255, 0.2);
        }

        &.active {
          background-color: #1ecfff;
          color: #001529;
          font-weight: bold;
        }

        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .page-jumper {
      display: flex;
      align-items: center;
      font-size: 13px;

      .jumper-input {
        width: 36px;
        height: 24px;
        background-color: rgba(13, 35, 65, 0.7);
        border: 1px solid rgba(30, 207, 255, 0.4);
        color: #eef1f2;
        text-align: center;
        margin: 0 5px;
        border-radius: 2px;
        outline: none;

        &:focus {
          border-color: #1ecfff;
          box-shadow: 0 0 5px rgba(30, 207, 255, 0.3);
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .status-tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 2px;
    color: #eef1f2;
    font-size: 12px;

    &.complete {
      background-color: rgba(103, 194, 58, 0.8);
    }

    &.in-progress {
      background-color: rgba(255, 153, 0, 0.8);
    }
  }

  .cyber-btn {
    background-color: rgba(30, 207, 255, 0.2);
    border: 1px solid #1ecfff;
    color: #1ecfff;
    box-shadow: 0 0 8px rgba(30, 207, 255, 0.2);
    border-radius: 2px;
    height: 32px;
    padding: 0 16px;

    &:hover {
      background-color: rgba(30, 207, 255, 0.3);
      box-shadow: 0 0 12px rgba(30, 207, 255, 0.4);
    }

    &.secondary {
      background-color: rgba(30, 207, 255, 0.05);
      border: 1px solid rgba(30, 207, 255, 0.5);
      color: #1ecfff;

      &:hover {
        background-color: rgba(30, 207, 255, 0.15);
      }
    }
  }

  .cyber-link {
    color: #1ecfff;
    cursor: pointer;
    margin: 0 4px;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      text-shadow: 0 0 8px rgba(30, 207, 255, 0.8);
    }

    &.danger {
      color: #ff5252;

      &:hover {
        text-shadow: 0 0 8px rgba(255, 82, 82, 0.8);
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 6px;

    .action-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      background-color: #666;
      transition: all 0.3s;

      &:hover {
        filter: brightness(1.2);
      }

      &.start-active {
        background-color: #009900;
      }

      &.end-active {
        background-color: #ff0000;
      }
    }

    .end-btn {
      background-color: #ff0000;
    }
  }
}
</style>
