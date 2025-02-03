import { useEffect, useState } from "react";
import { Stage, Layer, Circle } from "react-konva";
import { State, BehaviourTree } from "mistreevous";

const MrX = () => {
	// Step 1: Set up a state to track Mr. X's position
	const [x, setX] = useState(400);
	const [y, setY] = useState(300);

	// Step 2: Set up the behavior tree definition using MDSL
	const definition = `root {
    sequence {
        action [MoveToSound]
        action [MoveToEnemy]
        action [RandomMovement]
    }
  }`;

	// Step 3: Create an agent that will perform actions
	const agent = {
		MoveToSound: () => {
			// Simulate moving to a sound
			const soundX = Math.random() * 200;
			const soundY = Math.random() * 150;
			setX(soundX);
			setY(soundY);
			console.log(`Moving to sound: (${soundX}, ${soundY})`);
			return State.SUCCEEDED;
		},

		MoveToEnemy: () => {
			// Simulate moving to an enemy
			const enemyX = Math.random() * 200;
			const enemyY = Math.random() * 150;
			setX(enemyX);
			setY(enemyY);
			console.log(`Moving to enemy: (${enemyX}, ${enemyY})`);
			return State.SUCCEEDED;
		},

		RandomMovement: () => {
			// Simulate random movement
			const randomX = Math.random() * 200;
			const randomY = Math.random() * 150;
			setX(randomX);
			setY(randomY);
			console.log(`Random movement: (${randomX}, ${randomY})`);
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
		<Stage width={800} height={600}>
			<Layer>
				{/* Step 6: Render Mr. X as a circle that moves based on the current x and y */}
				<Circle x={x} y={y} radius={20} fill="blue" />
			</Layer>
		</Stage>
	);
};

export default MrX;
