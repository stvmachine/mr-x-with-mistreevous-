import { useEffect, useState } from "react";
import { Stage, Circle, Layer } from "react-konva";
import { State, BehaviourTree } from "mistreevous";
import { PoliceStationMap, rooms, roomsArray } from "./PoliceStationMap";

const MrX = () => {
  // Step 1: Set up state for Mr. X, player, and agent
  const [mrXPosition, setMrXPosition] = useState(rooms.mainHall);
  const [playerPosition, setPlayerPosition] = useState({
    ...rooms.officeRoom,
    x: rooms.officeRoom.x + 100,
    y: rooms.officeRoom.y,
  });
  const [playerHealth, setPlayerHealth] = useState(100);
  const [isEnemyVisible, setIsEnemyVisible] = useState(false);

  // Step 2: Define behavior tree
  const definition = `root {
    selector {
        sequence {
            condition [IsSoundDetected]
            action [MoveToSound]
        }
        sequence {
            condition [IsEnemyVisible]
            action [MoveToPlayer]
            wait [2000, 4000]
            action [AttackPlayer]
        }
        action [RoamAround]
    }
  }`;

  // Step 3: Create an agent
  const agent = {
    IsSoundDetected: () => Math.random() > 0.5,

    IsEnemyVisible: () => mrXPosition.name === playerPosition.name,

    MoveToSound: () => {
      const targetRoom =
        roomsArray[Math.floor(Math.random() * roomsArray.length)];
      setMrXPosition(targetRoom);
      return State.SUCCEEDED;
    },

    MoveToPlayer: () => {
      setMrXPosition(playerPosition);
      return State.SUCCEEDED;
    },

    AttackPlayer: () => {
      setPlayerHealth((health) => Math.max(0, health - 10));
      return State.SUCCEEDED;
    },

    RoamAround: () => {
      const randomRoom =
        roomsArray[Math.floor(Math.random() * roomsArray.length)];
      setMrXPosition(randomRoom);
      return State.SUCCEEDED;
    },
  };

  // Step 4: Create behavior tree
  const behaviourTree = new BehaviourTree(definition, agent);

  // Step 5: Step through the tree periodically
  useEffect(() => {
    const interval = setInterval(() => {
      behaviourTree.step();
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    setIsEnemyVisible(mrXPosition.name === playerPosition.name);
  }, [mrXPosition, playerPosition]);

  return (
    <Stage width={700} height={500}>
      <Layer>
        <PoliceStationMap />

        <Circle
          x={playerPosition.x}
          y={playerPosition.y}
          radius={15}
          fill="blue"
        />

        {/* Mr. X Character */}
        <Circle
          x={mrXPosition.x}
          y={mrXPosition.y}
          radius={20}
          fill={isEnemyVisible ? "yellow" : "red"} 
        />
      </Layer>
    </Stage>
  );
};

export default MrX;
