import { useEffect, useState } from "react";
import { Stage, Circle, Layer, Group } from "react-konva";
import { State, BehaviourTree } from "mistreevous";
import { PoliceStationMap, rooms, roomsArray } from "./PoliceStationMap";

const MrX = () => {
  // Step 1: Set up a state to track Mr. X's position
  const [x, setX] = useState(rooms.mainHall.x);
  const [y, setY] = useState(rooms.mainHall.y);

  const agentState = {
    soundDetected: false,
    enemyVisible: false,
    playerHealth: 100,
    mrXPosition: rooms.mainHall,
    playerPosition: rooms.officeRoom,
  };

  // Step 2: Set up the behavior tree definition using MDSL
  const definition = `root {
    selector {
        sequence {
            condition [IsSoundDetected]
            action [MoveToSound]
        }
        sequence {
            condition [IsEnemyVisible]
            action [MoveToPlayer]
			wait [2000, 3000]
            action [AttackPlayer]
        }
        action [RoamAround]
    }
  }`;

  // Step 3: Create an agent that will perform actions
  const agent = {
    IsSoundDetected: () => {
      agentState.soundDetected = Math.random() > 0.5;
      return agentState.soundDetected;
    },
    IsEnemyVisible: () => {
      agentState.enemyVisible =
        agentState.mrXPosition.name === agentState.playerPosition.name;
      return agentState.enemyVisible;
    },
    MoveToSound: () => {
      agentState.mrXPosition =
        roomsArray[Math.floor(Math.random() * roomsArray.length)];
      setX(agentState.mrXPosition.x);
      setY(agentState.mrXPosition.y);
      return State.SUCCEEDED;
    },

    MoveToPlayer: () => {
      agentState.mrXPosition =
        roomsArray[Math.floor(Math.random() * roomsArray.length)];
      setX(agentState.mrXPosition.x);
      setY(agentState.mrXPosition.y);
      return State.SUCCEEDED;
    },

    AttackPlayer: () => {
      agentState.playerHealth -= 10;
      console.log(`Player health: ${agentState.playerHealth}`);
      return State.SUCCEEDED;
    },

    RoamAround: () => {
      agentState.mrXPosition =
        roomsArray[Math.floor(Math.random() * roomsArray.length)];
      setX(agentState.mrXPosition.x);
      setY(agentState.mrXPosition.y);
      return State.SUCCEEDED;
    },
  };

  // Step 4: Create the behavior tree with MDSL and the agent
  const behaviourTree = new BehaviourTree(definition, agent);

  // Step 5: Step through the tree periodically
  useEffect(() => {
    const interval = setInterval(() => {
      behaviourTree.step();
    }, 1000); // Update every second

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Stage width={700} height={500}>
      <Layer>
        {/* Render Police Station Map inside the Layer */}
        <PoliceStationMap />

        {/* Mr. X Character */}
        <Group>
          <Circle x={x} y={y} radius={20} fill="red" />
        </Group>
      </Layer>
    </Stage>
  );
};

export default MrX;
