define(['appManager', 'fetchRoutine', 'cluster'], function(AppManager, FetchRoutine, Cluster) {
    var scheduleTimer;
    var timeoutTimer;
    var locked = false;
    var request;
    var updatedRequest = true;

    /**
      * Start the scheduler.
      */
    start = function() {
        var _this = this;
        this.scheduleTimer = setInterval(function() {
            _this.schedule();
        }, AppManager.SCHEDULER_TIMEOUT);
    };

    /**
      * If there is a valid request, nothing is being fetched right now and the request cooldown is over,
      * the request is executed and a new cooldown applied.
      */
    schedule = function() {
        console.log(this.request);
        if ((this.request != undefined) 
            && !FetchRoutine.isRunning()
            && !this.locked) {

            this.timeout();
            this.fetch();

        }
    }

    /**
      * Start the scheduler cooldown.
      */
    timeout = function() {
        var time = AppManager.SCHEDULER_COOLDOWN_DEFAULT;
        if (this.request["fetchCooldown"] != undefined) {
            time = this.request["fetchCooldown"];
        }

        this.locked = true;
        var _this = this;
        this.timeoutTimer = setTimeout(function() {
            if (!_this.updatedRequest) {
                if (!AppManager.APP_STATE.getAutomaticRefreshEnabled()) {
                    _this.request = undefined;
                }
            } 
            _this.locked = false;
        }, time);
    }

    /**
      * Apply the current request.
      */
    fetch = function() {
        FetchRoutine.run(
            this.request["liveMode"],
            this.request["gridID"],
            this.request["clusterArray"],
            this.request["selectedSensortype"],
            this.request["selectedTimeframe"]
        );
        this.updatedRequest = false;
    }

    /**
      * Set a new request.
      */
    setRequest = function(liveMode, fetchCooldown, gridID, clusterArray, selectedSensortype, selectedTimeframe) {
        this.request = {
            "liveMode": liveMode,
            "fetchCooldown": fetchCooldown,
            "gridID": gridID,
            "clusterArray": clusterArray,
            "selectedSensortype": selectedSensortype,
            "selectedTimeframe": selectedTimeframe
        };
        this.updatedRequest = true;
    };

    return {
        start,
        schedule,
        timeout,
        fetch,
        setRequest
    };
})