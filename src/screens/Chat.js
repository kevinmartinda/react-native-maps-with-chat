import React, { Component } from 'react'
import { AsyncStorage, TouchableOpacity } from 'react-native'
import { View, Header, Left, Body, Text, Icon, Right } from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';

import firebase from '../config'
import "firebase/firebase-firestore"
import "firebase/database"

import { connect } from 'react-redux'

const rtdb = firebase.database()
const fsdb = firebase.firestore()
class Chat extends Component {
    constructor(props) {
        super(props)
        this._bootstrapAsync()
        this.state = {
            messages: [],
            receiver: this.props.navigation.state.params,
            user: this.props.user.data
        }

        console.warn('receiver', this.state.receiver)
    }

    _bootstrapAsync = async () => {
        const user = await AsyncStorage.getItem('userid')
        this.setState({user})
    }

    componentWillMount() {
        this.setState({
            messages: []
        })
        rtdb.ref('messages').child(this.state.user).child(this.state.receiver.id)
        .on('child_added', (value) => {
            this.setState(prevState => ({
                messages: GiftedChat.append(prevState.messages, {
                    _id: value.val()._id,
                    text: value.val().text,
                    createdAt: value.val().createdAt,
                    user: {
                        _id: value.val().user._id
                    }
                })
            }))
            console.warn(value.val())
        })
    }

    getUser = async () => {
        const user = await fsdb.collection('users').doc(userid)
        user.get()
        .then(doc => {
            if (!doc.exists) {
            console.warn('No such document!');
            } else {
                this.setState({markers: [...this.state.markers, {coordinate: doc.data().coordinate}]})
            }
        })
        .catch(err => {
            console.warn('Error getting document', err);
        });
    }

    onSend = (messages = []) => {
        const msgId = rtdb.ref('messages').child(this.state.user).child(this.state.receiver.id).push().key
        
        const updates = {}
        const message = {
            _id: messages[0]._id,
            text: messages[0].text,
            createdAt: new Date(),
            user: {
                _id: this.state.user
            }
        }
        updates['messages/'+this.state.user+'/'+this.state.receiver.id+'/'+msgId] = message
        updates['messages/'+this.state.receiver.id+'/'+this.state.user+'/'+msgId] = message

        rtdb.ref().update(updates)
    }

    render() {
        return (
            <View style={{backgroundColor: '#2d3036', height: '100%'}}>
            <Header style={{backgroundColor:'white'}}>
                <Left style={{flex:1}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="arrow-back" style={{color: 'blue'}} />
                    </TouchableOpacity>
                </Left>
                <Body style={{flex: 2, alignSelf:'center', alignContent:'center', alignItems:'center'}}>
                    <Text style={{fontWeight:'bold', fontSize:20}}>{this.state.receiver.fullname}</Text>
                </Body>
                <Right>
                    <Text></Text>
                </Right>
            </Header>
            <GiftedChat
                listViewProps={{
                    style: {
                        backgroundColor: '#2d3036'
                    }
                }}
                textInputProps={{
                    style: {
                        width: '80%',
                        borderRadius: 50
                    }
                }}

                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: this.state.user
                }} />
            </View>
        )
    }
}

export default connect(state => ({user: state.user}))(Chat)