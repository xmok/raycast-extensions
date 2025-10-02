import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { IStation } from "../types";
import Departures from "./departures";

interface StationProps {
  onToggleFavorite: (station: IStation) => void;
  isFavorite?: boolean;
  station: IStation;
}

export default function Station({ isFavorite, onToggleFavorite, station }: StationProps) {
  return (
    <List.Item
      accessories={[
        ...(isFavorite ? [{ icon: { source: Icon.Heart, tintColor: Color.Red }, tooltip: "Favorite station" }] : []),
        { icon: Icon.ArrowRight },
      ]}
      icon={Icon.Geopin}
      actions={
        <ActionPanel>
          <Action.Push title="Select" target={<Departures station={station} />} icon={Icon.ArrowRight} />
          <Action
            title={isFavorite ? "Remove From Favorites" : "Add to Favorites"}
            icon={{
              source: isFavorite ? Icon.HeartDisabled : Icon.Heart,
              tintColor: Color.Red,
            }}
            shortcut={{ modifiers: isFavorite ? ["cmd", "shift"] : ["cmd"], key: "s" }}
            onAction={() => {
              onToggleFavorite(station);
            }}
          />
        </ActionPanel>
      }
      title={station.name || station.address || "Unknown"}
    />
  );
}
