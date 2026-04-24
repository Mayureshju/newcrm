import { forwardRef } from "react";
import type { ThreadItem } from "../../types/messenger";
import { ThreadList } from "./ThreadItems";

export const LiveThread = forwardRef<HTMLDivElement, { items: ThreadItem[] }>(
  function LiveThread({ items }, ref) {
    return (
      <div ref={ref} className="flex flex-col gap-2 px-5 py-4">
        <ThreadList items={items} />
      </div>
    );
  }
);
