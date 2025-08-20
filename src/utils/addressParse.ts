import { areaData } from "~/config/index"

export const addressParse = (provinceName: string, cityName: string, countryName: string) => {
  return new Promise<{ provinceCode: string; cityCode: string; districtCode: string }>(
    (resolve, reject) => {
      try {
        const province = areaData.find((v) => v.label === provinceName)
        if (!province) {
          reject(" province not found")
          return
        }
        const { value: provinceCode } = province
        const city = province.children.find((v) => v.label === cityName)
        if (!city) {
          reject(" city not found")
          return
        }
        const { value: cityCode } = city
        const country = city.children.find((v) => v.label === countryName)
        if (!country) {
          reject(" country not found")
          return
        }
        const { value: districtCode } = country
        resolve({
          provinceCode,
          cityCode,
          districtCode,
        })
      } catch (_error) {
        reject(" ")
      }
    }
  )
}
