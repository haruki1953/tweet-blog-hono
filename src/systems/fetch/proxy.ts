import { HttpsProxyAgent } from 'https-proxy-agent'
import { useAdminSystem } from './dependencies'
import fetch from 'node-fetch'

const adminSystem = useAdminSystem()

let httpsProxyAgent: HttpsProxyAgent<string> | undefined
let proxyAddressHttpInUse: string | null = null

// 对 fetch 进行封装，使其使用代理
export const fetchProxy = (async (url: any, options: any) => {
  // 复用代理对象，视情况重新创建
  const { proxyAddressHttp } = adminSystem.getProxyInfo()
  const agent = (() => {
    if (proxyAddressHttp === '') {
      return undefined
    }
    if (httpsProxyAgent == null || proxyAddressHttpInUse !== proxyAddressHttp) {
      httpsProxyAgent = new HttpsProxyAgent(proxyAddressHttp)
      proxyAddressHttpInUse = proxyAddressHttp
    }
    return httpsProxyAgent
  })()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return await fetch(url, {
    ...options,
    agent
  })
}) as typeof fetch
