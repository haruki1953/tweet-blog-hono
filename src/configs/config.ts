// get backend port from env
let httpPort = Number(process.env.E5SHARE_HONO_PORT)
// default port
if (Number.isNaN(httpPort)) {
  httpPort = 3000
}
export { httpPort }
