import axios from 'axios'
import config from '../../config'
import Branch from '../ts/Branch'
import Commit from '../ts/Commit'
import Repository from '../ts/Repository'

export const getBranch = async (token: string, repo: string) => {
    let result: Branch[] = []
    let i = 1

    while (true) {
        try {
            const response = await axios.get(
                `${config.GITHUB_API_URL}/repos/${repo}/branches`,
                {
                    params: {
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
            } else {
                break
            }
        } catch (err: any) {
            console.log(err)
            return err.response.status
        }
        i++
    }

    return result
}

export const getCommit = async (token: string, repo: string, sha: string) => {
    let result: Commit[] = []
    let i = 1

    while (true) {
        try {
            const response = await axios.get(
                `${config.GITHUB_API_URL}/repos/${repo}/commits`,
                {
                    params: {
                        sha,
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
            } else {
                break
            }
        } catch (err: any) {
            console.log(err)
            return err.response.status
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
        }
        return null
    } catch (err: any) {
        console.log(err)
        return err.response.status
    }
}

export const getRepository = async (token: string) => {
    let result: Repository[] = []
    let i = 1

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
            } else {
                break
            }
        } catch (err: any) {
            console.log(err)
            return err.response.status
        }
        i++
    }

    return result
}