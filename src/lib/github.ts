import axios from 'axios'
import config from '../../config'
import Branch from '../ts/Branch'
import Commit from '../ts/Commit'
import Repository from '../ts/Repository'

export const getCommit = async (token: string, user: string, repo: string) => {
    let result: Commit[] = []
    let i = 0

    while (true) {
        try {
            const response = await axios.get(
                `${config.GITHUB_API_URL}/repos/${user}/${repo}/commits`,
                {
                    params: {
                        author: user,
                        per_page: 100,
                        page: i
                    },
                    headers: {
                        Authorization: `token ${token}`,
                        Accept: 'application/vnd.github.v3+json'
                    }
                }
            )
        
            if (response && response.status === 200 && response.data && Array.isArray(response.data) && response.data.length > 0) {
                result = [...result, ...response.data]
            } else if (response.status === 401) {
                return null
            } else {
                break
            }
        } catch (err) {
            console.log(err)
            break
        }
        i++
    }

    return result
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
    
        if (response && response.status === 200 && response.data) {
            return response.data
        } else if (response.status === 401) {
            return null
        } else {
            return null
        }
    } catch (err) {
        console.log(err)
    }
}

export const getRepository = async (token: string) => {
    let result: Repository[] = []
    let i = 0

    while (true) {
        try {
            const response = await axios.get(
                `${config.GITHUB_API_URL}/user/repos`,
                {
                    params: {
                        visibility: 'all',
                        affiliation: 'owner,collaborator',
                        sort: 'full_name',
                        per_page: 100,
                        page: i
                    },
                    headers: {
                        Authorization: `token ${token}`,
                        Accept: 'application/vnd.github.v3+json'
                    }
                }
            )
    
            if (response && response.status === 200 && response.data && Array.isArray(response.data) && response.data.length > 0) {
                result = [...result, ...response.data]
            } else if (response.status === 401) {
                return null
            } else {
                break
            }
        } catch (err) {
            console.log(err)
            break
        }
        i++
    }

    return result
}