# React-Native Maps with Chat
### 1. What is this  
This is just a simple maps app showing along all users that have signed up to this app and they can chat to each other.
  
As it stated, i used react-native as my base framework for building this app, and as you expected I also used [Google Maps Platform](https://developers.google.com/maps/documentation/) for the Maps API. Maybe you wondered about the <b>chat</b> chat section, yeah i used [Google Firebase](https://firebase.google.com/) for chat feature due to its realtime datavase that can i use as database for storing the chat data.  
  
# React-Native Maps with Chat [Screenshots]
<p align="center">
    <img src="https://user-images.githubusercontent.com/43369306/62010872-adc59d80-b19a-11e9-9d57-27a5315f21b5.jpg" width=200 align="center" style="margin-right:20px"/>
    <img src="https://user-images.githubusercontent.com/43369306/62010876-c46bf480-b19a-11e9-96d9-d8b73a80c3ba.jpg" width=200 align="center"/>
    <img src="https://user-images.githubusercontent.com/43369306/62010880-d8175b00-b19a-11e9-9e20-0d1ad4f24244.jpg" width=200 align="center"/>
    <img src="https://user-images.githubusercontent.com/43369306/62010892-0006be80-b19b-11e9-9e63-b818c9c9f217.jpg" width=200 align="center"/>
    <img src="https://user-images.githubusercontent.com/43369306/62010896-10b73480-b19b-11e9-8299-e7f343e94c61.jpg" width=200 align="center"/>
    <img src="https://user-images.githubusercontent.com/43369306/62010899-2298d780-b19b-11e9-8654-6c8f1d45942e.jpg" width=200 align="center"/>
</p>

  
# How to run  
You can [download the .apk file](https://drive.google.com/open?id=1mo_mn8p1WgftsyQnLyeNhbG2EuRPF9Zm) and simply install it, or you can either clone this repository or download the repository and rebuild it with a little setting.  

make sure you have Google Maps API and firebase account, if you don't, you can create it in [this link](https://developers.google.com/maps/documentation/android-sdk/get-api-key) for Maps API and [this link](https://firebase.google.com/?hl=id) for firebase.
  
make sure you have react-native cli installed globaly in your machine, to install it just simply run the following command:
  
```sh
npm i -g react-native-cli
```
  
after you cloned or downloaded this repository, run the following command: 
  
```sh
cd react-native-maps-with-chat && npm i
```
  
After that, edit the .env file in the root directory to your own secret API and run it in debug mode with the following command in your CLI: 
  
```sh
react-native run android
```
  
you can watch demo of this app [here](https://youtu.be/MXNVIOvPlzg)
  
# Requirements  
-[Node.js](https://nodejs.org/en/) V8+