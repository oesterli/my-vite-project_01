let logCounter = 0;

const logMessages: string[] = [];

export function loggeText(text: string): void {
  logCounter++;

  const message = `[${logCounter}] ${text}`;

  console.log(message);

  logMessages.push(message);
}

export function getLogMessages(): string[] {
  return [...logMessages];
}
