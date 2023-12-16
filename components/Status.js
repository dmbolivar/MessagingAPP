import Constants from 'expo-constants';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';

export default function Status() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const bubbleBackgroundColor = isConnected ? 'grey' : 'red';

  const statusBar = (
    <StatusBar
      backgroundColor={bubbleBackgroundColor}
      barStyle={isConnected ? 'dark-content' : 'light-content'}
      animated={false}
    />
  );

  const messageContainer = (
    <View style={styles.messageContainer} pointerEvents="none">
      {statusBar}
      <View style={[styles.bubble, { backgroundColor: bubbleBackgroundColor }]} />
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.status, { backgroundColor: bubbleBackgroundColor }]} />
    );
  }

  return messageContainer;
}

Status.propTypes = {
  // Define propTypes if needed
};

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: Constants.statusBarHeight,
  },
  messageContainer: {
    display: 'none', // Set display to 'none' to remove the message container
  },
  bubble: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
