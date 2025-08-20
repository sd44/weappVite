type AddressInfo = {
  receiverName: string
  tel_number: string
  country: string
  province: string
  city: string
  county: string
  detail_address: string
}

type AddressPromise = {
  resolver: (address: AddressInfo) => void
  rejecter: (reason?: Error) => void
}

const addressPromise: AddressPromise[] = []

/** 地址编辑Promise */
export const getAddressPromise = (): Promise<AddressInfo> => {
  return new Promise<AddressInfo>((resolve, reject) => {
    addressPromise.push({ resolver: resolve, rejecter: reject })
  })
}

/** 用户保存了一个地址 */
export const resolveAddress = (address: AddressInfo): void => {
  const allAddress = [...addressPromise]
  addressPromise.length = 0

  for (const { resolver } of allAddress) {
    resolver(address)
  }
}

/** 取消编辑 */
export const rejectAddress = (): void => {
  const allAddress = [...addressPromise]
  addressPromise.length = 0

  for (const { rejecter } of allAddress) {
    rejecter(new Error("cancel"))
  }
}
