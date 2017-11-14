import config from 'config';
import EventSource from 'eventsource';
import objectPath from 'object-path';
import Thermostat from './thermostat';
import { diffsToEvent } from './mapping';
import { submitEvent } from '../appwise/feeds';

const { apiUrl } = config.get('nest');

class NestStream {
  constructor(authToken) {
    this.deviceMap = {
      thermostat: {},
    };

    this.eventSource = new EventSource(`${apiUrl}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    this.eventSource.addEventListener('open', this.onOpen);
    this.eventSource.addEventListener('put', this.onUpdate.bind(this));
    this.eventSource.addEventListener('auth_revoked', this.onAuthRevoked);
    this.eventSource.addEventListener('error', this.onError, false);
  }

  hasDevice(type, id) {
    return !!this.getDevice(type, id, false);
  }

  getDevice(type, id, defaultValue) {
    return objectPath.get(this.deviceMap, [type, id], defaultValue);
  }

  setDevice(type, id, device) {
    objectPath.set(this.deviceMap, [type, id], device);
  }

  static onOpen() {
    console.log('Connection opened!');
  }

  onUpdate(event) {
    const data = JSON.parse(event.data);
    // console.log(data);
    const thermostats = objectPath.get(data, 'data.devices.thermostats', {});
    Object.values(thermostats).forEach((deviceData) => {
      const deviceType = 'thermostat';
      const id = deviceData.device_id;
      let device = this.getDevice(deviceType, id, null);
      let fieldAction = 'changes';
      if (!device) { // Create device if it doesn't exist
        fieldAction = 'initial';
        device = new Thermostat(deviceData);
        this.setDevice(deviceType, id, device);
      }
      const diff = device.updateDataAndGetDiff(deviceData);

      // Generate event payload
      const payload = diffsToEvent('thermostat', diff, device, fieldAction);

      // Send event to AppWise
      if (!payload) {
        // console.log('skipping payload submission since no action took place.');
      } else {
        console.log('sending payload', payload);
        submitEvent(payload);
      }
    });
  }

  static onAuthRevoked() {
    console.log('Auth token was revoked.');
    // Re-authenticate
  }

  static onError(event) {
    if (event.readyState === EventSource.CLOSED) {
      console.error('Connection was closed!', event);
    } else {
      console.error('An unknown error occurred: ', event);
    }
  }
}

module.exports = NestStream;
