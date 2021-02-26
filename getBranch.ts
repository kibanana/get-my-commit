import axios from 'axios'
import config from './config'

const getBranches = async () => {
    try {
        const response = await axios.get(
            `${config.GITHUB_API_URL}/repos/${config.TEMP_USER}/${config.TEMP_REPO}/branches`
        )
    
        if (response && response.data) {
            return response.data
        }
    } catch (err) {
        console.log(err)
    }
}

getBranches()
    .then(result => console.log(result))
    .catch(err => console.log(err))
