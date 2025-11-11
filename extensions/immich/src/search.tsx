import { AssetResponseDto, getAssetInfo, getAssetThumbnailPath, searchSmart } from "@immich/sdk";
import { Action, ActionPanel, Detail, Grid, Icon } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { buildAuthenticatedUrl, initialize } from "./immich";
import { useState } from "react";

const getThumbnail = (id: string) => buildAuthenticatedUrl(getAssetThumbnailPath(id))

export default function APIKeys() {
    const [searchText, setSearchText] = useState("");
    const {isLoading,data: assets,pagination} = useCachedPromise((query: string) => async(options) => {
        initialize();
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
    },[searchText],{initialData:[], execute: !!searchText});

    return <Grid isLoading={isLoading} pagination={pagination} onSearchTextChange={setSearchText} throttle>
        {assets.map(asset => <Grid.Item key={asset.id} content={getThumbnail(asset.id)} actions={<ActionPanel>
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
        {/* <Detail.Metadata.Label icon={Icon.Calendar} title="" text={info.} /> */}
    </Detail.Metadata>} />
}
