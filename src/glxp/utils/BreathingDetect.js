// source algorithm : https://github.com/Breathinglabs/JS-Breathing-Detection/blob/master/js/algorithm.js

import Emitter from 'event-emitter'

class BreathingDetect {
  constructor(audio) {
    this.audio = audio

    this.mobile = typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1

    // Params
    this.noiseLevelConst = this.mobile ? 5000 : 15000 //Constant we add to noise level for fast on event TOF
    this.noiseOffConst = this.mobile ? 2000 : 5000 //Constant we add to noise level for fast off event
    this.noiseOffSlowConst = this.mobile ? 2000 : 5000 //Constant we add to noise level for fast off event
    this.onFastConstant = -0.4 //Constant we multiply max variance to get minimum
    this.onFastNumOfVar = 4 //Minimum variable to check if they pass windowCondition_2
    this.offSlowNumOfPow = 10 //Minimum variable to check if they pass windowCondition_2
    this.offFastConst = 0.5 //Off fast event constant to multiply with onFastConstant
    this.functionRunning = false //Tells if blow detection is on if true we are exhaling
    this.ThrOnFast = 1 //Threshold for our fast on event
    this.ThrOffFast = 1 //Threshold for our fast off event
    this.ThrOffSlow = 1 //Threshold for our slow off event
    this.maxVariance = 0
    this.minVariance = 0
    this.pow = 0 //Sum of all frequency element data(b.frequencyBin) - power
    this.noiseLevel = -1 //Noise level (room)
    this.pwVariance = 0 //Our current variance
    this.varOffVar = 0
    this.frequencyBin = new Array() //Put all frequency element data in array
    this.countBlow = 0 //Detected blow count for determining noise level calculation time
    this.windowArray = new Array() //For variance storage FIFO for determining slow or fast event
    this.vcd = 0 //For b.b.windowArray array size
    this.windowArray_2 = new Array() //For variance storage when b.pow > b.ThrOnFast
    this.vcd_2 = 0 //For b.b.windowArray_2 array size
    this.mainCondition = false //If b.pow > b.ThrOnFast - if true it is
    this.offFastVar = 0
    this.offFastVarCount = 0
    this.pcd = 0 //Number of elements in arrays for slow events
    this.PowerWindow = new Array() //Array for b.pow to help us calculate variance b.pwVariance
    this.pw = 0

    this._emitter = {}
    Emitter(this._emitter)
    this.on = this._emitter.on.bind(this._emitter)
  }

  //Events that are triggered on on and off event
  fireOnEvent() {
    this._emitter.emit('start')
    this.functionRunning = true
  }

  fireOffEvent() {
    this._emitter.emit('stop')
  }

  resetMic() {}

  onAudioProcess(event) {
    this.pow = 0

    const frequencyArray = new Uint8Array(this.audio.micro.analyser.fftSize)
    this.audio.micro.analyser.getByteFrequencyData(frequencyArray)

    //put in all frequencyArray data
    for (var i = 0; i < frequencyArray.length; i++) {
      this.frequencyBin[i] = frequencyArray[i]
      //sum all data in array
      this.pow += this.frequencyBin[i]
    }

    // console.log(this.pow);

    //set noise level increase noise level and if current is > than saved then current is our new noise level(room)
    if (this.noiseLevel == -1) {
      //For very first input signal, just to set it on
      this.noiseLevel = this.pow
    } else {
      //Setting noise level on off event and first 30 on event signals
      if (this.pow < this.noiseLevel) {
        this.noiseLevel = this.pow
      } else if (this.pow > this.noiseLevel) {
        if (this.countBlow < 30) {
          this.noiseLevel = this.noiseLevel + 10 //noise level
        } else if (this.countBlow > 30) {
          this.noiseLevel = this.noiseLevel + 0 //noise level
        }
      }
    }

    //Setting all thresholds for our on events
    this.ThrOnFast = Math.round(this.noiseLevel + this.noiseLevelConst)
    this.ThrOffFast = Math.round(this.noiseLevel + this.noiseOffConst)
    this.ThrOffSlow = Math.round(this.noiseLevel + this.noiseOffSlowConst)

    //Calculating variances - putting each this.pow in array and the sub current and one past
    this.PowerWindow[this.pw] = this.pow
    if (this.pw > 0 && this.pw < 500) {
      this.pwVariance = Math.round(this.PowerWindow[this.pw] - this.PowerWindow[this.pw - 1])
    } else if (this.pw > 500) {
      this.pw = 0
      this.PowerWindow.length = 0
    }
    this.pw++

    //Check if function for when exhalation is detected (on event) is running
    if (this.functionRunning == false) {
      this.countBlow = 0
      // breathingEvents.offRunning();
      this.onEvent(this.pow, this.pwVariance)
    }

    //Check if function for when exhalation is not detected (off event) is running
    else if (this.functionRunning == true) {
      this.countBlow++
      // breathingEvents.onRunning();
      this.offEvent(this.pow, this.pwVariance)
    }
  }

  onEvent(getTotal, getVariance) {
    //FAST
    //calculate max and min variance and set b.mainCondition on true when done
    if (getTotal > this.ThrOnFast && this.mainCondition == false) {
      //when variance > 0 count max and set min variance
      if (getVariance > 0 && getVariance > this.maxVariance) {
        this.maxVariance = getVariance
        this.minVariance = Math.round(this.onFastConstant * this.maxVariance)
        this.varOffVar = this.minVariance * this.offFastConst
        //when variance < 0 get first neg variance and set this.mainCondition
      } else if (getVariance < 0 && getVariance < this.maxVariance) {
        this.mainCondition = true
      }
    }

    //when we get max and min variances we check if next 4(onFastNumOfVar) variances are bigger than this.minVariance.
    else if (getTotal > this.ThrOnFast && this.mainCondition == true) {
      this.windowArray[this.vcd] = getVariance
      if (this.vcd == this.onFastNumOfVar) {
        if (
          this.windowArray.every((value, index, ar) => {
            this.checkOn(value, index, ar)
          })
        ) {
          this.functionRunning = true
          this.fireOnEvent()
        } else {
          this.mainCondition = false
          this.vcd = 0
          this.windowArray.length = 0
          this.maxVariance = 0
          this.minVariance = 0
        }
      } else {
        this.vcd++
      }
    }

    //SLOW
    if (this.pcd < 35) {
      if (getTotal > this.ThrOnFast && getVariance > -3000) {
        this.pcd++
      } else {
        this.pcd = 0
      }
    } else {
      this.functionRunning = true

      this.fireOnEvent()
      this.pcd = 0
    }
  }

  offEvent(getOffTotal, getOffVariance) {
    //get min variable of the previous 20 variables
    if (this.offFastVarCount < 15) {
      if (getOffVariance < this.offFastVar) {
        this.offFastVar = getOffVariance
      }
      this.offFastVarCount++
    } else {
      this.offFastVarCount = 0
    }

    //FAST
    if (getOffTotal < this.ThrOffFast && this.offFastVar < this.varOffVar) {
      this.executeOffEv()
    }

    //SLOW
    //If the last 10 this.pow < this.ThrOnFast/2
    else if (getOffTotal < this.ThrOffFast && this.offFastVar > this.varOffVar) {
      this.windowArray_2[this.vcd_2] = getOffTotal
      if (this.vcd_2 == this.offSlowNumOfPow) {
        if (
          this.windowArray_2.every((value, index, ar) => {
            this.checkOff(value, index, ar)
          })
        ) {
          this.executeOffEv()
        } else {
        }
        this.windowArray_2.splice(0, 1)
      } else {
        this.vcd_2++
      }
    }
  }

  checkOff(value, index, ar) {
    if (value < this.ThrOffSlow) return true
    else return false
  }

  checkOn(value, index, ar) {
    if (value > this.minVariance && value < -1 * this.minVariance) return true
    else return false
  }

  executeOffEv() {
    this.vcd = 0
    this.vcd_2 = 0
    this.pw = 0
    this.pcd = 0
    this.maxVariance = 0
    this.minVariance = 0
    this.varOffVar = 0
    this.mainCondition = false
    this.windowArray.length = 0
    this.windowArray_2.length = 0
    this.offFastVar = 0
    this.offFastVarCount = 0
    this.functionRunning = false
    this.fireOffEvent()
  }
}

export default BreathingDetect
