import { getPreferenceValues, Icon, Keyboard, MenuBarExtra, open, openCommandPreferences } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { pipe } from "fp-ts/lib/function";
import * as music from "./util/scripts";
import * as TE from "fp-ts/TaskEither";
import { handleTaskEitherError } from "./util/utils";
import { PlayerState } from "./util/models";
import { getPlayerState } from "./util/scripts/player-controls";
import { useRef } from "react";

export default function NowPlayingMenuBarCommand() {
  const { hideArtistName, maxTextLength, cleanupTitle } = getPreferenceValues<Preferences.NowPlayingMenuBar>();
  const shouldExecute = useRef<boolean>(false);

  const { isLoading, data } = usePromise(() =>
        pipe(
        music.currentTrack.getCurrentTrack(),
        TE.matchW(
            () => undefined,
            (track) => track
        )
    )(),[], {
      onData() {
        shouldExecute.current = true;
      },
    }
);
const {isLoading: isLoadingPlayerState, data:playerState, mutate: mutatePlayerState} = usePromise(() => pipe(
  getPlayerState,
  TE.matchW(
            () => PlayerState.STOPPED,
            (state) => state
        )
)(),[],{execute:shouldExecute.current})
  
  const isRunning = !isLoading && !!data;
  const isPlaying = playerState===PlayerState.PLAYING;
  if (!isRunning) {
    return (
      <OpenMusic isLoading={isLoading || isLoadingPlayerState} />
    );
  }

  if (!data) {
    return (
      <NothingPlaying isLoading={isLoading || isLoadingPlayerState} />
    );
  }

  const currentlyPlayingData = data;
  const item = currentlyPlayingData;
  const { name, artist } = item;

  let title = "";

    const artistName = artist;
    title = formatTitle({ name, artistName, hideArtistName, maxTextLength, cleanupTitle });
  return (
    <MenuBarExtra
      isLoading={isLoading || isLoadingPlayerState}
      icon="icon.png"
      title={title}
      tooltip={title}
    >
      {isPlaying && (
        <MenuBarExtra.Item
          icon={Icon.Pause}
          title="Pause"
          onAction={() => pipe(
            music.player.pause,
            handleTaskEitherError("Failed to pause playback", "Playback paused"),
            TE.chainFirstTaskK(() => () => mutatePlayerState(undefined, {
              optimisticUpdate() {
                return PlayerState.PAUSED
              },
            }))
          )()}
        />
      )}
      {!isPlaying && (
        <MenuBarExtra.Item
          icon={Icon.Play}
          title="Play"
          onAction={() => pipe(
            music.player.play,
            handleTaskEitherError("Failed to start playback", "Playback started"),
            TE.chainFirstTaskK(() => () => mutatePlayerState(undefined, {
              optimisticUpdate() {
                return PlayerState.PLAYING
              },
            }))
          )()}
        />
      )}
      <MenuBarExtra.Item
          icon={Icon.Forward}
          title="Next"
          onAction={() => pipe(music.player.next, handleTaskEitherError("Failed to skip track", "Track skipped"))()}
        />
        <MenuBarExtra.Item
          icon={Icon.Rewind}
          title="Previous"
          onAction={() => pipe(music.player.previous, handleTaskEitherError("Failed to rewind track", "Track rewinded"))()}
        />
      
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          icon="icon.png"
          title="Open Music"
          shortcut={Keyboard.Shortcut.Common.Open}
          onAction={() => open("music://")}
        />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Configure Command"
          shortcut={{ macOS: { modifiers: ["cmd"], key: "," }, Windows: { modifiers: ["ctrl"], key: "," } }}
          onAction={openCommandPreferences}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}

function OpenMusic({ isLoading }: { title?: string; isLoading: boolean }) {
  const {hideIconWhenIdle} = getPreferenceValues<Preferences.NowPlayingMenuBar>();

  return hideIconWhenIdle ? null : (
    <MenuBarExtra icon="icon.png" isLoading={isLoading}>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item title="Music needs to be opened" />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Open Music"
          icon="icon.png"
          onAction={() => open("music:")}
        />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Configure Command"
          shortcut={{ macOS: { modifiers: ["cmd"], key: "," }, Windows: { modifiers: ["ctrl"], key: "," } }}
          onAction={openCommandPreferences}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}

function NothingPlaying({ title = "Nothing is playing right now", isLoading }: { title?: string; isLoading: boolean }) {
  const {hideIconWhenIdle} = getPreferenceValues<Preferences.NowPlayingMenuBar>();
  return hideIconWhenIdle ? null : (
    <MenuBarExtra icon="icon.png" isLoading={isLoading}>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item title={title} />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Open Music"
          icon="icon.png"
          onAction={() => open("music://")}
        />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Configure Command"
          shortcut={{ macOS: { modifiers: ["cmd"], key: "," }, Windows: { modifiers: ["ctrl"], key: "," } }}
          onAction={openCommandPreferences}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}

function formatTitle({ name, artistName, hideArtistName, maxTextLength, cleanupTitle }: { name: string; artistName: string; hideArtistName: boolean; maxTextLength: number; cleanupTitle: boolean }) {
  const max = maxTextLength ? Number(maxTextLength) : 30;

  if (max === 0) {
    return "";
  }

  if (!name || !artistName) {
    return "";
  }

  const filteredName = cleanupTitle ? cleanupSongTitle(name) : name;
  const title = hideArtistName ? filteredName : `${filteredName} · ${artistName}`;

  if (title.length <= max) {
    return title;
  }

  return title.substring(0, max).trim() + "…";
}
function cleanupSongTitle(inputString: string): string {
  // If title starts with a bracket or 'feat.', skip cleanup
  const lower = inputString.toLowerCase().trim();
  if (
    inputString.charAt(0) === "(" ||
    inputString.charAt(0) === "[" ||
    lower.startsWith("feat.") ||
    lower.startsWith("ft.") ||
    lower.startsWith("featuring")
  ) {
    return inputString;
  }

  const firstOpeningParenthesisIndex = inputString.indexOf("(");
  const firstOpeningBracketIndex = inputString.indexOf("[");

  const spacedHyphenIndex = inputString.indexOf(" - ");

  const featMatch = inputString.match(/(\s+|\()(feat\.|ft\.|featuring)(\s|\))/i);
  const featIndex = featMatch ? featMatch.index! : -1;

  // Determine the first relevant cutoff point
  const index = Math.min(
    firstOpeningParenthesisIndex !== -1 ? firstOpeningParenthesisIndex : Infinity,
    firstOpeningBracketIndex !== -1 ? firstOpeningBracketIndex : Infinity,
    spacedHyphenIndex !== -1 ? spacedHyphenIndex : Infinity,
    featIndex !== -1 ? featIndex : Infinity,
  );

  return index !== Infinity ? inputString.slice(0, index).trim() : inputString;
}