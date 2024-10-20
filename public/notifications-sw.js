var a=self;a.addEventListener("push",i=>{let t=i.data?.json();i.waitUntil(a.registration.showNotification(t.title,{icon:t.icon,body:t.body,image:t.imageUrl,data:t.data}))});a.addEventListener("notificationclick",function(i){i.notification.close(),i.waitUntil(clients.openWindow(i.notification?.data?.url||i?.data?.url))});
//# sourceMappingURL=notifications-sw.js.map
