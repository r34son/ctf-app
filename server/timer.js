const { Timer: TimerModel } = require('./models');

/* Timer states:
 *   -running
 *   -paused
 *   -stopped
 */

const Timer = function(onTick) {
  this.minute = 60000;
  this.second = 1000;
  this.time = undefined;
  this.interval = undefined;
  this.updateInterval = undefined;
  this.timer = undefined;

  TimerModel.findOne().then(timer => {
    switch (timer.state) {
      case 'running':
        this.time = timer.time;
        this.timer = timer;
        setIntervals();
        break;
      case 'paused':
        this.time = timer.time;
        this.timer = timer;
        onTick(timer.time);
        break;
      default:
        break;
    }
  });

  const setIntervals = () => {
    this.interval = setInterval(this.onTick, this.second);
    this.updateInterval = setInterval(
      async () =>
        await TimerModel.updateOne(this.timer, {
          $set: {
            time: this.time
          }
        }),
      this.minute
    );
  };

  const clearIntervals = () => {
    clearInterval(this.interval);
    clearInterval(this.updateInterval);
    this.interval = undefined;
    this.updateInterval = undefined;
  };

  this.start = async time => {
    // if (this.interval) {
    //   return;
    // }
    if (this.interval) {
      this.stop();
    }
    console.log('Starting Timer!', time);
    this.time = time;
    await TimerModel.deleteMany();
    this.timer = await TimerModel.create({
      duration: time,
      time,
      state: 'running'
    });
    setIntervals();
  };

  this.pause = async () => {
    console.log('Pausing Timer!', this.time);
    clearIntervals();
    await TimerModel.updateOne(this.timer, {
      $set: {
        time: this.time,
        state: 'paused'
      }
    });
  };

  this.resume = () => {
    console.log('Resuming Timer!', this.time);
    setIntervals();
  };

  this.stop = async () => {
    console.log('Stopping Timer!');
    clearIntervals();
    this.time = 0;
    await TimerModel.updateOne(this.timer, {
      $set: {
        time: 0,
        state: 'stopped'
      }
    });
    onTick(0);
  };

  this.onTick = () => {
    this.time -= this.second;
    onTick(this.time);
    if (this.time === 0) {
      this.stop();
    }
  };
};

module.exports = Timer;
