const Alert = require('../models/Alert');
const ping = require('ping');
const axios = require('axios');

class DeviceMonitor {
  constructor() {
    this.devices = [
      { id: 'r6', ip: '192.168.100.8', name: 'Router R6' }
    ];

    this.services = [
      { deviceId: 'server1', protocol: 'http', ip: '192.168.1.10', port: 80 }
    ];

    this.activeProblems = new Map();
    this.problemExpirationTime = 30 * 60 * 1000; // 30 minutes
  }

  async startMonitoring() {
    console.log('Monitoring started...');
    await this.checkAllDevices();
    await this.checkAllServices();
  
    // Use recursive timeout with random intervals
    const scheduleNextCheck = async () => {
      const intervals = [10000, 15000, 30000]; // 10s, 15s, 30s
      const nextInterval = intervals[Math.floor(Math.random() * intervals.length)];
  
      setTimeout(async () => {
        await this.checkAllDevices();
        await this.checkAllServices();
        this.clearExpiredProblems();
  
        scheduleNextCheck(); // Schedule next one
      }, nextInterval);
    };
  
    scheduleNextCheck(); // Kick off the recursive timeout
  }
  

  async checkAllDevices() {
    for (const device of this.devices) {
      await this.checkDevice(device);
    }
  }

  async checkDevice(device) {
    try {
      const res = await ping.promise.probe(device.ip, {
        timeout: 5,
        extra: ['-c', '1']
      });

      const message = `${device.name} (${device.ip}) is offline`;
      const key = this._generateKey(device.id, 'connectivity', 'icmp', message);

      if (!res.alive) {
        const existingAlert = await Alert.findOne({
          deviceId: device.id,
          protocol: 'icmp',
          alertType: 'connectivity',
          message,
          resolved: false
        });

        if (!existingAlert) {
          await this._createAlert({
            alertType: 'connectivity',
            severity: 'critical',
            deviceId: device.id,
            deviceName: device.name,
            protocol: 'icmp',
            message,
            details: { ping: res.output }
          });
        }

        this.activeProblems.set(key, Date.now()); // Always refresh cache
      } else {
        await this._resolveAlert(device.id, 'icmp', message);
        this.activeProblems.delete(key);
      }
    } catch (error) {
      console.error(`Device check failed for ${device.name}:`, error);
    }
  }

  async checkAllServices() {
    for (const service of this.services) {
      switch (service.protocol) {
        case 'http':
          await this.checkHTTP(service);
          break;
        default:
          console.warn(`Unsupported protocol: ${service.protocol}`);
          break;
      }
    }
  }

  async checkHTTP(service) {
    const url = `http://${service.ip}:${service.port}`;
    const unreachableMsg = `HTTP service on ${service.ip}:${service.port} is unreachable`;
    const key = this._generateKey(service.deviceId, 'protocol', 'http', unreachableMsg);

    try {
      const response = await axios.get(url, { timeout: 5000 });

      if (response.status !== 200) {
        const msg = `HTTP service on ${service.ip}:${service.port} returned ${response.status}`;
        const statusKey = this._generateKey(service.deviceId, 'protocol', 'http', msg);

        const existing = await Alert.findOne({
          deviceId: service.deviceId,
          alertType: 'protocol',
          protocol: 'http',
          message: msg,
          resolved: false
        });

        if (!existing) {
          await this._createAlert({
            alertType: 'protocol',
            severity: 'major',
            deviceId: service.deviceId,
            protocol: 'http',
            message: msg,
            details: response.data
          });
        }

        this.activeProblems.set(statusKey, Date.now());
      } else {
        await this._resolveAlert(service.deviceId, 'http', unreachableMsg);
        this.activeProblems.delete(key);
      }
    } catch (error) {
      const exists = await Alert.findOne({
        deviceId: service.deviceId,
        protocol: 'http',
        alertType: 'protocol',
        message: unreachableMsg,
        resolved: false
      });

      if (!exists) {
        await this._createAlert({
          alertType: 'protocol',
          severity: 'critical',
          deviceId: service.deviceId,
          protocol: 'http',
          message: unreachableMsg,
          details: { error: error.message }
        });
      }

      this.activeProblems.set(key, Date.now());
    }
  }

  async _createAlert(alertData) {
    try {
      const alert = new Alert(alertData);
      await alert.save();
      console.log(`🚨 New Alert: ${alert.message}`);
    } catch (error) {
      console.error('❌ Error saving alert:', error);
    }
  }

  async _resolveAlert(deviceId, protocol, message) {
    try {
      const result = await Alert.findOneAndUpdate(
        { deviceId, protocol, message, resolved: false },
        { resolved: true },
        { new: true }
      );

      if (result) {
        console.log(`✅ Resolved alert: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error resolving alert:', error);
    }
  }

  _generateKey(deviceId, alertType, protocol, message) {
    return `${deviceId}-${alertType}-${protocol}-${message}`;
  }

  clearExpiredProblems() {
    const now = Date.now();
    this.activeProblems.forEach((timestamp, key) => {
      if (now - timestamp > this.problemExpirationTime) {
        this.activeProblems.delete(key);
        console.log(`❌ Expired problem removed: ${key}`);
      }
    });
  }
}

module.exports = DeviceMonitor;
