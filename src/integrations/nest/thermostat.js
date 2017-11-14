import { diff } from 'deep-object-diff';
import objectPath from 'object-path';
import config from 'config';

class Thermostat {
  constructor(initialDeviceData) {
    this.deviceData = initialDeviceData;
  }

  updateDataAndGetDiff(newDeviceData) {
    let latestDiff = null;
    if (this.deviceData) {
      latestDiff = diff(this.deviceData, newDeviceData);
    }
    this.deviceData = newDeviceData;
    return latestDiff;
  }

  getPath(pathStr, defaultValue) {
    return objectPath.get(this.deviceData, pathStr, defaultValue);
  }

  getId() {
    return this.getPath('device_id', '<N/A>');
  }

  getName() {
    return this.getPath('name', '<N/A>');
  }

  getTemperatureUnits() {
    return this.getPath('temperature_scale', 'C');
  }

  getAmbientTemperature() {
    const units = this.getTemperatureUnits().toLowerCase();
    return this.getPath(`ambient_temperature_${units}`, 'N/A');
  }

  getTargetTemperature() {
    const units = this.getTemperatureUnits().toLowerCase();
    return this.getPath(`target_temperature_${units}`, 'N/A');
  }

  getTitleText() {
    const name = this.getPath('name', 'N/A');
    return `Nest Thermostat - ${name}`;
  }

  getDescriptionText() {
    const state = this.getPath('hvac_state', 'off'); // heating, cooling, or off
    return `Nest is currently ${state}.`;
  }

  getStatusText() {
    const units = this.getTemperatureUnits();
    const ambient = this.getAmbientTemperature();
    const state = this.getPath('hvac_state', 'off'); // heating, cooling, or off
    return `${ambient}°${units} - ${state}`;
  }

  getFields() {
    const units = this.getTemperatureUnits();

    return [
      {
        name: '_title',
        value: this.getTitleText(),
      },
      {
        name: '_description',
        value: this.getDescriptionText(),
      },
      {
        name: '_htmlUrl',
        value: 'https://home.nest.com/thermostat/' + config.get('nest.serial'), // TODO obtain serial number from API
      },
      {
        name: 'Ambient temperature',
        value: `${this.getAmbientTemperature()}°${units}`,
      },
      {
        name: 'Target temperature',
        value: `${this.getTargetTemperature()}°${units}`,
      },
      {
        name: 'Humidity',
        value: `${this.getPath('humidity', 'N/A')}%`,
      },
      {
        name: 'Leaf',
        value: this.getPath('has_leaf', false) === true,
      },
      {
        name: 'Mode',
        value: this.getPath('hvac_mode', 'N/A'),
      },
      {
        name: 'Locked',
        value: this.getPath('is_locked', false) === true,
      },
      {
        name: 'Status',
        value: this.getStatusText(),
        badge: true,
      },
    ];
  }
}

module.exports = Thermostat;
