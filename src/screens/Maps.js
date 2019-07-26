import React, { Component } from 'react'
import { 
    StyleSheet,
    ScrollView,
    Animated,
    TouchableOpacity,
    Dimensions,
    Image,
    Alert
} from 'react-native'
import { View, Text, Button, Header, Left, Thumbnail, Body } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service'

import { connect } from 'react-redux' 

import firebase from '../config'
import "firebase/database"
const db = firebase.database()

const Images = [
    { uri: "https://i.imgur.com/sNam9iJ.jpg" },
    { uri: "https://i.imgur.com/N7rlQYt.jpg" },
    { uri: "https://i.imgur.com/UDrH0wm.jpg" },
    { uri: "https://i.imgur.com/Ka8kNST.jpg" }
]

const { width, height } = Dimensions.get('window')

const CARD_HEIGHT = height / 4
const CARD_WIDTH = width -20


class Maps extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 37.78825,
            lng: -122.4324,
            markers: [],
            region: {
                latitude: 45.52220671242907,
                longitude: -122.6653281029795,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            },
            newState: [],
            userData: {}
        }
    }
    componentWillMount() {
        console.warn('component will mount')
        this.index = 0
        this.animation = new Animated.Value(0)
        
    }

    getCurLoc = async () => {
        await Geolocation.getCurrentPosition(response => {
            const {latitude, longitude} = response.coords
            db.ref('users/'+this.props.user.data).set({
                username: this.state.userData.username,
                coordinate: {latitude, longitude},
                email: this.state.userData.email,
                address: this.state.userData.address,
                fullname: this.state.userData.fullname,
                image: this.state.userData.image,
                status: 'online'
            })
            this.map.animateToRegion(
                {
                    latitude,
                    longitude,
                    latitudeDelta: this.state.region.latitudeDelta,
                    longitudeDelta: this.state.region.longitudeDelta                        
                },
                350
            )
        }, err => {
            console.warn(err)
        })
    }

    componentWillUnmount() {
        db.ref('users/'+this.props.user.data).update({
            status: 'offline'
        })
    }

    getOtherUsers = async () => {
        await db.collection('users')
        .get()
        .then(async docs => {
            const data = []
            await docs.forEach(doc => {
                console.warn('doc => ', doc.data())
                data.push(doc.data())
            })
            this.setState({something: data})
        })
        console.warn('some', this.state.something)
    }

    realTimeListener = async () => {
        await db.ref('users').on('child_added', async value => {
            if(value.key === this.props.user.data) {
                await this.setState({userData: {
                        id: value.key,
                        username: value.val().username,
                        fullname: value.val().fullname,
                        address: value.val().address,
                        image: value.val().image,
                        email: value.val().email,
                        coordinate: value.val().coordinate,
                        image: value.val().image,
                        status: value.val().status
                    }
                })
            } else {
                await this.setState(prevState => ({
                    newState: [...prevState.newState, {
                        id: value.key,
                        username: value.val().username,
                        fullname: value.val().fullname,
                        address: value.val().address,
                        image: value.val().image,
                        email: value.val().email,
                        coordinate: value.val().coordinate,
                        image: value.val().image,
                        status: value.val().status
                    }]
                }))
            }
            await console.warn('prevState', this.state.markers)
            await console.warn('newState',this.state.newState)
            this.getCurLoc()
        })
    }

    realTimeChangedListener = async () => {
        await db.ref('users').on('child_changed', value => {
            console.warn('child changed', value.val())
            if (value.key === this.props.user.data) {
                this.setState({
                    userData: {
                        id: value.key,
                        ...value.val()
                    }
                })
            } else {
                this.setState({newState: this.state.newState.map(state => state.id === value.key ? {...value.val(), id: value.key} : state)})

            }
        }, err => {
            console.warn('child err', err)
        })
    }

    componentDidMount() {
        this.realTimeListener()
        this.animation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3)
            if (index >= this.state.newState.length) {
                index = this.state.newState.length - 1
            }
            if (index <= 0) {
                index = 0
            }

        clearTimeout(this.regionTimeout)
        this.regionTimeout = setTimeout(() => {
            if (this.index !== index) {
                this.index = index
                const { coordinate } = this.state.newState[index]
                this.map.animateToRegion(
                    {
                        ...coordinate,
                        latitudeDelta: this.state.region.latitudeDelta,
                        longitudeDelta: this.state.region.longitudeDelta                        
                    },
                    350
                )
            }
        }, 10)
    })

    this.watchId = Geolocation.watchPosition(response => {
        console.warn('watch')
        const {latitude, longitude} = response.coords
        db.ref('users/'+this.props.user.data).update({
            coordinate: {latitude, longitude}
        })

    }, err => {
        console.warn('error', err)
    }, {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1})
    this.realTimeChangedListener()
    }


    render() {
        console.warn(this.state.newState)
        return (
            <View style={styles.container}>
            <MapView
                ref={map => this.map = map}
                provider={PROVIDER_GOOGLE}
                on
                zoomEnabled
                style={styles.container}
                initialRegion={this.state.region}>
                {
                    this.state.newState.map((marker, index) => {
                        console.warn('marker', marker)
                        return(
                            <Marker 
                                key={index}
                                coordinate={marker.coordinate}
                                 >
                                <Callout
                                    tooltip={false}
                                     >
                                    <View style={{backgroundColor:'#F4E5F7', flex:1}}>
                                        <Text style={{flex:1}}>{marker.username}</Text>
                                        <Image source={{uri: marker.image}} style={{width:'100%', height:60, flex:3}} />
                                            <View style={{backgroundColor:"#2d3036"}}>
                                                <Text style={{flex:1, color:'white'}}>{marker.fullname}</Text>
                                                <Text style={{flex:1, color:'white'}}>{marker.email}</Text>
                                            </View>
                                    </View>
                                </Callout>
                            </Marker>
                        )
                    })
                }

                </MapView>
                <Animated.ScrollView
                    horizontal 
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        x: this.animation
                                    }
                                }
                            }
                        ],
                        { useNativeDriver: true }
                    )}
                    style={styles.scrollView}
                    contentContainerStyle={styles.endPaadding}>
                    {
                        this.state.newState.map((marker, index) => (
                            <View style={styles.card} key={index}>
                                <Image style={styles.cardImage} source={{uri: marker.image}} />
                                    <View style={styles.textContent}>
                                        <Text numberOfLines={1}
                                            style={styles.cardTitle}>Name: {marker.fullname} | {
                                                marker.status === 'online' ? (<Text style={{color:'green'}}>{marker.status}</Text>) : (<Text style={{color:'red'}}>{marker.status}</Text>)
                                            }</Text>
                                        <Text numberOfLines={1}
                                            style={styles.cardDescription}>{marker.description}</Text>
                                        <View style={{flex:1, flexDirection: "row"}}>
                                        <Button onPress={() => this.props.navigation.navigate('Chat', marker)}
                                            style={{flex:2, marginHorizontal:5, alignContent:"center"}} block >
                                            <Text style={{textAlign: "center"}}>Chat</Text>
                                        </Button>
                                        <Button onPress={() => this.props.navigation.navigate('Profile', marker)}
                                            style={{flex:2, marginHorizontal:5}} block >
                                            <Text style={{textAlign: "center"}}>Profile</Text>
                                        </Button>
                                        </View>
                                    </View>
                            </View>
                        ))
                    }
                </Animated.ScrollView>
            
            
            <View style={{position: 'absolute', width: "100%", flex: 1, aligenItem: 'center', paddingHorizontal:15, paddingVertical:10}}>
            <Header style={{backgroundColor:'#2d3036', width: '100%', flex: 1, borderRadius: 50}}>
                <Left style={{flex:1}}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', this.state.userData)}>
                    <Thumbnail
                        source={{uri: this.state.userData.image}}
                        style={{ width: 45, height: 45}}
                    />
                    </TouchableOpacity>
                </Left>
                <Body style={{flex: 2}}>
                    <Text style={{fontWeight:'bold', fontSize:20, color:'white'}}>{this.state.userData.fullname}</Text>
                </Body>
            </Header>
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    scrollView: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        right: 0,
        paddingVertical: 20
    },
    map: {
      ...StyleSheet.absoluteFillObject
    },
    endPaadding: {
        paddingRight: width - CARD_WIDTH -50
    },
    card: {
        padding: 10,
        elevation: 2,
        backgroundColor: '#2d3036',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: {x: 2, y: -2},
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: 'hidden'
    },
    cardImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        alignSelf: 'flex-start'
    },
    textContent: {
        flex: 1
    },
    cardTitle: {
        fontSize: 12,
        marginTop: 5,
        color: '#fff',
        fontWeight: 'bold'
    },
    cardDescription: {
        fontSize: 12,
        color: '#444'
    },
    markerWrap: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    marker: {
        width: 8,
        height: 8,
        borderTopStartRadius: 4,
        backgroundColor: 'rgba(130, 4, 150, 0.9)'
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(130, 4, 150, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(130, 4, 150, 0.5)'
    }
   })

export default connect(state => ({user: state.user}))(Maps)