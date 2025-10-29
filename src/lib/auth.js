import axios from "axios"
// copied from geroge
import { jwtDecode } from "jwt-decode"
export const saveTokens = (access, refresh) => {
  localStorage.setItem("access_token", access)
  localStorage.setItem("refresh_token", refresh)
}

export const getTokens = () => ({
  access: localStorage.getItem("access_token"),
  refresh: localStorage.getItem("refresh_token")
})
export const clearTokens = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
}
export const getUserFromToken = () => {
  const token = localStorage.getItem("access_token")
  return token ? jwtDecode(token) : null
}

export const authRequest = async (config) => {
  let { access, refresh } = getTokens()
  if (!access) throw new Error("No access token")

  const tokenExp = jwtDecode(access).exp * 1000
  const now = Date.now()

  if (now >= tokenExp) {
    if (!refresh) throw new Error("No refresh token")
    try {
      const refreshRes = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh })
      access = refreshRes.data.access
      saveTokens(access, refresh)
    } catch (err) {
      clearTokens()
      throw err
    }
  }

  config.headers = { ...config.headers, Authorization: `Bearer ${access}` }
  return axios(config)
}