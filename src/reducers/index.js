import * as indexActions  from '../actions/index'
import {SET_VISIBILITY_FILTER} from "../actions/index";
const {SHOW_ALL} = indexActions.VisibilityFilters.SHOW_ALL
const initialState = {
    visibilityFilter: indexActions.VisibilityFilters.SHOW_ALL,
    todos: []
};

function todoApp(state = initialState, action) {
    switch (action.type) {
        case indexActions.SET_VISIBILITY_FILTER:
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            })
        case indexActions.ADD_TODO:
            return Object.assign({},state,{
                todos: todos(state.todos, action)
            })
        case indexActions.TOGGLE_TODO:
            return Object.assign({},state,{
                todos: todos(state.todos,action)
            })
        default:
            return state
    }
}
function todos(state = initialState, action) {
    switch (action.type) {
        case indexActions.ADD_TODO:
            return [
                ...state,
                {
                    text:action.text,
                    completed:false
                }
            ]
        case indexActions.TOGGLE_TODO:
            return state.map((todo,index)=>{
                if(index == action.index){
                    return Object.assign({},todo,{
                        completed:!todo.completed
                    })
                }
                return todo
            })
        default:
            return state
    }
}
function visibilityFilter(state = SHOW_ALL,action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            })
        default:
            state
    }
}
