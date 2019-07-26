import * as firebase from 'firebase/app'
import Config from 'react-native-config'

const firebaseConfig = {
    apiKey: Config.API_KEY,
    authDomain: Config.AUTH_DOMAIN,
    databaseURL: Config.DATABASE_URL,
    projectId: Config.PROJECT_ID,
    storageBucket: "",
    messagingSenderId: Config.MESSAGING_SENDER_ID,
    appId: Config.APP_ID
  }
const App = firebase.initializeApp(firebaseConfig)
console.log(App.name)
export default App