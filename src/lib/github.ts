import axios from 'axios'
import config from '../../config'

export const getBranch = async (token: string, user: string, repo: string) => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/repos/${user}/${repo}/branches`,
            {
                headers: {
                    Authorization: `token ${token}`
                }
            }
        )
    
        if (response && response.data) {
            return response.data
        }
    } catch (err) {
        console.log(err)
    }
}

export const getCommit = async (token: string, user: string, repo: string) => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/repos/${user}/${repo}/commits`,
            {
                params: {
                    sort: 'created-+1',
                    per_page: 100,
                    page: 0
                },
                headers: {
                    Authorization: `token ${token}`
                }
            }
        )
    
        if (response && response.data) {
            return response.data
        }
    } catch (err) {
        console.log(err)
    }
}

export const getProfile = async (token: string) => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/user`,
            {
                headers: {
                    Authorization: `token ${token}`
                }
            }
        )
    
        if (response && response.data) {
            return response.data
        }
    } catch (err) {
        console.log(err)
    }
}

export const getRepository = async (token: string) => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/user/repos`,
            {
                headers: {
                    Authorization: `token ${token}`
                }
            }
        )
    
        if (response && response.data) {
            return response.data
        }
    } catch (err) {
        console.log(err)
    }
}