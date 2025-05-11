# Asteroids

Asteroids is a multiplayer version of the classic arcade game, currently under development. The game features real-time gameplay where players can shoot down randomly spawning asteroids.

## Current Features

- **Client-Side Implementation**:
  - Written in TypeScript.
  - Uses SVG for rendering graphics such as the player, bullets, and asteroids.
  - Random asteroids spawn on page load.
  - Players can shoot bullets to destroy asteroids.

## Planned Features

- **Backend Implementation**:

  - To be written in Dart.
  - Communicates with the frontend via WebSockets.
  - Synchronizes player inputs in real-time.
  - Updates object positions every second.

- **Client Prediction**:

  - Ensures smooth gameplay by predicting object positions between backend updates.

- **Multiplayer Combat**:
  - Players will be able to shoot down other players in addition to asteroids.

## How to Run

1. Clone the repository.
2. Navigate to the `asteroids-client` directory.
3. Install dependencies and start the client.
   - `npm install`
   - `npm run dev`
