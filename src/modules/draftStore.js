import { draftService } from '../services/draft.service.js'

export default {
    state: {
        draft: {},
        drafts: [],
        currdraft: null,
        filterBy: null
    },
    getters: {
        getDrafts(state) {
            return state.drafts;
        },
    },
    mutations: {
        setdrafts(state, { drafts }) {
            state.drafts = drafts;
        },
        setdraft(state, { draft }) {
            state.draft = draft;
        },
        setCurrdraft(state, { draft }) {
            state.currdraft = draft;
        },
        removedraft(state, { draftId }) {
            state.drafts = state.drafts.filter(currdraft => currdraft._id !== draftId)
        },
    },
    actions: {
        async loaddrafts(context, { filterBy = null }) {
            const drafts = await draftService.query(filterBy);
            console.log("drafts:")
            console.log(drafts)
            context.commit({ type: 'setdrafts', drafts })
            return drafts;
        },
        async loaddraft(context, { draftId }) {
            const draft = await draftService.getById(draftId)
            context.commit({ type: 'setdraft', draft })
            return draft;
        },
        async removedraft(context, { draftId }) {
            await draftService.removedraft(draftId);
            context.commit({ type: 'removedraft', draftId })
        },
        async updatedraft(context, { draft }) {
            let saveddraft = await draftService.savedraft(draft);
            context.commit({ type: 'setdraft', saveddraft })
            return saveddraft;
        }
    }
}