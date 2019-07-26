import React, { Component } from 'react'
import { ActivityIndicator, ScrollView, AsyncStorage, Alert, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native'
import { Container, Text, Content, Form, Input, Item, Button, View } from 'native-base'
import Geolocation from 'react-native-geolocation-service'

import firebase from '../config'
import 'firebase/auth'
import 'firebase/database'

const db = firebase.database()

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            coordinate: {},
            email: '',
            password: '',
            repassword: '',
            username: '',
            image: '',
            address: '',
            fullname: '',
            isLoading: false
        }
        AsyncStorage.getItem('userid')
    }

    componentDidMount() {
        this.getCurLoc()
    }

    getCurLoc = async () => {
        await Geolocation.getCurrentPosition(async (response) => {
            console.warn('ay')
            await this.setState({coordinate: {latitude: response.coords.latitude, longitude: response.coords.longitude}})
        }, error => {
            return {error}
        })
    }

    handleRegister = async (additionalData) => {
        if(this.state.password !== this.state.repassword) {
            alert(`Password didn't match!`)
        } else {
            this.setState({isLoading: true})
            const validatedEmail = this.validateEmail(this.state.email)
            if(validatedEmail) {
                
                return false
            } else {}
            await firebase.auth().createUserWithEmailAndPassword(validatedEmail, this.state.password)
            .then(async response => {
                console.warn(response.user)
                await AsyncStorage.setItem('userid', response.user.uid)
                await db.ref('users/' + response.user.uid).set({
                    fullname: additionalData.fullname,
                    username: additionalData.username,
                    address: additionalData.address,
                    email: response.user.email,
                    coordinate: this.state.coordinate,
                    image: additionalData.image ? additionalData.image : 'https://www.sackettwaconia.com/wp-content/uploads/default-profile.png' 
                })
                .then(() => alert('Registraton success!'))
                .catch(err => {
                    console.warn(err)
                    alert.alert('Error', 'Something went wrong, please try again later')
                })
            })
            .catch(err => {
                switch(err.code) {
                    case 'auth/email-already-in-use':
                        alert('This email is already in use..')
                    break
                    case 'auth/invalid-email':
                        alert('This email is invalid')
                    break
                    case 'auth/weak-password':
                        alert('password must contain at least 6 characters')
                    break
                    default:
                        Alert.alert('Error', err)
                }
            }).finally(() => {
                this.setState({isLoading: false})
                this.props.navigation.navigate('Home')
            })
            console.log('success')
        }
        
    }

    validateEmail = email => {
        const validator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return validator.test(email)
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
                             <TextInput onChangeText={value => {this.setState({fullname: value})}}
                             placeholderTextColor="white"
                             style={styles.input}
                             placeholder="Fullname" />
                            <TextInput password onChangeText={value => {this.setState({username: value})}}
                             placeholderTextColor="white"
                             placeholder="Username"
                             style={styles.input}
                              />
                            <TextInput selectTextOnFocus onChangeText={value => {this.setState({image: value})}}
                             placeholderTextColor="white"
                             placeholder="Image Url"
                             style={styles.input} />
                            <TextInput onChangeText={value => {this.setState({address: value})}}
                             placeholderTextColor="white"
                             multiline
                             style={styles.input}
                             numberOfLines={3}
                             placeholder="Address" />
                            <TextInput secureTextEntry onChangeText={value => {this.setState({password: value})}}
                            placeholderTextColor="white" 
                            placeholder="Password"
                            style={styles.input}
                            />
                            <TextInput onChangeText={value => {this.setState({repassword: value})}}
                            placeholderTextColor="white" placeholder="Re-Password" style={{...styles.input, ...styles.inputLast}}
                            secureTextEntry />
                        <Button onPress={() => this.handleRegister({username: this.state.username, fullname: this.state.fullname, image: this.state.image, address: this.state.address })}
                        block>
                            <Text>Register</Text>
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
        paddingHorizontal:15, 
        height:'100%'
    },
    logo: {
        width:150, 
        height:51, 
        alignSelf:'center', 
        marginBottom:"10%"
    },
    form: {
        flex: 3,  
        borderRadius:20, 
        backgroundColor:'#0f112e', 
        padding:20
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

export default Register