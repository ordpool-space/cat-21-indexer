import { Logger } from '@nestjs/common';

import { toJson } from '../../to-json';
import { delay } from './delay';

/**
 * Retries a given function a specified number of times with a delay between retries.
 *
 * @param action - A function that returns a promise, representing the action to retry.
 * @param maxRetries - The maximum number of retries. Default 3
 * @param retryDelay - The delay in milliseconds between retries. Default 500ms
 * @returns A promise that resolves to the result of the action function.
 * @throws Throws an error if the action fails after the maximum number of retries.
 */
export async function retry<T>(action: () => Promise<T>, maxRetries = 3, retryDelay = 500): Promise<T> {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {

      // Wait before retrying, if it's not the first attempt
      if (attempts > 0) {
        await delay(retryDelay);
      }

      return await action();

    } catch (error) {
      attempts++;
      Logger.warn(`** Attempt #${attempts} to call ${action} failed! ** ${ toJson(error) }`, 'retry');
    }
  }

  // Throw an error after all retries have been exhausted
  throw new Error('** Action failed after maximum retries. Giving up! **');
}
