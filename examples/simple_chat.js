import io from '../lib/io.js'

let Server = io()

const logger = Server.logger
logger.flags.debug = true
logger.flags.info = true

var main = Server.of('main')
main.on('open', (escort) => {})

main.on('undefined data', (escort) => {
  console.log(escort)
})

main.on('undefined event', (escort) => {
  console.log(escort)
})

Server.listen(3000, (listenSocket) => {
  if (listenSocket) console.log('Listening on port 3000')
})
