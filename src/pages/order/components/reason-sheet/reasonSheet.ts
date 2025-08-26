function getInstance(context, selector = "#wr-reason-sheet") {
  if (!context) {
    const pages = getCurrentPages()
    const page = pages.at(-1)
    context = page
  }
  const instance = context?.selectComponent(selector)
  if (!instance) {
    return null
  }
  return instance
}

export default function (options) {
  const { context, selector, ..._options } = options
  return new Promise((resolve, reject) => {
    const instance = getInstance(context, selector)
    if (instance) {
      instance.setData({ ..._options })
      instance._onCancel = () => reject()
      instance._onConfirm = (indexes) => resolve(indexes)
    }
  })
}
