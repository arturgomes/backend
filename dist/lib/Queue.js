"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _beeQueue = _interopRequireDefault(require("bee-queue"));

var _CancellationMail = _interopRequireDefault(require("../app/jobs/CancellationMail"));

var _redis = _interopRequireDefault(require("../config/redis"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jobs = [_CancellationMail.default];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({
      key,
      handle
    }) => {
      this.queues[key] = {
        bee: new _beeQueue.default(key, {
          redis: _redis.default
        }),
        handle
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const {
        bee,
        handle
      } = this.queues[job.key];
      bee.on('fail', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`queue ${job.queue.name}: FAILED`, err);
  }

}

var _default = new Queue();

exports.default = _default;