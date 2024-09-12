// Filename: index.js
// Combined code from all files

import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, Alert } from 'react-native';

const CELL_SIZE = 20;
const BOARD_SIZE = 15;
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

const getRandomInt = (max) => Math.floor(Math.random() * max);

const SnakeGame = () => {
    const [snake, setSnake] = useState([
        { x: 2, y: 2 },
        { x: 2, y: 1 },
        { x: 2, y: 0 },
    ]);
    const [food, setFood] = useState({ x: getRandomInt(BOARD_SIZE), y: getRandomInt(BOARD_SIZE) });
    const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
    const [isGameRunning, setIsGameRunning] = useState(false);

    const moveSnake = () => {
        const newSnake = [...snake];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };
        newSnake.unshift(head);
        newSnake.pop();

        if (head.x === food.x && head.y === food.y) {
            newSnake.push({});
            setFood({ x: getRandomInt(BOARD_SIZE), y: getRandomInt(BOARD_SIZE) });
        }

        if (
            head.x < 0 ||
            head.x >= BOARD_SIZE ||
            head.y < 0 ||
            head.y >= BOARD_SIZE ||
            newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            setIsGameRunning(false);
            Alert.alert('Game Over', 'You lost!');
        } else {
            setSnake(newSnake);
        }
    };

    const moveSnakeRef = useRef(moveSnake);
    moveSnakeRef.current = moveSnake;

    useEffect(() => {
        if (isGameRunning) {
            const intervalId = setInterval(() => moveSnakeRef.current(), 200);
            return () => clearInterval(intervalId);
        }
    }, [isGameRunning]);

    const handleSwipe = (newDirection) => {
        setDirection(newDirection);
    };

    return (
        <View style={styles.container}>
            <View style={styles.board}>
                {snake.map((segment, index) => (
                    <View
                        key={index}
                        style={[
                            styles.cell,
                            { left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE },
                        ]}
                    />
                ))}
                <View
                    style={[
                        styles.cell,
                        styles.food,
                        { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE },
                    ]}
                />
            </View>
            <View style={styles.controls}>
                <Button title="Up" onPress={() => handleSwipe(DIRECTIONS.UP)} />
                <View style={styles.controlRow}>
                    <Button title="Left" onPress={() => handleSwipe(DIRECTIONS.LEFT)} />
                    <Button title="Right" onPress={() => handleSwipe(DIRECTIONS.RIGHT)} />
                </View>
                <Button title="Down" onPress={() => handleSwipe(DIRECTIONS.DOWN)} />
            </View>
            {!isGameRunning && <Button title="Start Game" onPress={() => setIsGameRunning(true)} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    board: {
        width: CELL_SIZE * BOARD_SIZE,
        height: CELL_SIZE * BOARD_SIZE,
        backgroundColor: 'lightgray',
        position: 'relative',
        overflow: 'hidden',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
        position: 'absolute',
    },
    food: {
        backgroundColor: 'red',
    },
    controls: {
        marginTop: 20,
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
    },
    appContainer: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default function App() {
    return (
        <SafeAreaView style={styles.appContainer}>
            <Text style={styles.title}>Snake Game</Text>
            <SnakeGame />
        </SafeAreaView>
    );
}