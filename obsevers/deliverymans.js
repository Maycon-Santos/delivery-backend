const deliverymanObservers = {};

export function getDeliverymanObserverByID(id) {
  return deliverymanObservers[id];
}

export function getDeliverymansOnline() {
  return Object.keys(deliverymanObservers);
}

export function addDeliverymanObserver(id) {
  const events = [];

  deliverymanObservers[id] = {
    events,
    requestOrderID: null,
    orderID: null,
    on(eventName, callback) {
      events.push({
        eventName,
        callback,
      });
    },
    remove(callback) {
      events.forEach((event, index) => {
        if (event.callback === callback) {
          delete events[index];
        }
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

  return deliverymanObservers[id];
}

// on - Capaz de receber um evento e invocar um callback a partir dele
// emit - Capaz de emitir o evento

// addOrderObserver.emit("statusChange", data)

// addOrderObserver.on("statusChange", (data) => {
//   // ...
// })
