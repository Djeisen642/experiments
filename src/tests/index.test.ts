import { expect } from '@jest/globals';
import { randomUUID } from 'crypto';

import { data } from './sampledata';
import { HelloThing } from '@/index';

describe('example', () => {
  it('should say hello', () => {
    console.log = jest.fn().mockImplementation();
    const example = new HelloThing();
    example.saysHello();

    expect(console.log).toHaveBeenCalledWith('Hello!');
  });

  it('should say the thing', () => {
    console.log = jest.fn().mockImplementation();
    const example = new HelloThing();
    example.saysThing(data.thingToSay);

    expect(console.log).toHaveBeenCalledWith(data.thingToSay);
  });

  it('should say the uuid', () => {
    console.log = jest.fn().mockImplementation();
    const uuid = randomUUID();
    const example = new HelloThing();
    example.saysThing(uuid);

    expect(console.log).toHaveBeenCalledWith(uuid);
  });
});
