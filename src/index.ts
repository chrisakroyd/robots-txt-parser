import Robots from './robots';
import { RobotOptions } from './types/options';

export = (opts: RobotOptions) => new Robots(opts);
