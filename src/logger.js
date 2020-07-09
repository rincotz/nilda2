import { Logging } from '@google-cloud/logging'

export default (eventName, data = { event: eventName }, METADATA = {}) => {
  const logging = new Logging()
  const log = logging.log(eventName)
  const entry = log.entry(METADATA, data)
  log.write(entry).then(() => console.log('success')).catch(error => console.log(error.message))
}