import { defineConfig } from 'umi';
export default defineConfig({
  // locale: { antd: true },
  targets: {
    ie: 11,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  title: 'FILPool-管理后台',
  // mock: false,
  ignoreMomentLocale: true,
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  proxy: {
    '/public': {
      target: 'http://localhost:8080/filpool',
      changeOrigin: true,
    },
    '/tmp': {
      target: 'http://localhost:8080/filpool',
      changeOrigin: true,
    },
  }
});