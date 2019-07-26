import { createMaterialTopTabNavigator } from 'react-navigation'

import Login from '../screens/Login'
import Register from '../screens/Register'

const TopTabNavigator = createMaterialTopTabNavigator({
	Register: {
		screen: Register,
		navigationOptions: {
	    	tabBarLabel: 'Daftar',
	    },
	},
	Login: {
		screen: Login,
		navigationOptions: {
	    	tabBarLabel: 'Log In',
	    }
	}
}, {
	tabBarOptions: {
		style: {
		  backgroundColor: '#0f112e',
		},
	  }
})

export default TopTabNavigator