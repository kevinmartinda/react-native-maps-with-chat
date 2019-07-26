import React, {Component} from 'react';
import { Provider } from 'react-redux'

import AppNavigator from './src/routes/RootNavigator'

import store from './src/public/redux/store'

export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}