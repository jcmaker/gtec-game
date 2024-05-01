"use client";
import { useEffect, useState } from "react";
import { useInterval } from "./useInterval";
import { randomShape } from "./ShapeFactory";

export const ROW_COUNT = 20;
export const COLUMN_COUNT = 10;

function copyScene(scene) {
  return scene.map((row) => row.slice());
}

function mergeIntoStage(stage, shape, position) {
  let res = stage;

  shape.shape.forEach((point) => {
    const x = point.x + position.x;
    const y = point.y + position.y;

    if (x < 0 || y < 0 || x >= COLUMN_COUNT || y >= ROW_COUNT) {
      return;
    }

    res = updateStage(res, x, y, 1);
  });

  return res;
}

function updateStage(stage, x, y, value) {
  if (stage[y][x] === value) {
    return stage;
  }
  const res = stage.slice();
  res[y] = stage[y].slice();
  res[y][x] = value;
  return res;
}

function createEmptyScene() {
  return Array.from(Array(ROW_COUNT), () => Array(COLUMN_COUNT).fill(0));
}

export function useBoard() {
  const [scene, setScene] = useState(() => createEmptyScene());
  const [shape, setShape] = useState(() => randomShape());
  const [position, setPosition] = useState({
    x: Math.floor(COLUMN_COUNT / 2) - 1, // Centered on the x-axis
    y: 0, // At the top of the board on the y-axis
  });
  const [display, setDisplay] = useState(() =>
    mergeIntoStage(scene, shape, position)
  );
  const [score, setScore] = useState(0);

  const [level, setLevel] = useState(0); // New state for the level
  const [lineCount, setLineCount] = useState(0); // New state for the total line count

  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(updateDisplay, [scene, shape, position]);
  useEffect(removeFullLines, [scene, level]);
  // useInterval(tick, 600);
  useInterval(tick, calculateInterval(level));

  function updateDisplay() {
    const newDisplay = mergeIntoStage(scene, shape, position);
    setDisplay(newDisplay);
  }
  function calculateInterval(level) {
    // 레벨 0과 1에서는 간격을 600ms로 유지하고, 레벨 2부터 감소 시작
    if (level <= 1) {
      return 600; // 레벨 0과 1에서는 기존의 속도를 유지
    } else {
      return Math.max(100, 600 - (level - 1) * 50); // 레벨 2부터 간격이 감소
    }
  }

  function tick() {
    if (!movePosition(0, 1)) {
      placeShape();
    }
  }

  function placeShape() {
    const newScene = mergeIntoStage(scene, shape, position);
    const nextShape = randomShape();

    // Check if the new shape can be placed at the starting position without collision
    const canPlaceNewShape = validPosition(
      {
        x: Math.floor(COLUMN_COUNT / 2) - Math.floor(nextShape.width / 2),
        y: 0,
      },
      nextShape,
      newScene
    );

    if (!canPlaceNewShape) {
      // Game over condition met
      setIsGameOver(true);
      // Here you would typically handle the game over logic, such as stopping the game,
      // displaying a game over screen, or resetting the game state.
    } else {
      // If the game is not over, update the state with the new scene and shape
      setScene(newScene);
      setShape(nextShape);
      setPosition({
        x: Math.floor(COLUMN_COUNT / 2) - Math.floor(nextShape.width / 2),
        y: 0,
      });
    }
  }
  function rotateShape() {
    const tX = Math.floor(shape.width / 2);
    const tY = Math.floor(shape.height / 2);

    const newPoints = shape.shape.map((point) => {
      let { x, y } = point;

      x -= tX;
      y -= tY;

      // cos 90 = 0, sin 90 = 1
      // x = x cos 90 - y sin 90 = -y
      // y = x sin 90 + y cos 90 = x
      let rX = -y;
      let rY = x;

      rX += tX;
      rY += tY;

      return { x: rX, y: rY };
    });
    const newShape = {
      shape: newPoints,
      width: shape.width,
      height: shape.height,
    };

    if (validPosition(position, newShape)) {
      setShape(newShape);
    }
  }

  function removeFullLines() {
    const newScene = copyScene(scene);
    let linesRemoved = 0;

    for (let y = ROW_COUNT - 1; y >= 0; y--) {
      if (newScene[y].every((x) => x !== 0)) {
        newScene.splice(y, 1);
        newScene.unshift(Array(COLUMN_COUNT).fill(0));
        y++; // Increment y since we just removed a line and everything moved down
        linesRemoved++;
      }
    }

    if (linesRemoved > 0) {
      // Calculate the score based on the original Nintendo scoring system
      const lineScores = { 1: 40, 2: 100, 3: 300, 4: 1200 };
      const scoreToAdd = (lineScores[linesRemoved] || 0) * (level + 1);
      setScore((prev) => prev + scoreToAdd);

      // Update the total line count and possibly increment the level
      setLineCount((prev) => {
        const newTotal = prev + linesRemoved;
        // Calculate new level as an integer only if a full set of 10 lines are cleared
        const newLevel = Math.floor(newTotal / 10);
        if (newLevel > level) {
          setLevel(newLevel); // Set level as a whole number
        }
        return newTotal;
      });

      // Set the new scene
      setScene(newScene);
    }
  }

  function onKeyDown(event) {
    switch (event.key) {
      case "ArrowRight":
        movePosition(1, 0);
        event.preventDefault();
        break;
      case "ArrowLeft":
        movePosition(-1, 0);
        event.preventDefault();
        break;
      case "ArrowDown":
        movePosition(0, 1);
        event.preventDefault();
        break;
      case "ArrowUp":
        rotateShape();
        event.preventDefault();
        break;
      case " ":
        // movePosition(0, 10);
        hardDrop();
        event.preventDefault();
        break;
      case "Shift":
        hardDrop();
        event.preventDefault();
        break;

      default:
        break;
    }
  }

  function hardDrop() {
    let dropDistance = 0;
    while (
      validPosition({ x: position.x, y: position.y + dropDistance + 1 }, shape)
    ) {
      dropDistance++;
    }
    movePosition(0, dropDistance);
  }

  function movePosition(x, y) {
    const res = { x: x + position.x, y: y + position.y };

    if (!validPosition(res, shape)) {
      return false;
    }

    setPosition(res);

    return true;
  }

  function validPosition(position, shape) {
    return shape.shape.every((point) => {
      const tX = point.x + position.x;
      const tY = point.y + position.y;

      if (tX < 0 || tX >= COLUMN_COUNT) {
        return false;
      }

      if (tY < 0 || tY >= ROW_COUNT) {
        return false;
      }

      if (scene[tY][tX] !== 0) {
        return false;
      }

      return true;
    });
  }

  return [
    display,
    score,
    onKeyDown,
    level,
    lineCount,
    isGameOver,
    setIsGameOver,
  ];
}
