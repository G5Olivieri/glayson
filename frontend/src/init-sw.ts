const baseUrl = import.meta.env.VITE_BASE_API_URL;
const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const accessToken = localStorage.getItem("access_token");

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function requestNotificationPermission() {
  if (Notification.permission === "granted") {
    /* do our magic */
  } else if (Notification.permission === "denied") {
    /* the user has previously denied push. Can't reprompt. */
    alert("VC BLOQUEOU AS NOTIFICAÇÕES!");
  } else {
    /* show a prompt to the user */
    Notification.requestPermission((status) => {
      console.log("Notification permission status:", status);
    });
  }
}

async function subscribeUser(reg: ServiceWorkerRegistration) {
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  return reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });
}

function initPushService(reg: ServiceWorkerRegistration) {
  if (process.env.VITE_DISABLE_PUSH_SERVICE === "true") {
    return;
  }

  requestNotificationPermission();

  reg.pushManager.getSubscription().then((sub) => {
    if (sub === null) {
      // Update UI to ask user to register for Push
      console.log("Not subscribed to push service!");
      subscribeUser(reg).then((subs) => {
        fetch(`${baseUrl}/api/webpush/register`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            subscription: subs,
          }),
        });
      });
      return;
    }
    console.log("Subscribed to push service");
    fetch(`${baseUrl}/api/webpush/register`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        subscription: sub,
      }),
    });
  });
}

export function initSW() {
  if (!accessToken) {
    console.log("it is not logged");
    return;
  }

  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    console.log("browser doesn't support service service worker");
    return;
  }

  navigator.serviceWorker
    .getRegistration()
    .then((reg) => {
      if (!reg) {
        console.log("registration is undefined");
        return;
      }

      console.log("Service Worker Registered!");
      initPushService(reg);
    })
    .catch((err) => {
      console.log("Service Worker registration failed: ", err);
    });
}
