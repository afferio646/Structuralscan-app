// sw.js

// Listener for the install event - caches necessary assets.
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    // event.waitUntil(
    //     caches.open(CACHE_NAME).then((cache) => {
    //         console.log('Service Worker: Caching app shell');
    //         return cache.addAll(assetsToCache);
    //     })
    // );
    self.skipWaiting(); // Activate worker immediately
});

// Listener for the activate event - cleans up old caches.
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(clients.claim()); // Become available to all pages
});

// Listener for push events from the server.
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push Received.');

    // Default data for the notification
    const notificationData = {
        title: 'New Notification',
        body: 'You have a new message from StructureScan AI.',
        icon: '/icon-192x112.png'
    };

    // Attempt to parse data from the push event
    let pushData;
    try {
        pushData = event.data.json();
    } catch (e) {
        pushData = notificationData;
    }

    const title = pushData.title || notificationData.title;
    const options = {
        body: pushData.body || notificationData.body,
        icon: pushData.icon || notificationData.icon,
        badge: '/icon-96x96.png'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Optional: Listener for notification click events.
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked.');
    event.notification.close();

    // Focus or open a window when the notification is clicked
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
