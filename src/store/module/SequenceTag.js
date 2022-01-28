const state = {
    isSideBarCollapse: false,
    fileList: [],
    currentFile: "",
    currentTag: "other",
    currentStatistics: {}
}

const mutations = {
    changeCurrentTag(state, payload) {
        state.currentTag = payload;
    },
    changeCurrentFile(state, payload) {
        state.currentFile = payload;
    },
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
    },
    addStatistics(state, key) {
        if (state.currentStatistics[key]) {
            state.currentStatistics[key] += 1;
        } else {
            state.currentStatistics[key] = 1;
        }
    },
    subStatistics(state, key) {
        state.currentStatistics[key] -= 1;
        if (state.currentStatistics[key] === 0) {
            delete state.currentStatistics[key]
        }
    },
    changeStatistics(state, payload) {
        state.currentStatistics = payload;
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
  