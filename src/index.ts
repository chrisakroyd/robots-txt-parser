import Robots from './robots';
import { RobotOptions } from './types';

export = (opts?: Partial<RobotOptions>) => new Robots(opts);
