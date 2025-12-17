"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";

export const usePusher = (
  channelName: string,
  eventName: string,
  callback: (data: any) => void
) => {
  useEffect(() => {
    console.log("Connecting to Pusher...");

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(channelName);
    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName, callback);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, callback]);
};
