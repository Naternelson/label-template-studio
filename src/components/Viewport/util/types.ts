export type Boundary =
	| number
	| {
			top?: number;
			left?: number;
			right?: number;
			bottom?: number;
			x?: number;
			y?: number;
	  };

export type Center = boolean | { x?: boolean; y?: boolean };

export type UseDraggableParams = {
	containerId: string;
	contentId: string;
	disabled?: boolean;
	boundary?: Boundary;
	center?: Center;
};
