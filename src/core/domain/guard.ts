type GuardArgument = { argument: unknown; argumentName: string };

export class Guard {
  static againstNullOrUndefined({
    argument,
    argumentName,
  }: GuardArgument): void {
    if (argument === null || argument === undefined) {
      throw new Error(`${argumentName} is null or undefined`);
    }
  }

  static againstEmptyString({ argument, argumentName }: GuardArgument): void {
    if (typeof argument !== 'string') {
      throw new Error(`${argumentName} is not a string`);
    }
    if (typeof argument === 'string' && argument.trim().length === 0) {
      throw new Error(`${argumentName} is an empty string`);
    }
  }

  static inRange({
    argument,
    argumentName,
    min,
    max,
  }: {
    argument: number;
    argumentName: string;
    min: number;
    max: number;
  }): void {
    if (typeof argument !== 'number') {
      throw new Error(`${argumentName} is not a number`);
    }
    if (argument < min || argument > max) {
      throw new Error(`${argumentName} is not within range ${min} to ${max}`);
    }
  }
}
