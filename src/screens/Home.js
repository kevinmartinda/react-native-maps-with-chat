import React, { Component } from 'react'
import { AsyncStorage, ActivityIndicator, View, PermissionsAndroid } from 'react-native'
import { Container } from 'native-base';

import { connect } from 'react-redux'
import { setUserUId } from '../public/redux/actions/user'

class Home extends Component {
    constructor(props) {
        super(props)
        this._bootstrapAsync()
        this.state = {
            isLogin: false
        }
        PermissionsAndroid.check("android.permission.ACCESS_FINE_LOCATION")
        .then(response => {
          response ? null : this.requestLocationPermission()
        })
    }

    requestLocationPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'MapsWithChat Location Permission',
              message:
                'MapsWithChat require permission to access your location' +
                'Please enable them or it can\'t  detect your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
          } else {
            console.log('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }

    componentDidMount() { 	
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
            () => {
              this._bootstrapAsync();
            }
        );
      }
    
      componentWillUnmount() {
        this.willFocusSubscription.remove();
      }

    _bootstrapAsync = async () => {
        await AsyncStorage.getItem('userid', (error, result) => {
                if(result) {
                    this.props.dispatch(setUserUId(result))
                    this.setState({
                        isLogin: true
                    })
                }
        });
    }

    setLoad = () => {
        setTimeout(() => {
            this.state.isLogin ? this.props.navigation.navigate('Maps') : this.props.navigation.navigate('Login') 
        }, 2500)
    }

    render() {
        return(
            <Container style={{backgroundColor:'#2d3036'}}>
            <View style={{flex: 1, alignItem: 'center'}}>
                <ActivityIndicator size="large" color="blue" style={{flex: 1}} />
                { this.setLoad()}
            </View>
            </Container>
        )
    }
}

export default connect(state => ({user: state.user}))(Home)