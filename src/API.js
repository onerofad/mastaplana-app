import axios from 'axios'

export default function getUsers(){
    return(
        axios.create({
            baseURL: "https://backend-app-pied.vercel.app/api/users",
            headers: {
                'Content-type': 'application/json',  
                Accept: 'application/json' 
            }
        })
    )
}

export function getUserMembers(){
    return(
        axios.create({
            baseURL: "https://backend-app-pied.vercel.app/api/members",
            headers: {
                'Content-type': 'application/json',  
                Accept: 'application/json' 
            }
        })
    )
}

export function getAlarms(){
    return(
        axios.create({
            baseURL: "https://backend-app-pied.vercel.app/api/alarms",
            headers: {
                'Content-type': 'application/json',  
                Accept: 'application/json' 
            }
        })
    )
}

export function getFileToFolder(){
    return(
        axios.create({
            baseURL: "https://backend-app-pied.vercel.app/api/upload_file_to_folders",
            headers: {
                'Content-type': 'application/json',  
                Accept: 'application/json' 
            }
        })
    )
}

export function getGroups(){
    return(
        axios.create({
            baseURL: "https://backend-app-pied.vercel.app/api/groups/",
            headers: {
                "Content-Type": "application/json",
                 Accept: "application/json"
            }
        })
    )
}

export function getGroupMembers(){
 return(
        axios.create({
            baseURL: "https://backend-app-pied.vercel.app/api/groupmembers/",
            headers: {
                "Content-Type": "application/json",
                 Accept: "application/json"
            }
        })
    )
}

export function getGroupUploads(){
    return(
        axios.create({
            baseURL: "https://backend-app-pied.vercel.app/api/groupuploads/",
            headers: {
                "Content-Type": "application/json",
                 Accept: "application/json"
            }
        })
    )
} 

export const  mastaplana_file  =  '..//..//src//mastaplana_logo.jpg'
