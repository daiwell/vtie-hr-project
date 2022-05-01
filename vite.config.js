import { createVuePlugin } from 'vite-plugin-vue2'
import {resolve} from 'path'
export default {
  plugins: [createVuePlugin() ],
  resolve: {
    alias: [
      {
        find: '@', //指向的是src目录
        replacement:resolve(__dirname,'src')
      }
    ],
      // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
  },

}

