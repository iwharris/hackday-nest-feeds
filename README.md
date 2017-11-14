# hackday-nest-feeds
Hackday 2017.Q4 project

### Description
This is a quick and dirty hackday project to integrate a third party service (Nest thermostat) with AppWise. It works by listening for device changes (temperature, fan, heat/eco/off) from Nest and then publishing an event that describes what changed, and who changed it.

### Disclaimer
As a hackday project, the code is extremely ghetto. Lots of things are hardcoded and would need to be changed to support Nest devices other than mine. Use at your own risk!

### Dependencies

- Node 8

### Installation/Usage

Clone the repo.

Set environment variables:
```
# Obtain these from the Marketplace app -> Edit Integration
export FEEDS_OAUTH_CONSUMER_KEY=SOME_CONSUMER_KEY
export FEEDS_OAUTH_CONSUMER_SECRET=SOME_CONSUMER_SECRET

# Obtain these from creating a Nest developer account and app
export NEST_OAUTH_CONSUMER_KEY=SOME_CONSUMER_KEY
export NEST_OAUTH_CONSUMER_SECRET=SOME_CONSUMER_SECRET

# This is your private device serial number
export NEST_SERIAL=SOME_SERIAL_NUMBER

```

Install dependencies
```
npm install
```

Run server in dev mode
```
npm run dev
```
