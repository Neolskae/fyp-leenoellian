import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    adminUsername: localStorage.getItem("adminUsername") || null,
    studentId: localStorage.getItem("studentId") || null,
    studentIdForEdit: localStorage.getItem("studentIdForEdit") || null,
    activityIdForView: localStorage.getItem('activityIdForView') || null,
    studentIdForView : localStorage.getItem('studentIdForView') || null
}

let appSlice = createSlice({
    name : 'app',
    initialState,
    reducers : {
        addAdminUsername : function (state, action){
            state.adminUsername = action.payload
            localStorage.setItem("adminUsername", state.adminUsername)
        },
        removeAdminUsername : function(state,action){
            state.adminUsername = null;
            localStorage.setItem("adminUsername", state.adminUsername)
        },
        addStudentIdForEdit : function(state,action){
            state.studentIdForEdit = action.payload;
            localStorage.setItem("studentIdForEdit", state.studentIdForEdit)
        },
        addStudentId: function (state, action) {
            state.studentId = action.payload;
            localStorage.setItem("studentId", state.studentId)
        },
        removeStudentId: function (state, action) {
            state.studentId = null;
            localStorage.setItem("studentId", state.studentId)
        },
        addActivityIdForView : function(state,action){
            state.activityIdForView = action.payload;
            localStorage.setItem("activityIdForView", state.activityIdForView)
        },
        addStudentIdForView : function(state, action){
            state.studentIdForView = action.payload;
            localStorage.setItem("studentIdForView", state.studentIdForView)
        }
    }
})

export const { 
    addAdminUsername, 
    removeAdminUsername, 
    addStudentIdForEdit,
    addStudentId,
    removeStudentId,
    addActivityIdForView,
    addStudentIdForView } = appSlice.actions;
export default appSlice.reducer;