import { debounce } from "./debounce"

let TIMES = 0
function batchLog(sss: string) {
  TIMES++
  console.log(TIMES, "次: batchLog", Date.now(), sss)
}

const bou = debounce(batchLog, 250, { maxWait: 1000 })

for (let i = 0; i < 1000; i++) {
  setTimeout(() => {
    bou(i.toString())
  }, 1000)
}

for (let i = 1000; i < 2000; i++) {
  setTimeout(() => {
    bou(i.toString())
  }, 1000)
}
