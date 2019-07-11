/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/6
 * Time: 15:21
 * 物流送货安装 route
 */
const t = title => `${title} - 物流送货安装 - 营销服务平台`

export default [
  {
    name: 'delivery-installation-manage',
    path: '/delivery-installation/delivery-installation-manage',
    meta: {
      title: t('送货安装管理'),
      name: '送货安装管理',
      // auth: true,
      redirect: 'noredirect',
      menu: '/delivery-installation/delivery-installation-manage',
      href: '/delivery-installation/delivery-installation-manage',
      icon: 'icon-songhuoanzhuang'
    },
    component: () => import(/* webpackChunkName: 'delivery-installation-manage' */ '@/views/delivery-installation/DeliveryInstallationManage'),
    children: [
      {
        name: 'full-order-info',
        path: '/delivery-installation/full-order-info',
        meta: {
          title: t('订单信息全量表'),
          name: '订单信息全量表',
          // auth: true,
          menu: '/delivery-installation/full-order-info',
          href: '/delivery-installation/full-order-info'
        },
        component: () => import(/* webpackChunkName: 'full-order-info' */ '@/views/delivery-installation/FullInfoTable'),
        children: [
          {
            name: 'order-info-details',
            path: '/delivery-installation/order-dispatch-list/order-info-details',
            meta: {
              title: t('订单详情'),
              name: '订单详情',
              // auth: true,
              menu: '/delivery-installation/order-dispatch-list/order-details',
              href: '/delivery-installation/order-dispatch-list/order-details',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'order-details' */ '@/views/delivery-installation/OrderDispatchList/components/OrderDetails')
          },
          {
            name: 'residual-detail',
            path: '/delivery-installation/order-dispatch-list/order-details/residual-detail',
            meta: {
              title: t('遗留申报详情'),
              name: '遗留申报详情',
              // auth: true,
              menu: '/delivery-installation/order-dispatch-list/order-details/residual-detail',
              href: '/delivery-installation/order-dispatch-list/order-details/residual-detail',
              icon: 'icon-kuwei',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'delivery-installation-list' */ '@/views/delivery-installation/OrderDispatchList/components/ResidualDetail')
          }
        ]
      },
      {
        name: 'receive-list',
        path: '/delivery-installation/receive-list',
        meta: {
          title: t('收货列表'),
          name: '收货列表',
          // auth: true,
          menu: '/delivery-installation/receive-list',
          href: '/delivery-installation/receive-list'
        },
        component: () => import(/* webpackChunkName: 'receive-list' */ '@/views/delivery-installation/ReceiveList'),
        children: [
          {
            name: 'view-by-order',
            path: '/delivery-installation/receive-list/view-by-order',
            meta: {
              title: t('按订单查看'),
              name: '按订单查看',
              // auth: true,
              menu: '/delivery-installation/receive-list/view-by-order',
              href: '/delivery-installation/receive-list/view-by-order',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'view-by-order' */ '@/views/delivery-installation/ReceiveList/components/ViewByOrder')
          },
          {
            name: 'receipt-by-order',
            path: '/delivery-installation/receive-list/receipt-by-order',
            meta: {
              title: t('按订单签收'),
              name: '按订单签收',
              // auth: true,
              menu: '/delivery-installation/receive-list/receipt-by-order',
              href: '/delivery-installation/receive-list/receipt-by-order',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'receipt-by-order' */ '@/views/delivery-installation/ReceiveList/components/ReceiptByOrder')
          },
          {
            name: 'product-delivery-list',
            path: '/delivery-installation/receive-list/product-delivery-list',
            meta: {
              title: t('成品收货列表'),
              name: '成品收货列表',
              // auth: true,
              menu: '/delivery-installation/receive-list/product-delivery-list',
              href: '/delivery-installation/receive-list/product-delivery-list',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'receive-list' */ '@/views/delivery-installation/ReceiveList/pages/ProductDeliveryList')
          }
        ]
      },
      {
        name: 'order-dispatch-list',
        path: '/delivery-installation/order-dispatch-list',
        meta: {
          title: t('订单调度列表'),
          name: '订单调度列表',
          // auth: true,
          menu: '/delivery-installation/order-dispatch-list',
          href: '/delivery-installation/order-dispatch-list'
        },
        component: () => import(/* webpackChunkName: 'order-dispatch-list' */ '@/views/delivery-installation/OrderDispatchList'),
        children: [
          {
            name: 'order-dispatch-details',
            path: '/delivery-installation/order-dispatch-list/order-dispatch-details',
            meta: {
              title: t('订单详情'),
              name: '订单详情',
              // auth: true,
              menu: '/delivery-installation/order-dispatch-list/order-details',
              href: '/delivery-installation/order-dispatch-list/order-details',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'order-details' */ '@/views/delivery-installation/OrderDispatchList/components/OrderDetails')
          }
        ]
      },
      {
        name: 'delivery-installation-list',
        path: '/delivery-installation/delivery-installation-list',
        meta: {
          title: t('送货安装列表'),
          name: '送货安装列表',
          // auth: true,
          menu: '/delivery-installation/delivery-installation-list',
          href: '/delivery-installation/delivery-installation-list'
        },
        component: () => import(/* webpackChunkName: 'delivery-installation-list' */ '@/views/delivery-installation/DeliveryInstallationList'),
        children: [
          {
            name: 'delivery-installation-details',
            path: '/delivery-installation/order-dispatch-list/delivery-installation-details',
            meta: {
              title: t('订单详情'),
              name: '订单详情',
              // auth: true,
              menu: '/delivery-installation/order-dispatch-list/order-details',
              href: '/delivery-installation/order-dispatch-list/order-details',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'order-details' */ '@/views/delivery-installation/OrderDispatchList/components/OrderDetails')
          },
          {
            name: 'add-to-order',
            path: '/delivery-installation/delivery-installation-list/add-to-order',
            meta: {
              title: t('新增送货安装单'),
              name: '新增送货安装单',
              // auth: true,
              menu: '/delivery-installation/delivery-installation-list/add-to-order',
              href: '/delivery-installation/delivery-installation-list/add-to-order',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'delivery-installation-list' */ '@/views/delivery-installation/DeliveryInstallationList/AddToOrder')
          },
          {
            name: 'print-page',
            path: '/delivery-installation/print-page',
            meta: {
              title: t('打印预览'),
              name: '打印预览',
              // auth: true,
              menu: '/delivery-installation/print-page',
              href: '/delivery-installation/print-page',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'print-page' */ '@/views/delivery-installation/DeliveryInstallationList/DeliveryInstallationPrint')
          },
          {
            name: 'add-to-residual',
            path: '/delivery-installation/delivery-installation-list/add-to-residual',
            meta: {
              title: t('新增遗留申报'),
              name: '新增遗留申报',
              // auth: true,
              menu: '/delivery-installation/delivery-installation-list/add-to-residual',
              href: '/delivery-installation/delivery-installation-list/add-to-residual',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'delivery-installation-list' */ '@/views/delivery-installation/DeliveryInstallationList/pages/AddToResidual')
          }
        ]
      },
      {
        name: 'return-warehouse-list',
        path: '/delivery-installation/return-warehouse-list',
        meta: {
          title: t('返库列表'),
          name: '返库列表',
          // auth: true,
          menu: '/delivery-installation/return-warehouse-list',
          href: '/delivery-installation/return-warehouse-list'
        },
        component: () => import(/* webpackChunkName: 'return-warehouse-list' */ '@/views/delivery-installation/ReturnWarehouseList')
      },
      {
        name: 'acceptance-list',
        path: '/delivery-installation/acceptance-list',
        meta: {
          title: t('验收列表'),
          name: '验收列表',
          // auth: true,
          menu: '/delivery-installation/acceptance-list',
          href: '/delivery-installation/acceptance-list'
        },
        component: () => import(/* webpackChunkName: 'acceptance-list' */ '@/views/delivery-installation/Acceptance'),
        children: [
          {
            name: 'acceptance-details',
            path: '/delivery-installation/order-dispatch-list/acceptance-details',
            meta: {
              title: t('订单详情'),
              name: '订单详情',
              // auth: true,
              menu: '/delivery-installation/order-dispatch-list/order-details',
              href: '/delivery-installation/order-dispatch-list/order-details',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'order-details' */ '@/views/delivery-installation/OrderDispatchList/components/OrderDetails')
          }
        ]
      },
      {
        name: 'return-list',
        path: '/delivery-installation/return-list',
        meta: {
          title: t('回访列表'),
          name: '回访列表',
          // auth: true,
          menu: '/delivery-installation/return-list',
          href: '/delivery-installation/return-list'
        },
        component: () => import(/* webpackChunkName: 'return-list' */ '@/views/delivery-installation/ReturnList'),
        children: [
          {
            name: 'return-details',
            path: '/delivery-installation/order-dispatch-list/acceptance-details',
            meta: {
              title: t('订单详情'),
              name: '订单详情',
              // auth: true,
              menu: '/delivery-installation/order-dispatch-list/order-details',
              href: '/delivery-installation/order-dispatch-list/order-details',
              hidden: true
            },
            component: () => import(/* webpackChunkName: 'order-details' */ '@/views/delivery-installation/OrderDispatchList/components/OrderDetails')
          }
        ]
      }
    ]
  },
  {
    name: 'warehouse-space',
    path: '/delivery-installation/warehouse-space',
    meta: {
      title: t('库位管理'),
      name: '库位管理',
      // auth: true,
      menu: '/delivery-installation/warehouse-space',
      href: '/delivery-installation/warehouse-space',
      icon: 'icon-kuweishezhi'
    },
    component: () => import(/* webpackChunkName: 'warehouse-space' */ '@/views/delivery-installation/Entrepot')
  },
  {
    name: 'standard-goods',
    path: '/delivery-installation/standard-goods',
    meta: {
      title: t('标准品管理'),
      name: '标准品管理',
      // auth: true,
      menu: '/delivery-installation/standard-goods',
      href: '/delivery-installation/standard-goods',
      icon: 'icon-biaozhunpin'
    },
    component: () => import(/* webpackChunkName: 'standard-goods' */ '@/views/delivery-installation/Standard')
  },
  {
    name: 'related-market',
    path: '/delivery-installation/related-market',
    meta: {
      title: t('关联商场'),
      name: '关联商场',
      // auth: true,
      menu: '/delivery-installation/related-market',
      href: '/delivery-installation/related-market',
      icon: 'icon-shangchang'
    },
    component: () => import(/* webpackChunkName: 'related-market' */ '@/views/delivery-installation/RelevanceMarket')
  }
]
