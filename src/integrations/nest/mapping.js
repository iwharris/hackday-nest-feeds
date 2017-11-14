import objectPath from 'object-path';
import config from 'config';

/**
 * Compute the action object that describes the device diff.
 * It will be null if the diff is unknown.
 * @param {*} diffs
 * @param {*} fieldAction
 */
const buildAction = (diffs, fieldAction) => {
  let actionObject;

  if (fieldAction === 'initial') {
    actionObject = {
      verb: 'connected',
      text: 'this device to AppWise',
    };
  } else if (diffs.target_temperature_c) {
    actionObject = {
      verb: 'changed',
      text: `target temperature to ${diffs.target_temperature_c}°C`,
    };
  } else if (diffs.target_temperature_f) {
    actionObject = {
      verb: 'changed',
      text: `target temperature to ${diffs.target_temperature_f}°F`,
    };
  } else if (objectPath.has(diffs, 'fan_timer_active')) {
    const newFanState = diffs.fan_timer_active ? 'on' : 'off';
    actionObject = {
      verb: `turned ${newFanState}`,
      text: 'the fan',
    };
  } else if (diffs.hvac_state) {
    actionObject = {
      verb: 'set',
      text: `mode to "${diffs.hvac_state}"`,
    };
  } else if (objectPath.has(diffs, 'is_locked')) {
    const newLockState = diffs.is_locked ? 'locked' : 'unlocked';
    actionObject = {
      verb: newLockState,
      text: 'the target temperature',
    };
  } else if (objectPath.has(diffs, 'last_connection')) { // Ignore
    return null;
  } else {
    console.log('discarded diffs', diffs);
  }

  return actionObject;
};

const getKeyForDevice = device => ({
  source: config.get('feeds.app.id'),
  instance: 'default',
  resourceId: device.getId(),
});

const diffsToEvent = (type, diffs, device, fieldAction) => {
  // console.log(device);
  const action = buildAction(diffs, fieldAction);

  if (!action) { // Skip creating an event
    return null;
  }

  const userConfig = config.get('feeds.user');

  const userObject = {
    identifier: `${userConfig.handle}@${userConfig.userId}@${userConfig.companyId}`,
  };

  const payload = {
    key: getKeyForDevice(device),

    actor: userObject,

    users: [userObject],

    action,
  };

  payload[fieldAction] = {
    fields: device.getFields(),
  };

  return payload;
};

module.exports = {
  getKeyForDevice,
  diffsToEvent,
};
