// MessageUtils.js

import PropTypes from 'prop-types';

export const MessageShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['text', 'image', 'location']).isRequired,
  text: PropTypes.string,
  uri: PropTypes.string,
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
});

let messageId = 0;

function getNextId() {
  messageId += 1;
  return messageId;
}

export function createTextMessage(text) {
  return {
    type: 'text',
    id: getNextId(),
    text,
  };
}

export function createImageMessage(url) {
  return {
    type: 'image',
    id: getNextId(),
    uri: url,
  };
}

export function createLocationMessage(coordinates) {
  return {
    type: 'location',
    id: getNextId(),
    coordinate: coordinates,
  };
}