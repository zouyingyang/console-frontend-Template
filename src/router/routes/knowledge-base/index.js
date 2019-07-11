/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/6
 * Time: 15:21
 * 知识库管理 route
 */
const t = title => `${title} - 知识库管理 - 营销服务平台`

export default [
  {
    path: '/knowledge-base',
    meta: {
      title: t('知识库管理'),
      name: '知识库管理',
      href: '/main/knowlBase',
      icon: 'icon-cluster'
    }
  },
  {
    name: 'column',
    path: '/knowledge-base/column',
    meta: {
      title: t('栏目管理'),
      name: '栏目管理',
      menu: '/knowledge-base/column',
      href: '/main/knowlBase/columnManage',
      icon: ''
    },
    redirect: { name: 'step-form-info' },
    component: () => import(/* webpackChunkName: 'column' */ '@/views/form/StepForm'),
    children: [
      {
        name: 'step-form-info',
        path: 'info',
        noAuth: true,
        meta: {
          title: t('分步表单页（填写信息）'),
          name: '分步表单页（填写信息）',
          menu: '/knowledge-base/column',
          href: ''
        }
      },
      {
        name: 'step-form-confirm',
        path: 'confirm',
        meta: {
          title: t('分步表单页（确认信息）'),
          name: '分步表单页（确认信息）',
          menu: '/knowledge-base/column',
          noAuth: true,
          limit: {
            from: 'step-form-info',
            back: 'step-form-info'
          },
          href: ''
        }
      },
      {
        name: 'step-form-result',
        path: 'result',
        meta: {
          title: t('分步表单页（完成）'),
          name: '分步表单页（完成）',
          menu: '/knowledge-base/column',
          noAuth: true,
          limit: {
            from: 'step-form-confirm',
            back: 'step-form-info'
          },
          href: ''
        }
      }
    ]
  },
  {
    name: 'content',
    path: '/knowledge-base/content',
    meta: {
      title: t('内容管理'),
      name: '内容管理',
      menu: '/knowledge-base/content',
      href: '/main/knowlBase/contentManage'
    },
    component: () => import(/* webpackChunkName: 'content' */ '@/views/form/AdvancedForm')
  }
]
