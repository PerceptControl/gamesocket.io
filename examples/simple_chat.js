import io from '../lib/io.js'
import { v4 as uuid } from 'uuid'

let Server = io()

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
