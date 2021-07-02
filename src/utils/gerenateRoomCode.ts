export function generateRoomCode(roomsCode?: Array<number>): number {
	const max = 100000;
	const min = 999999;

	let roomCode = Math.floor(Math.random() * (max - min + 1)) + min;

	if (!roomsCode) {
		return roomCode;
	}

	do {
		roomCode = Math.floor(Math.random() * (max - min + 1)) + min;
	}
	while (roomsCode.includes(roomCode))

	return roomCode;
}