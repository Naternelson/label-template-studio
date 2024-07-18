import { createContext, useContext } from "react";
import { GamepadContextType } from "./util";

export const GamepadContext = createContext<GamepadContextType | undefined>(undefined);
export const useGamepad = () => {
	const context = useContext(GamepadContext);
	if (!context) {
		throw new Error('useGamepad must be used within a GamepadProvider');
	}
	return context;
}