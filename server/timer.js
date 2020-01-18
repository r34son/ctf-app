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
    if (timer) {
      this.time = timer.time;
      this.timer = timer;
      timer.state === "running" && setIntervals();
    }
  });

  const setIntervals = () => {
    this.interval = setInterval(this.onTick, this.second);
    this.updateInterval = setInterval(
      async () =>
        await TimerModel.updateOne(
          { _id: this.timer._id },
          {
            $set: {
              time: this.time
            }
          }
        ),
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
    if (time <= 0) {
      return;
    }
    if (this.interval) {
      this.stop();
    }
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
    clearIntervals();
    await TimerModel.updateOne(
      { _id: this.timer._id },
      {
        $set: {
          time: this.time,
          state: 'paused'
        }
      }
    );
  };

  this.resume = async () => {
    setIntervals();
    await TimerModel.updateOne(
      { _id: this.timer._id },
      {
        $set: {
          time: this.time,
          state: 'running'
        }
      }
    );
  };

  this.stop = async () => {
    clearIntervals();
    this.time = 0;
    await TimerModel.updateOne(
      { _id: this.timer._id },
      {
        $set: {
          time: 0,
          state: 'stopped'
        }
      }
    );
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
