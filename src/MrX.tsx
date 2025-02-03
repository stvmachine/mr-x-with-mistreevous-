import { useEffect, useState } from "react";
import { Stage, Circle, Layer, Text } from "react-konva";
import { State, BehaviourTree } from "mistreevous";
import { PoliceStationMap, Room, rooms, roomsArray } from "./PoliceStationMap";

const MrX = () => {
  // Step 1: Set up state for Mr. X, player, and agent
  const [mrXPosition, setMrXPosition] = useState<Room>(rooms.mainHall);
  const [playerPosition, setPlayerPosition] = useState({
    ...rooms.officeRoom,
    x: rooms.officeRoom.x + 100,
    y: rooms.officeRoom.y,
  });
  const [playerHealth, setPlayerHealth] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  // Step 2: Define behavior tree
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

  // Step 3: Create an agent
  const agent = {
    IsSoundDetected: () => Math.random() > 0.35,

    MoveToSound: () => {
      if (gameOver) {
        return State.FAILED; // Stop movement if game is over
      }
      setMrXPosition({ ...playerPosition, x: playerPosition.x - 100 });
      return State.SUCCEEDED;
    },

    AttackPlayer: () => {
      if (gameOver) {
        return State.FAILED;
      }
      setPlayerHealth((health) => Math.max(0, health - 10));
      return State.SUCCEEDED;
    },

    RoamAround: () => {
      if (gameOver) {
        return State.FAILED; // Stop roaming if the game is over
      }
      const randomRoom =
        roomsArray[Math.floor(Math.random() * roomsArray.length)];
      setMrXPosition(randomRoom);
      console.log("Mr. X roamed to:", randomRoom.name);
      return State.SUCCEEDED;
    },
  };

  // Step 4: Create behavior tree
  const behaviourTree = new BehaviourTree(definition, agent);

  // Step 5: Step through the tree periodically
  useEffect(() => {
    if (gameOver) {
      console.log("Game over, stopping behavior tree.");
      return; // Stop the behavior tree if the game is over
    }

    const interval = setInterval(() => {
      behaviourTree.step();
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [gameOver]);

  // Detect when the game should end
  useEffect(() => {
    if (playerHealth === 0) {
      setGameOver(true);
      console.log("Game over. Player health reached 0.");
    }
  }, [playerHealth]);

  return (
    <Stage width={700} height={500}>
      <Layer>
        {/* Render Police Station Map */}
        <PoliceStationMap />

        {/* Player Character */}
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
          fill={playerPosition.name === mrXPosition.name ? "yellow" : "red"} // Mr. X turns yellow when he sees player
        />

        {/* Game Over Message */}
        {gameOver && (
          <Text
            x={200}
            y={200}
            text="Game Over"
            fontSize={50}
            fill="red"
            fontStyle="bold"
          />
        )}

        {/* Player Health Display */}
        {!gameOver && (
          <Text
            x={20} 
            y={20}
            text={`Health: ${playerHealth}`}
            fontSize={20}
            fill="green"
            fontStyle="bold"
          />
        )}
      </Layer>
    </Stage>
  );
};

export default MrX;
