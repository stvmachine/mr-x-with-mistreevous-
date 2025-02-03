import { Rect, Text, Line } from "react-konva";

type Room = { x: number; y: number; name: string };

type Rooms = {
  mainHall: Room;
  eastHall: Room;
  westHall: Room;
  interrogationRoom: Room;
  recordsRoom: Room;
  officeRoom: Room;
};

const rooms: Rooms = {
  mainHall: { x: 300, y: 200, name: "Main Hall" },
  eastHall: { x: 500, y: 200, name: "East Hall" },
  westHall: { x: 100, y: 200, name: "West Hall" },
  interrogationRoom: { x: 150, y: 400, name: "Interrogation Room" },
  recordsRoom: { x: 450, y: 400, name: "Records Room" },
  officeRoom: { x: 500, y: 50, name: "Office Room" },
};

const roomsArray: Room[] = Object.values(rooms);

const PoliceStationMap = () => {
  return (
    <>
      {/* Rooms */}
      {Object.entries(rooms).map(([name, pos], i) => (
        <Rect
          key={i}
          x={pos.x}
          y={pos.y}
          width={100}
          height={100}
          fill="gray"
          stroke="black"
          strokeWidth={2}
        />
      ))}

      {/* Room Names */}
      {Object.entries(rooms).map(([name, pos], i) => (
        <Text
          key={i}
          x={pos.x + 20}
          y={pos.y + 40}
          text={name}
          fill="white"
          fontSize={12}
        />
      ))}

      {/* Doors */}
      <Line points={[200, 250, 300, 250]} stroke="white" strokeWidth={5} />
      <Line points={[400, 250, 500, 250]} stroke="white" strokeWidth={5} />
      <Line points={[250, 300, 250, 400]} stroke="white" strokeWidth={5} />
      <Line points={[450, 300, 450, 400]} stroke="white" strokeWidth={5} />
    </>
  );
};

export { PoliceStationMap, rooms, roomsArray };
