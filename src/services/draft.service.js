import axios from "axios";
import httpService from './HttpService.js'

async function query(filterBy = null) {
    return new Promise((resolve,reject)=>{

        // const headers = { "content-type": "application/json" };
        const url4log = `http://192.117.139.150/Magicxpi4.7/MgWebRequester.dll?appname=IFSCustimer_Draft_API&prgname=HTTP&arguments=-Aget_draft_http%23Trigger1&username=${filterBy.username}&password=${filterBy.password}&from_date=2021-03-13&batch_mode=0`
        // var queryParams = new URLSearchParams()
        // for (let key in filterBy) {
            //     if (filterBy[key]) queryParams.set(`${key}`, filterBy[key])
            // }
            // const drafts = httpService.get(`draft/?${queryParams}`);
            axios
            .get(url4log)
            .then(function (response) {
                let resObj = response.data;
                console.log(resObj);
                let drafts = resObj.drafts
                resolve(drafts)
            })
        })
}

async function getById(draftId) {
    return httpService.get(`draft/${draftId}`)
}

function savedraft(draft) {
    if (draft._id) return _updatedraft(draft)
    else return _adddraft(draft);
}

function _adddraft(draft) {
    return httpService.post(`draft/`, draft)

}

function _updatedraft(draft) {
    return httpService.put(`draft/${draft._id}`, draft)

}

function removedraft(draftId) {
    return httpService.delete(`draft/${draftId}`)
}

function getEmptydraft() {
    var emptydraft = {
        vendor: '',
        color: '#ff0000',
        speed: 20,
        createdAt: '',
        isAuto: true,
        ownershipType: '',
        seatsCount: 5,
        desc: '',
        features: []
    }
    return emptydraft;
}


export const draftService = {
    query,
    getById,
    savedraft,
    removedraft,
    getEmptydraft,
}