// MessageList.js

import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image, Alert, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { MessageShape } from '../components/MessageUtils';
import MapView, { Marker } from 'react-native-maps';

export default class MessageList extends React.Component {
  state = {
    fullscreenImage: null,
    fullscreenLocation: null,
  };

  static propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage: PropTypes.func,
  };

  static defaultProps = {
    onPressMessage: () => {},
  };

  keyExtractor = (item) => item.id.toString();

  renderMessageItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.handlePressMessage(item)}>
      {this.renderMessageBody(item)}
    </TouchableOpacity>
  );

  renderMessageBody = (item) => {
    switch (item.type) {
      case 'location':
        return (
          <View style={styles.messageRow}>
            <TouchableOpacity onPress={() => this.handleFullscreenLocation(item)}>
              <MapView
                style={styles.map}
                initialRegion={{
                  ...item.coordinate,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                zoomEnabled={true} // Enable zoom
              >
                <Marker coordinate={item.coordinate} />
              </MapView>
            </TouchableOpacity>
          </View>
        );
      case 'text':
        return (
          <View style={styles.messageRow}>
            <View style={styles.messageBubble}>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </View>
        );
      case 'image':
        return (
          <View style={styles.messageRow}>
            <TouchableOpacity onPress={() => this.handleFullscreenImage(item)}>
              <Image style={styles.image} source={{ uri: item.uri }} />
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  handlePressMessage = (item) => {
    if (item.type === 'text') {
      Alert.alert(
        'DELETE',
        'Are you sure you want to DELETE this message?:',
        [
          {
            text: 'CANCEL',
            style: 'cancel',
          },
          {
            text: 'DELETE',
            onPress: () => this.deleteMessage(item),
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    } else {
      this.props.onPressMessage(item);
    }
  };

  deleteMessage = (item) => {
    const { messages } = this.props;
    const updatedMessages = messages.filter((message) => message.id !== item.id);
    this.setState({ fullscreenImage: null, fullscreenLocation: null }); // Close fullscreen modals if open
    this.props.onPressMessage(updatedMessages);
  };

  handleFullscreenImage = (item) => {
    this.setState({ fullscreenImage: item.uri, fullscreenLocation: null });
  };

  handleFullscreenLocation = (item) => {
    this.setState({ fullscreenImage: null, fullscreenLocation: item.coordinate });
  };

  handleCloseFullscreen = () => {
    this.setState({ fullscreenImage: null, fullscreenLocation: null });
  };

  render() {
    const { messages } = this.props;
    const { fullscreenImage, fullscreenLocation } = this.state;

    // Reverse the order of messages to display the newest messages at the bottom
    const reversedMessages = [...messages].reverse();

    return (
      <View style={styles.container}>
        <FlatList
          inverted
          data={reversedMessages} // Pass reversedMessages to FlatList
          renderItem={this.renderMessageItem}
          keyExtractor={this.keyExtractor}
          keyboardShouldPersistTaps="handled"
        />
        {fullscreenImage && (
          <Modal visible transparent>
            <TouchableOpacity style={styles.modalContainer} onPress={this.handleCloseFullscreen}>
              <Image style={styles.fullscreenImage} source={{ uri: fullscreenImage }} />
            </TouchableOpacity>
          </Modal>
        )}
        {fullscreenLocation && (
          <Modal visible transparent>
            <TouchableOpacity style={styles.modalContainer} onPress={this.handleCloseFullscreen}>
              <MapView
                style={styles.fullscreenMap}
                initialRegion={{
                  ...fullscreenLocation,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                zoomEnabled={true} // Enable zoom
              >
                <Marker coordinate={fullscreenLocation} />
              </MapView>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: 'white',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  map: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  fullscreenMap: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
