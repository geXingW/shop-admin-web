<template>
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
        <el-step title="支付订单" :description="formatTime(order.paymentTime)"></el-step>
        <el-step title="平台发货" :description="formatTime(order.deliveryTime)"></el-step>
        <el-step title="确认收货" :description="formatTime(order.receiveTime)"></el-step>
        <el-step title="完成评价" :description="formatTime(order.commentTime)"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{ order.status | formatStatus }}</span>

        <!--
        <div class="operate-button-container" v-show="order.status===0">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini">修改商品信息</el-button>
          <el-button size="mini" @click="showUpdateMoneyDialog">修改费用信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showCloseOrderDialog">关闭订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===1">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini">取消订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===2||order.status===3">
          <el-button size="mini" @click="showLogisticsDialog">订单跟踪</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===4">
          <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        -->

      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">发货单流水号</el-col>
          <el-col :span="4" class="table-cell-title">用户账号</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">订单来源</el-col>
          <el-col :span="4" class="table-cell-title">订单类型</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ order.id }}</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">{{ order.member.name | formatNull }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.payType | formatPayType }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.sourceType | formatSourceType }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.orderType | formatOrderType }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">配送方式</el-col>
          <el-col :span="4" class="table-cell-title">物流单号</el-col>
          <el-col :span="4" class="table-cell-title">自动确认收货时间</el-col>
          <el-col :span="4" class="table-cell-title">订单可得优币</el-col>
          <el-col :span="4" class="table-cell-title">订单可得成长值</el-col>
          <el-col :span="4" class="table-cell-title">活动信息</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ order.deliveryCompany | formatNull }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.deliverySn | formatNull }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.autoConfirmDay }}天</el-col>
          <el-col :span="4" class="table-cell">{{ order.integration }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.growth }}</el-col>
          <el-col :span="4" class="table-cell">
            <el-popover
              placement="top-start"
              title="活动信息"
              width="200"
              trigger="hover"
              :content="order.promotionInfo"
            >
              <span slot="reference">{{ order.promotionInfo | formatLongText }}</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">邮政编码</el-col>
          <el-col :span="6" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ order.recvAddress.name | formatNull }}</el-col>
          <el-col :span="6" class="table-cell">{{ order.recvAddress.phone | formatNull }}</el-col>
          <el-col :span="6" class="table-cell">{{ order.recvAddress.postCode | formatNull }}</el-col>
          <el-col :span="6" class="table-cell">{{ order.recvAddress.detailAddress }}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order.items"
        style="width: 100%;margin-top: 20px" border
      >
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.pic" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
            <p>品牌：{{ scope.row.productBrand | formatNull }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{ scope.row.price }}</p>
            <p>货号：{{ scope.row.productSn | formatNull }}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.skuInfo | formatProductAttr }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.quantity }}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{ scope.row.salePrice * scope.row.quantity }}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{ order.totalAmount }}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{ order.totalAmount }}</el-col>
          <el-col :span="6" class="table-cell">￥{{ order.freightAmount }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.couponAmount }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.integrationAmount }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{ order.promotionAmount }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.discountAmount }}</el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.totalAmount }}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.payAmount }}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
      <el-table style="margin-top: 20px;width: 100%"
                ref="orderHistoryTable"
                :data="order.historyList" border
      >
        <el-table-column label="操作者" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.operateMan }}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="160" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderStatus | formatStatus }}
          </template>
        </el-table-column>
        <el-table-column label="付款状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderStatus | formatPayStatus }}
          </template>
        </el-table-column>
        <el-table-column label="发货状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderStatus | formatDeliverStatus }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{ scope.row.note }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Step } from 'element-ui'
import { list, info, del, edit } from '@/api/order/order'
import { formatDate } from '@/utils/helper'

export default {
  name: 'detail',
  components: { ElStep: Step },
  data() {
    return {
      order: {
        member: {},
        recvAddress: {},
        items: []
      }
    }
  },
  created() {
    info(this.id).then(({ data }) => {
      this.order = data
    })
  },
  filters: {
    formatNull(value) {
      if (value === undefined || value === null || value === '') {
        return '暂无'
      } else {
        return value
      }
    },
    formatLongText(value) {
      if (value === undefined || value === null || value === '') {
        return '暂无'
      } else if (value.length > 8) {
        return value.substr(0, 8) + '...'
      } else {
        return value
      }
    },
    formatPayType(value) {
      if (value === 1) {
        return '支付宝'
      } else if (value === 2) {
        return '微信'
      } else {
        return '未支付'
      }
    },
    formatSourceType(value) {
      if (value === 1) {
        return 'APP订单'
      } else {
        return 'PC订单'
      }
    },
    formatOrderType(value) {
      if (value === 1) {
        return '秒杀订单'
      } else {
        return '正常订单'
      }
    },
    formatAddress(order) {
      let str = order.receiverProvince
      if (order.receiverCity != null) {
        str += '  ' + order.receiverCity
      }
      str += '  ' + order.receiverRegion
      str += '  ' + order.receiverDetailAddress
      return str
    },
    formatStatus(value) {
      if (value === 1) {
        return '待发货'
      } else if (value === 2) {
        return '已发货'
      } else if (value === 3) {
        return '已完成'
      } else if (value === 4) {
        return '已关闭'
      } else if (value === 5) {
        return '无效订单'
      } else {
        return '待付款'
      }
    },
    formatPayStatus(value) {
      if (value === 0) {
        return '未支付'
      } else if (value === 4) {
        return '已退款'
      } else {
        return '已支付'
      }
    },
    formatDeliverStatus(value) {
      if (value === 0 || value === 1) {
        return '未发货'
      } else {
        return '已发货'
      }
    },
    formatProductAttr(value) {
      if (value == null) {
        return ''
      } else {
        let attr = JSON.parse(value)
        let result = ''
        for (let i = 0; i < attr.length; i++) {
          result += attr[i].key
          result += ':'
          result += attr[i].value
          result += ';'
        }
        return result
      }
    }
  },
  methods: {
    formatTime(time) {
      if (time == null || time === '') {
        return ''
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatStepStatus(value) {
      if (value === 1) {
        //待发货
        return 2
      } else if (value === 2) {
        //已发货
        return 3
      } else if (value === 3) {
        //已完成
        return 4
      } else {
        //待付款、已关闭、无限订单
        return 1
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  }
}
</script>

<style scoped lang="scss">
.detail-container {
  width: 80%;
  padding: 20px;
  margin: 20px auto;

  .operate-container {
    background: #f2f6fc;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;

    .operate-button-container {
      float: right;
      margin-right: 20px
    }
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;

    .table-cell {
      height: 60px;
      line-height: 40px;
      border-right: 1px solid #DCDFE6;
      border-bottom: 1px solid #DCDFE6;
      padding: 10px;
      font-size: 14px;
      color: #606266;
      text-align: center;
      overflow: hidden;
    }

    .table-cell-title {
      border-right: 1px solid #DCDFE6;
      border-bottom: 1px solid #DCDFE6;
      padding: 10px;
      background: #F2F6FC;
      text-align: center;
      font-size: 14px;
      color: #303133;
    }
  }
}
</style>
