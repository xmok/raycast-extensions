import { AssetResponseDto, getAssetInfo, getAssetThumbnailPath, searchSmart, updateAsset } from "@immich/sdk";
import { Action, ActionPanel, Detail, Grid, Icon, showToast, Toast } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { buildAuthenticatedUrl, initialize } from "./immich";
import { useState } from "react";

const getThumbnail = (id: string) => buildAuthenticatedUrl(getAssetThumbnailPath(id))

export default function Explore() {
    const [searchText, setSearchText] = useState("");
    const {isLoading,data: assets,pagination, mutate} = useCachedPromise((query: string) => async(options) => {
        initialize();
        if (!query.trim()) return {data: [], hasMore: false};
        const res = await searchSmart({smartSearchDto: {
            query,
            size: 15,
            page: options.page+1,
            withExif: false
        }});
        return {
            data: res.assets.items,
            hasMore: !!res.assets.nextPage
        };
    },[searchText],{initialData:[]});

    const toggleFavorite = async (asset: AssetResponseDto) => {
        const newFav = !asset.isFavorite;
        const toast = await showToast(Toast.Style.Animated, "Toggling Favorite", asset.originalFileName);
        try {
            await mutate(
                updateAsset({id: asset.id, updateAssetDto: {isFavorite: !asset.isFavorite}}), {
                    optimisticUpdate(data) {
                        return data.map(a => a.id === asset.id ? {...a, isFavorite: newFav} : a)
                    },
                    shouldRevalidateAfter: false
                }
            )
            toast.style = Toast.Style.Success;
            toast.title = "Favorite Toggled";
        } catch (error) {
            toast.style = Toast.Style.Failure;
            toast.title = "Failed to toggle favorite";
            toast.message = `${error}`
        }
    }

    return <Grid isLoading={isLoading} searchBarPlaceholder="Search your photos" pagination={pagination} onSearchTextChange={setSearchText} throttle>
        {!isLoading && !assets.length ? <Grid.EmptyView icon={Icon.MagnifyingGlass} title="Enter something to start searching" /> : assets.map(asset => <Grid.Item key={asset.id} content={getThumbnail(asset.id)} actions={<ActionPanel>
            {asset.isFavorite ? <Action icon={Icon.HeartDisabled} title="Unfavorite" onAction={() => toggleFavorite(asset)} /> : <Action icon={Icon.Heart} title="Favorite" onAction={() => toggleFavorite(asset)} />}
            <Action.Push icon={Icon.Info} title="View Asset" target={<AssetView asset={asset} />} />
        </ActionPanel>} />)}
    </Grid>
}

function AssetView({asset}: {asset: AssetResponseDto}) {
    const {data: info} = useCachedPromise(async(id) => {
        initialize();
        const res = await getAssetInfo({id});
        return res;
    },[asset.id]);
    return <Detail markdown={`![](${getThumbnail(asset.id)}) \n---\n ${info?.exifInfo?.description || ""}`} metadata={info && <Detail.Metadata>
        <Detail.Metadata.Label title="Description" text={info.exifInfo?.description || ""} />
        <Detail.Metadata.Separator />
        <Detail.Metadata.Label title="Details" />
        <Detail.Metadata.Label icon={Icon.Image} title="" text={asset.originalFileName} />
        <Detail.Metadata.TagList title="Tags">
            {asset.tags?.map(tag => <Detail.Metadata.TagList.Item key={tag.id} text={tag.name} />)}
        </Detail.Metadata.TagList>
    </Detail.Metadata>} />
}
