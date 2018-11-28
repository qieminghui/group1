/**
 * Created by Administrator on 2018/11/26.
 */
import React from 'react'
// import Redux from 'react-redux'
import PropTypes from 'prop-types'

const Todo = ({onClick, completed, text}) => {
    <li
        onClick={onClick}
        style={ {
            textDecoration: completed ? 'line-through' : 'none'
        }}
    >
        {text}
    </li>
}
Todo.propTypes = {
    onClick: PropTypes.func.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
}
export default Todo
