import axios from 'axios'

const api = axios.create({
  baseURL: 'https://skeleton-project.onrender.com'
})

export default api