interface NetworkInformation extends EventTarget {
  readonly saveData: boolean;
}

interface Navigator {
  readonly connection?: NetworkInformation;
}

interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): DOMHighResTimeStamp;
}

interface Window {
  cancelIdleCallback(handle: number): void;
  requestIdleCallback(callback: (deadline: IdleDeadline) => void): number;
}
