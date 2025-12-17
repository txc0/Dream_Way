"use client";

import { useState, useCallback } from "react";
import { usePusher } from "../app/hooks/usePusher";

export default function Notifications() {
  const [notifications, setNotifications] = useState<string[]>([]);

  const handleNoticeEvent = useCallback((data: any, eventType: string) => {
    let action = "";
    if (eventType === "new-notice") action = "added";
    if (eventType === "update-notice") action = "updated";
    if (eventType === "delete-notice") action = "deleted";

    const message = `${data.title} was ${action}`;
    setNotifications((prev) => [message, ...prev]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((msg) => msg !== message));
    }, 5000);
  }, []);

  usePusher("notices", "new-notice", (data) => handleNoticeEvent(data, "new-notice"));
  usePusher("notices", "update-notice", (data) => handleNoticeEvent(data, "update-notice"));
  usePusher("notices", "delete-notice", (data) => handleNoticeEvent(data, "delete-notice"));

  return (
    <div className="fixed top-4 right-4 w-80 space-y-2 z-50">
      {notifications.map((msg, i) => (
        <div key={i} className="bg-blue-100 text-blue-800 p-2 rounded shadow">
          {msg}
        </div>
      ))}
    </div>
  );
}
