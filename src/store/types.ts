import { PayloadAction } from "@reduxjs/toolkit";

export type DeepPartialArray<T> = Array<DeepPartial<T>>;
export type DeepPartialObject<T> = { [K in keyof T]?: DeepPartial<T[K]> };

export type DeepPartial<T> = T extends any[] ? DeepPartialArray<T[number]> : T extends object ? DeepPartialObject<T> : T;

type Groupable<T> = T & { groupId?: string };
export type GroupableBase<T> = {value: T, groupId?: string};
export type PayloadGroupableAction<T> = PayloadAction<Groupable<DeepPartial<T>>>;

export type Lockable<T> = {
    value: T;
    locked: boolean;
}

export type LockableState<T> = {
    [K in keyof T]: Lockable<T[K]>;
}

export type Dimensions = {
    width: number;
    height: number;
}
export type LockableDimensions = LockableState<Dimensions>;

export type Position = {
    x: number;
    y: number;
    rotation: number;
}

export type LockablePosition = LockableState<Position>;

export type Background = {
    printBackground: boolean;
    color: string;
    imageUrl?: string;
    roundness: number;
}

export type LockableBackground = LockableState<Background>;

export type StateWithoutHistory<T> = Omit<T, 'past' | 'future'>;

export type StateWithHistory<T> = {
    past: StateWithoutHistory<T>[];
    future: StateWithoutHistory<T>[];
} & StateWithoutHistory<T>;