import React, { Component } from 'react'
import { ScrollView, AsyncStorage, ActivityIndicator, Alert, StyleSheet, Image, TextInput } from 'react-native'
import { Container, Text, Content, Form, Input, Item, Button, View, } from 'native-base'

import firebase from '../config'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            isLoading: false
        }
    }

    handleLogin = async () => {
        this.setState({isLoading: true})
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(async response => {
            console.warn(response.user)
            await AsyncStorage.setItem('userid', response.user.uid)
            console.warn(AsyncStorage.getItem('userid'))
            this.props.navigation.navigate('Home')
        })
        .catch(err => {
            console.warn(err)
            switch(err.code) {
                case 'auth/user-not-found':
                    Alert.alert('Error', 'User Not Found!')    
                break
                default:
                    Alert.alert('Error', 'something went wrong')
            }
        })
        .finally(() => this.setState({isLoading: false}))
        
    }

    render() {
        return (
            <ScrollView>
            <Container style={styles.container}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                    <Form style={styles.form}>                     
                            <TextInput onChangeText={value => {this.setState({email: value})}}
                             placeholderTextColor="white"
                             style={styles.input}
                             placeholder="Email" />
                            <TextInput onChangeText={value => {this.setState({password: value})}}
                            placeholderTextColor="white"
                            secureTextEntry
                            style={{...styles.input, ...styles.inputLast}} 
                            placeholder="Password" />
                        
                            <Button block onPress={() => this.handleLogin()}>
                                <Text>Login</Text>
                            </Button>      
                    </Form>
                {this.state.isLoading ? <ActivityIndicator size="large" /> : null}
            </Container>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor:'#2d3036', 
        alignContent:'center', 
        paddingVertical:'10%', 
        paddingHorizontal:15
    },
    logo: {
        flex: 1,
        width:150, 
        height:51, 
        alignSelf:'center', 
        marginBottom:"10%"
    },
    form: {
        flex: 3,  
        justifyContent:'space-between',
        alignContent:'center',
        borderRadius:20, 
        backgroundColor:'#0f112e', 
        paddingVertical:'30%',
        paddingHorizontal:'10%'
    },
    input: {
        color:'white',  
        borderRadius:10, 
        backgroundColor:'#628c87', 
        opacity: 0.5,
        padding:10,
        marginVertical: 5
    },
    inputLast: {
        marginBottom: 15
    }
})

export default Login