import { defineConfig } from 'umi';
export default defineConfig({
  // locale: { antd: true },
  targets: {
    ie: 11,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  title: '分布式云储存',
  // mock: false,
  ignoreMomentLocale: true,
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  proxy: {
    '/api': {
      // target: 'http://localhost:8080/filpool',
      // target: 'http://192.168.110.171',
      target: 'http://192.168.110.171',
      // 'http://api.ipfscloud.c28e9d7b637474c3a98b2ed559c29434c.cn-hongkong.alicontainer.com',
      changeOrigin: true,
    },
    '/tmp': {
      // target: 'http://localhost:8080/filpool',
      target:
        'http://api.ipfscloud.c28e9d7b637474c3a98b2ed559c29434c.cn-hongkong.alicontainer.com',
      changeOrigin: true,
    },
  },
});
