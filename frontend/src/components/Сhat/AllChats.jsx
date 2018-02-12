import React, {Component} from 'react'
import '../../styles/chat.css'
import axios from 'axios'
import {ChatTitle} from './ChatTitle'

export class AllChats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: this.props.chats
        };
        console.log(this.props.chats)

    }


    render() {

        const chats = this.state.chats.map((value, key) => {
            return <ChatTitle key={value.last_message ? value.last_message.created_at : key} chat={value}
                              ChooseChat={this.props.ChooseChat}/>
        });
        return <div className='all-chats'>
            <ul className="chat">
                <li>{localStorage.getItem('user_id')}</li>
                {chats}
            </ul>
        </div>
    }
}