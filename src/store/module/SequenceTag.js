const state = {
    isSideBarCollapse: false,
    fileList: []
}

const mutations = {
    collapseSideBar(state, payload) {
        state.isSideBarCollapse = payload;
    },
    clearFileList(state) {
        state.fileList = [];
    },
    addFilename(state, payload) {
        for (let i = 0; i < state.fileList.length; i++) {
            if (state.fileList[i].filename === payload.filename) {
                return;
            }
        }
        state.fileList.push(payload)
    },
    removeFilename(state, payload) {
        for (let i = 0; i < state.fileList.length; i++) {
            if (state.fileList[i].filename === payload.filename) {
                state.fileList.splice(i, 1);
                return;
            }
        }
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
  