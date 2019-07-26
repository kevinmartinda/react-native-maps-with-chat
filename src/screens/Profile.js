import React, { Component } from 'react'
import { Image, AsyncStorage, TouchableOpacity } from 'react-native'
import { View, Text, ListItem, Button, Header, Left, Icon } from 'native-base';

import { connect } from 'react-redux'

class Profile extends Component {

    constructor(props) {
        super(props)
    }

    handleLogout = () => {
        AsyncStorage.removeItem('userid')
        this.props.navigation.navigate('Home')
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: "column", backgroundColor:'#2d3036'}}>
            <Header style={{backgroundColor:'white'}}>
                <Left style={{flex:1}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="arrow-back" style={{color: 'blue'}} />
                    </TouchableOpacity>
                </Left>
            </Header>
                <View style={{flex: 1, width: '100%', alignContent:'center', paddingVertical:'20%', paddingHorizontal:'27%', backgroundColor:'#0f112e'}}>
                    <Image 
                        style={{width: 150, height: 150, borderRadius: 100}}
                        source={{uri: this.props.navigation.state.params.image}} />
                </View>
                <View style={{flex: 3}}>
                <ListItem>
                    <Text style={{color: 'white'}}>Name : {this.props.navigation.state.params.fullname} </Text>
                </ListItem>
                <ListItem>
                    <Text style={{color: 'white'}}>Address : {this.props.navigation.state.params.address} </Text>
                </ListItem>
                <ListItem>
                    <Text style={{color: 'white'}}>Email : {this.props.navigation.state.params.email} </Text>
                </ListItem>
                {
                    this.props.navigation.state.params.id === this.props.user.data ? (
                    <View style={{flex:1, padding: 20}}>
                    <Button 
                        onPress={() => this.handleLogout()} 
                        style={{width: '100%'}}
                        block >
                        <Text>Logout</Text>
                    </Button>
                    </View>
                    ) : null
                }
                </View>
            </View>
        )
    }
}

export default connect(state => ({user: state.user}))(Profile)