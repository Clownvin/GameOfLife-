import {interval, lastValueFrom, take, tap} from 'rxjs';
import sleep from '../sleep';
import debounce from './debounce';

describe('debounce', () => {
  it('should prevent rapid function invocation', async () => {
    let bool = false;
    const debounced = debounce(() => (bool = true), 10);
    await lastValueFrom(
      interval(8).pipe(
        tap(() => {
          debounced();
        }),
        take(5)
      )
    );
    expect(bool).toStrictEqual(false);
    await sleep(10);
    expect(bool).toStrictEqual(true);
  });
});
