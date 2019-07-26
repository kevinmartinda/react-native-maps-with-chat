import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation'

import Home from '../screens/Home'
import TopTabNavigator from '../routes/TopTabNavigator'
import Maps from '../screens/Maps'
import Chat from '../screens/Chat'
import Profile from '../screens/Profile'

const StackNavigator = createStackNavigator({
    Home: Home
}, {
    defaultNavigationOptions: {
        header: () => null
    }
})

const MapsStackNavigator = createStackNavigator({
    Maps: Maps,
    Chat: Chat,
    Profile: Profile
}, {
    defaultNavigationOptions: {
        header: () => null
    }
})

const RootNavigator = createSwitchNavigator({
    Home: {
        screen: StackNavigator
      },
    Login: {
        screen: TopTabNavigator
    },
    Maps: {
        screen: MapsStackNavigator
    }
})

const AppNavigator = createAppContainer(RootNavigator)

export default AppNavigator