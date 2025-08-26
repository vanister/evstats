# EVStats

Electric vehicle charging statistics tracker built with Ionic React.

Track your EV charging sessions, monitor costs, and analyze your charging patterns with detailed statistics and interactive charts.

See [mvp.md](mvp.md) for complete feature implementation status - all MVP requirements are ✅ complete!

## Demo

_Demo video coming soon_

## Prerequisites

- Install the [Webnative VS Code extension](https://marketplace.visualstudio.com/items?itemName=Webnative.webnative) for the best development experience

## Setup

```bash
npm install
npx cap sync
```

## Environment Variables (Optional)

Create a `.env.local` file with:

```bash
IOS_TARGET_DEVICE=your-device-id  # iOS device/simulator ID
DEV_PORT=8100                     # Development server port
DEV_HOST=localhost                # Development server host
```

## Development

```bash
npm run start.ios  # iOS with live reload
```

## Generate Test Data

```bash
npm run generate:vehicles  # Generate sample vehicles
npm run generate:sessions  # Generate sample charging sessions
```

## Build

```bash
npm run build
npx cap copy ios
npx cap open ios
```
