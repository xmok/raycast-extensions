import { Detail } from "@raycast/api";
import { useHabitica } from "./lib/hooks/useHabitiica";
import { type WorldState } from "./lib/types";

export default function WorldState() {
    const { isLoading, data: world } = useHabitica<WorldState>("world-state");

    const markdown = !world ? "" : `## Current Events
    
| Event | NPC Image Suffix | Season | Gear | Start | End |
|-------|------------------|--------|------|-------|-----|
${world.data.currentEventList.map(event => `| ${event.event} | ${event.npcImageSuffix} | ${event.season} | ${event.gear} | ${event.start} | ${event.end} |`)}`;

    return <Detail isLoading={isLoading} markdown={markdown} />
}