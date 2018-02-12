import React, {Component} from 'react'
//import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import io from 'socket.io-client';
import {withRouter} from 'react-router'
import axios from 'axios'
import '../../styles/chat.css'

export class Chat extends Component {
    constructor(props) {
        console.log('init')
        super(props);
        this.state = {
            chat_id: props.chat_id,
            messages: [],
            messages_number: props.start_with_messages || 20
        };
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');
        this.token = token;
        this.user_id = user_id;
        const config = {
            headers: {'Authorization': 'JWT ' + token}
        };
        axios.get(`http://localhost:8000/api/private-messages/` +
            `${this.state.chat_id}/?message_number=${this.state.messages_number}`, config)
            .then(response => {
                console.log(response.data);
                this.setState({'messages': response.data});
            });

        const socket = new WebSocket('ws://0.0.0.0:8000/private_chat/?token=' +
            token + '&private_chat_id=' + this.state.chat_id);
        this.chat_socket = socket;
        socket.onopen = () => {
            console.log("Connected to chat chat_socket");
        };
        socket.onmessage = (event) => {
            console.log('chat message')
            console.log(JSON.parse(event.data));
            this.setState({messages: [...this.state.messages, JSON.parse(event.data)]})

        };
        socket.onclose = () => {
            console.log('disconnected')
        };
        socket.onerror = (e) => {
            console.log(e)
        };
    }

    componentWillUnmount = () => {
        this.chat_socket.close()
    };

    addMessage(e) {
        if (e.charCode !== 13) return;
        this.chat_socket.send(JSON.stringify(this.textInput.value));
        this.textInput.value = ''
    }

    messageGenerate(messages) {
        let cur_user, tmp, messageToArr;
        return messages.map((message, i) => {
            cur_user = message.owner == this.user_id ? 'self' : 'other';
            messageToArr = message.text.match(/.{1,20}/g);
            tmp = messageToArr.map((value, j) => {
                return (
                    <p key={'p_' + j + i}>{value}</p>
                )
            });
            return (
                <li className={cur_user} key={'li_chat_' + i}>
                    <div className="avatar">{message.owner}</div>
                    <div className="msg">
                        {tmp}
                    </div>
                </li>
            )
        })
    }

    render() {
        return (
            <div className="current-chat">
                <div className="menu">
                    <div className="back"><i className="fa fa-chevron-left"></i> <img
                        src="https://i.imgur.com/DY6gND0.png" draggable="false"/></div>
                    <div className="name">{this.user_id}</div>
                    <div
                        className="last">{this.state.messages.length ? this.state.messages[this.state.messages.length - 1].created_at : "not this time"}
                    </div>
                </div>
                <div className="chat-display">
                    <ol className="chat">
                        {this.messageGenerate(this.state.messages)}
                    </ol>
                </div>
                <input className="textarea" ref={(txt) => this.textInput = txt} type="text"
                       onKeyPress={this.addMessage.bind(this)} placeholder="Type here!" required/>
                <div className="emojis"></div>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat))