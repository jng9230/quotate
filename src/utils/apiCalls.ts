import { config } from "../config"
import * as API from "./APIReturnTypes"

const API_BASE = config.API_BASE; 

const getBooksForUser = async (user: API.userReturnType) => {
    const res = fetch(API_BASE + "/book/book/all_for_user/" + user._id)
        .then(res => res.json())
        .then(data => {
            const data1 = data as API.booksReturnType[];
            return data1
        })
        .catch(err => console.error("Error: ", err))
    
    return res
}


export { getBooksForUser }