// App.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Status from './components/Status';
import Toolbar from './components/Toolbar';
import { createImageMessage, createTextMessage, createLocationMessage } from './components/MessageUtils';
import MessageList from './components/MessageList';
import * as Location from 'expo-location';

export default class App extends React.Component {
  state = {
    isInputFocused: false,
    messages: [
      createLocationMessage({
        latitude: 37.7749, // Default coordinates for San Francisco
        longitude: -122.4194,
      }),
      createTextMessage('Hello'),
      createTextMessage('World'),
      createImageMessage('https://unsplash.it/300/300'),
    ],
  };

  handlePressToolbarCamera = () => {
    // Do nothing when the camera icon is clicked
  };

  handlePressToolbarLocation = async () => {
    const { messages } = this.state;

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Create a new location message with the current location coordinates
      const newLocationMessage = createLocationMessage({
        latitude,
        longitude,
      });

      // Update the state to add the new location message at the end
      this.setState({
        messages: [...messages, newLocationMessage],
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;
    const newTextMessage = createTextMessage(text);

    // Insert the new text message at the end of the messages array
    this.setState({
      messages: [...messages, newTextMessage],
    });
  };

  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <Toolbar
        isFocused={isInputFocused}
        onSubmit={this.handleSubmit}
        onChangeFocus={this.handleChangeFocus}
        onPressCamera={this.handlePressToolbarCamera}
        onPressLocation={this.handlePressToolbarLocation}
      />
    );
  }

  render() {
    const { messages } = this.state;

    return (
      <View style={styles.container}>
        <Status />
        <MessageList messages={messages} onPressMessage={(updatedMessages) => this.setState({ messages: updatedMessages })} />
        {this.renderToolbar()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
