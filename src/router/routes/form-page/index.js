/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/6
 * Time: 15:21
 * 物流送货安装 route
 */
const t = title => `${title} - 营销服务平台`

export default [
  {
    name: 'basic-form',
    path: '/form/basic-form',
    meta: {
      title: t('基础表单页'),
      // auth: true,
      menu: '/form/basic-form',
      href: 'basic-form'
    },
    component: () => import(/* webpackChunkName: 'basic-form' */ '@/views/form/BasicForm')
  },
  {
    name: 'step-form',
    path: '/form/step-form',
    meta: {
      title: t('分步表单页（填写信息）'),
      // auth: true,
      menu: '/form/step-form',
      name: '户型查询',
      href: 'step-form'
    },
    redirect: { name: 'step-form-info' },
    component: () => import(/* webpackChunkName: 'step-form' */ '@/views/form/StepForm'),
    children: [
      {
        name: 'step-form-info',
        path: 'info',
        meta: {
          title: t('分步表单页（填写信息）'),
          menu: '/form/step-form',
          href: 'step-form'
        }
      },
      {
        name: 'step-form-confirm',
        path: 'confirm',
        meta: {
          title: t('分步表单页（确认信息）'),
          menu: '/form/step-form',
          limit: {
            from: 'step-form-info',
            back: 'step-form-info'
          },
          href: 'step-form'
        }
      },
      {
        name: 'step-form-result',
        path: 'result',
        meta: {
          title: t('分步表单页（完成）'),
          menu: '/form/step-form',
          limit: {
            from: 'step-form-confirm',
            back: 'step-form-info'
          },
          href: 'step-form'
        }
      }
    ]
  },
  {
    name: 'advanced-form',
    path: '/form/advanced-form',
    meta: {
      title: t('高级表单页'),
      // auth: true,
      menu: '/form/advanced-form',
      href: 'advanced-form'
    },
    component: () => import(/* webpackChunkName: 'basic-form' */ '@/views/form/AdvancedForm')
  }
]
