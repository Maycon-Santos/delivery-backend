const storesObservers = {};

export function getStoreObserverByID(id) {
  return storesObservers[id];
}

export function addStoreObserver(id) {
  const events = [];

  storesObservers[id] = {
    on(eventName, callback) {
      events.push({
        eventName,
        callback,
      });
    },
    emit(eventName, data) {
      events.forEach((event) => {
        if (event.eventName === eventName) {
          event.callback(data);
        }
      });
    },
  };

  return storesObservers[id];
}
