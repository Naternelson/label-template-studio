# Gamepad Integration Documentation

## Table of Contents
1. [Overview](#overview)
2. [Files and Functions](#files-and-functions)
    - [GamepadProvider.tsx](#gamepadprovidertsx)
    - [GamepadContext.ts](#gamepadcontextts)
    - [util.ts](#utilts)
3. [Usage Examples](#usage-examples)
    - [Setting Up the GamepadProvider](#setting-up-the-gamepadprovider)
    - [Using the Gamepad Context](#using-the-gamepad-context)
4. [API Reference](#api-reference)
    - [GamepadProvider](#gamepadprovider)
    - [useGamepad](#usegamepad)
    - [GamepadContextType](#gamepadcontexttype)
    - [Events and Callbacks](#events-and-callbacks)

## Overview
This documentation covers the gamepad integration utilities provided in the directory. It includes context providers, custom hooks, and utility types for managing gamepad input in a React application.

## Files and Functions

### GamepadProvider.tsx
This file defines the `GamepadProvider` component, which supplies context for managing gamepad input. The key functionalities provided by this file include:

- **GamepadProvider Component**: Initializes and provides context for managing gamepad input.
- **useListening Hook**: Handles gamepad connections, disconnections, and polling for input events.
- **useButtonListeners Hook**: Manages button listeners, allowing for the addition and removal of listeners.
- **useAxisListeners Hook**: Manages axis listeners, allowing for the addition and removal of listeners.

### GamepadContext.ts
This file defines the gamepad context and a custom hook for using the context. The main components are:

- **GamepadContext**: A React context for gamepad input.
- **useGamepad Hook**: A custom hook that provides access to the gamepad context and ensures it is used within a `GamepadProvider`.

### util.ts
This file contains utility types and constants used across the gamepad integration logic. It includes:

- **Button and Axis Maps**: Default mappings for buttons and axes.
- **Event Types**: Definitions for gamepad change events, including `ButtonChangeEvent` and `AxisChangeEvent`.
- **Callback Types**: Types for button and axis event callback functions.
- **Context Type**: The `GamepadContextType` that defines the structure of the gamepad context.

## Usage Examples

### Setting Up the GamepadProvider
To set up the `GamepadProvider`, wrap your application or a part of your application with the `GamepadProvider` component. This enables the use of gamepad context within the wrapped components.

```jsx
import { GamepadProvider } from './GamepadProvider';

const App = () => (
  <GamepadProvider disabled={false}>
    <YourComponent />
  </GamepadProvider>
);
```

### Using the Gamepad Context
Within any component wrapped by `GamepadProvider`, you can use the `useGamepad` hook to access and manage gamepad events.

```jsx
import { useGamepad } from './GamepadContext';

const YourComponent = () => {
  const { addButtonListener, addAxisListener, buttonKeys } = useGamepad();

  useEffect(() => {
    const handleButtonPress = (event) => {
      console.log('Button pressed:', event);
    };
    const handleAxisMove = (event) => {
      console.log('Axis moved:', event);
    };

    const removeButtonListener = addButtonListener(buttonKeys.button.A, handleButtonPress);
    const removeAxisListener = addAxisListener(buttonKeys.axis.LEFT, handleAxisMove);

    return () => {
      removeButtonListener();
      removeAxisListener();
    };
  }, [addButtonListener, addAxisListener]);

  return <div>Gamepad input is active!</div>;
};
```

## API Reference

### GamepadProvider
A component that provides context for managing gamepad input.

**Props:**
- `disabled`: A boolean to enable or disable gamepad input.
- `buttonMap`: A custom map for button names (optional).
- `onConnect`: A callback function for gamepad connect events (optional).
- `onDisconnect`: A callback function for gamepad disconnect events (optional).

### useGamepad
A custom hook that provides access to the gamepad context. Must be used within a `GamepadProvider`.

**Returns:**
- `addButtonListener`: Function to add a button listener.
- `addAxisListener`: Function to add an axis listener.
- `removeButtonListener`: Function to remove a button listener.
- `removeAxisListener`: Function to remove an axis listener.

### GamepadContextType
Defines the structure of the gamepad context, including methods for adding and removing listeners and the button map.

### Events and Callbacks
- **ButtonChangeEvent**: Event type for button changes.
- **AxisChangeEvent**: Event type for axis changes.
- **ButtonCallback**: Callback type for button events.
- **AxisCallback**: Callback type for axis events.

## Definitions in util.ts

### Button and Axis Maps
Default mappings for buttons and axes.

### Event Types
Definitions for gamepad change events, including `ButtonChangeEvent` and `AxisChangeEvent`.

### Callback Types
Types for button and axis event callback functions.

### Context Type
The `GamepadContextType` that defines the structure of the gamepad context.
