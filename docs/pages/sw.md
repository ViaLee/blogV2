## sw
#### sw.js

```js
const OFFLINE_CACHE = "sw_fetchCache"; //缓存空间key

// self.addEventListener('install', function (event) {

// 	// Activate right away
// 	self.skipWaiting();
//   console.log('立刻生效')
// })
// 动态资源

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
  console.log("claim");
});

self.addEventListener("fetch", function (e) {
  if (`${e.request.url}`.includes("/msurvey/paperUnion/paperList")) {
    e.respondWith(
      fetch(e.request.url, {
        headers: e.request.headers,
      })
        .then((res) => {
          console.log("sw 发起 fetch 成功");
          caches.open(OFFLINE_CACHE).then(function (cache) {
            cache.put(e.request.url, res.clone());
          });
          return Promise.resolve(res.clone());
        })
        .catch(async function (err) {
          console.error("原请求失败 取缓存", err);
          const cache = await caches.open(OFFLINE_CACHE);
          const resFromCache = await cache.match(e.request.url);
          console.error("cache中匹配", resFromCache.clone().json());
          return Promise.resolve(resFromCache.clone());
        })
    );
  }
});
```

#### pwa.js
```js
export const register = () => {
    const isHttps = document.location.protocol === 'https:';
    const serviceWorker = navigator.serviceWorker;

    if (!isHttps) {
        //  非https 不生效
        // return;
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            serviceWorker
                .register('/sw.js') //这块注意不要改动
                .then((reg) => {
                    if (reg.installing) {
                        console.log('Service worker installing');
                    } else if (reg.waiting) {
                        console.log('Service worker installed');
                    } else if (reg.active) {
                        console.log('Service worker active');
                    }
                    console.log('ServiceWorker register success', reg);
                })
                .catch((registrationError) => {
                    console.log('ServiceWorker register failed: ', registrationError);
                });
        });
    }
};

export const cleanCache = (opt: { all?: boolean }) => {
    const { all = true } = opt;
    if (all) {
        // remove all caches
        if (window.caches) {
            caches.keys().then((keys) => {
                keys.forEach((key) => {
                    caches.delete(key).then(() => {
                        console.log('all caches cleaned');
                    });
                });
            });
        }
    } else {
        // remove key caches
    }
};

export const unRegister = () => {
    // TODO: 注销对应的sw
    const serviceWorker = navigator.serviceWorker;
    if (serviceWorker.getRegistrations) {
        console.log('清除多个');
        serviceWorker.getRegistrations().then(function (sws) {
            console.log(sws, 'swsswssws');
            sws.forEach(function (sw) {
                sw.unregister();
                console.log('sw unregister 1');
            });
        });
    } else if (serviceWorker.getRegistration) {
        console.log('清除');
        serviceWorker.getRegistration().then(function (sw) {
            sw?.unregister();
            console.log('sw unregister 2');
        });
    } else {
        console.log('无');
    }
};


```


#### global.js
```js
if (pwa) {
    register();
} else {
    unRegister();
    cleanCache({});
}
```