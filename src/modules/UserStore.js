import userService from '../services/UserService.js'

var localLoggedinUser = { Username: 'JWGtest', Password: 'JWGtest', Last_Batch:''};

export default {
    state: {
        selectedUser: null,
        loggedinUser: localLoggedinUser,
        users: []
    },
    getters: {
        users(state) {
            return state.users;
        },
        loggedinUser(state) {
            return state.loggedinUser
        },
        selectedUser(state) {
            return state.selectedUser
        },
    },
    mutations: {
        setUser(state, { userCred }) {
            console.log(userCred)
            state.loggedinUser = userCred;
        },
        setSelectedUser(state, { user }) {
            state.selectedUser = user;
        },
        setUsers(state, { users }) {
            state.users = users;
        },
        removeUser(state, { userId }) {
            state.users = state.users.filter(user => user._id !== userId)
        },
        setNoUser(state) {
            state.loggedinUser = null;
        }
    },
    actions: {
        async login(context, { userCred }) {
            console.log('userCred')
            console.log(userCred)
            // const user = await userService.login(userCred);
            context.commit({ type: 'setUser', userCred })
            return userCred;
        },
        async signup(context, { userCred }) {
            const user = await userService.signup(userCred)
            context.commit({ type: 'setUser', userCred })
            return user;

        },
        async logout(context) {
            context.commit({ type: 'setNoUser' })
        },
        async loadUsers(context) {
            const users = await userService.query();
            context.commit({ type: 'setUsers', users })
            return users;
        },
        async loadUser(context, { userId }) {
            const user = await userService.getById(userId);
            // context.commit({ type: 'setUser', user }) // trying to resolve the orders bug
            context.commit({ type: 'setSelectedUser', user })
            return user;
        },
        async removeUser(context, { userId }) {
            await userService.remove(userId);
            context.commit({ type: 'removeUser', userId })
        },
        async updateUser(context, { user }) {
            user = await userService.update(user);
            context.commit({ type: 'setUser', user })
            return user;
        }
    }
}