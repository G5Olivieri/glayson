/* eslint-disable import/no-extraneous-dependencies */
/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";

export type {};

declare let self: ServiceWorkerGlobalScope;

// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);
self.skipWaiting();
clientsClaim();

self.addEventListener("push", (event) => {
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
  const payload: { title: string; body: string | undefined } = event.data
    ? event.data.json()
    : { title: "Show notification" };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
    })
  );
});
