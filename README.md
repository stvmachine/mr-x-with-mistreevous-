# 🧟 Mr X's Behaviour Tree

> Inspiration has many names. In my case, it's called **Mr. X**—a mysterious entity that whispers ideas into my brain at 2 AM and promptly disappears before I can ask for details. **Mr. X is scary...**

Welcome to my side project! This started as a simple idea, then spiraled into something far more ambitious, fueled by late-night caffeine and questionable life choices.

## 🎯 What Is This?

It's a **beehaviour tree entity** (Mr X) that relentlessly pursues you across the map to eliminate you. If you've ever thought, "_Why doesn't this exist in Typescript?_"—well, now it does!

## 🛠 Installation

```sh
npm install
npm run dev
```

## Features

This project utilizes the following libraries:

- React with Vite starter
- Konva – A 2D canvas library for rendering interactive graphics efficiently.
- Mistreevous – A behavior tree library used for modeling complex decision-making processes.

## Mr X's Behavior Tree

Mistreevous provides a structured way to define AI behaviors using behavior trees. This allows for modular, reusable, and predictable decision-making logic, making it ideal for handling AI-driven interactions.

The behavior tree for **Mr. X** is designed to simulate his actions and reactions in the game world. The tree defines the decision-making logic, guiding Mr. X's behavior based on conditions such as sound detection and proximity to the player.

```js
const definition = `root {
    selector {
        sequence {
            condition [IsSoundDetected]
            action [MoveToSound]
            action [AttackPlayer]
            wait [2000]
            action [RoamAround]
        }
        action [RoamAround]
    }
}`;
```

TLDR: Mr X behaves based on

- Sound Detection: Mr. X reacts to sounds in the environment. When a sound is detected, he moves towards it, attacks the player, waits, and then roams around.
- Roaming: If no sound is detected, Mr. X simply roams around, waiting for another sound or event to trigger his next action.

### Structure Overview

- `root { ... }:`
  The root of the behavior tree. All decision-making starts here.
- `selector { ... }:`
  A selector node tries to find a successful child node. It evaluates its children in order and executes the first one that succeeds. If a child fails, it moves to the next one.
- `sequence { ... }:`
  A sequence node represents a series of actions that need to be completed successfully in order. All child nodes must succeed for the sequence to be successful.

#### Sequence Breakdown

1. `condition [IsSoundDetected]:`
   This condition checks if Mr. X hears a sound. If no sound is detected, the sequence fails. If a sound is detected, the sequence proceeds.
2. `action [MoveToSound]:`
   After detecting a sound, Mr. X will move toward the sound’s location. This is an action node that directs him to the source of the sound.
3. `action [AttackPlayer]:`
   Once Mr. X is near the sound source (which is likely the player), he will attack the player. This is another action node.
4. `wait [2000]:`
   After the attack, Mr. X waits for 2 seconds (2000 milliseconds) before performing the next action.
5. `action [RoamAround]:`
   After waiting, Mr. X enters a roaming state. He randomly wanders around, awaiting the next sound or event.

### Fallback Action:

- `action [RoamAround]:`
  If the selector’s sequence doesn’t succeed (e.g., if no sound is detected), Mr. X falls back to this action and continues to roam around until he hears a sound or the next event triggers his behavior.
