import { useEffect, useState } from "react";
import { Stage, Circle, Layer, Text, Rect } from "react-konva";
import { State, BehaviourTree } from "mistreevous";
import { PoliceStationMap, Room, rooms, roomsArray } from "./PoliceStationMap";

const MrX = () => {
  const [mrXPosition, setMrXPosition] = useState<Room>(rooms.mainHall);
  const [playerPosition, setPlayerPosition] = useState({
    ...rooms.officeRoom,
    x: rooms.officeRoom.x + 100,
    y: rooms.officeRoom.y,
  });
  const [playerHealth, setPlayerHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);

  // Behavior Tree Definition
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

  // AI Behaviors
  const agent = {
    IsSoundDetected: () => Math.random() > 0.25, // Increased detection probability

    MoveToSound: () => {
      if (gameOver) return State.FAILED;
      setMrXPosition({ ...playerPosition, x: playerPosition.x - 100 });
      return State.SUCCEEDED;
    },

    AttackPlayer: () => {
      if (gameOver) return State.FAILED;
      setPlayerHealth((health) => Math.max(0, health - 20));
      return State.SUCCEEDED;
    },

    RoamAround: () => {
      if (gameOver) return State.FAILED;
      const randomRoom = roomsArray[Math.floor(Math.random() * roomsArray.length)];
      setMrXPosition(randomRoom);
      return State.SUCCEEDED;
    },
  };

  const behaviourTree = new BehaviourTree(definition, agent);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      behaviourTree.step();
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    if (playerHealth <= 0) {
      setGameOver(true);
    }
  }, [playerHealth]);

  // Handle Player Movement
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver) return;

      const step = 20;
      setPlayerPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (event.key === "ArrowUp") newY -= step;
        if (event.key === "ArrowDown") newY += step;
        if (event.key === "ArrowLeft") newX -= step;
        if (event.key === "ArrowRight") newX += step;

        return { ...prev, x: newX, y: newY };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  return (
    <Stage width={700} height={500}>
      <Layer>
        <PoliceStationMap />

        {/* Player */}
        <Circle
          x={playerPosition.x}
          y={playerPosition.y}
          radius={15}
          fill="blue"
        />

        {/* Mr. X */}
        <Circle
          x={mrXPosition.x}
          y={mrXPosition.y}
          radius={20}
          fill={playerPosition.name === mrXPosition.name ? "yellow" : "red"}
        />

        {/* Game Over Message */}
        {gameOver && (
          <Text x={200} y={200} text="Game Over" fontSize={50} fill="red" />
        )}

        {/* Player Health Bar */}
        {!gameOver && (
          <>
            <Text x={20} y={20} text="Health" fontSize={18} fill="white" />
            <Rect x={80} y={20} width={playerHealth} height={10} fill={playerHealth > 50 ? "green" : playerHealth > 20 ? "yellow" : "red"} />
          </>
        )}
      </Layer>
    </Stage>
  );
};

export default MrX;