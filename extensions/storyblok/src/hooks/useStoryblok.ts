import { useState, useEffect } from 'react';
import { Storyblok } from '../constants';
import { ISbError } from 'storyblok-js-client';
import { showFailureToast } from '@raycast/utils';
import { Toast, showToast } from '@raycast/api';

type HookOptions<T> = {
  manual?: boolean;
  onData?: (data: T) => void;
  onError?: (error: unknown) => void;
}
const useStoryblok = <T>(method: "GET" | "PUT", slug: string, params={}, message="...", options: HookOptions<T> = {manual: false}) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);

  const revalidate = (params?) => {
    setIsLoading(true);
    showToast({
      title: "PROCESSING",
      message,
      style: Toast.Style.Animated
    })

    if (method==="GET") {
      Storyblok
        .get(slug, params)
        .then((response) => {
          setData(response.data);
          options?.onData?.(response.data); // Call the callback function if provided
        })
        .catch((error: ISbError) => {
          showFailureToast(error.message, { title: `${error.status} Error`});
          setError(error);
          options?.onError?.(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
      } else if (method==="PUT") {
        Storyblok
          .put(slug, params)
          .then((response: unknown) => {
            const data = (response as ({data: T})).data;
            setData(data);
            options?.onData?.(data); // Call the callback function if provided
          })
          .catch((error: ISbError) => {
            console.log(error)
            showFailureToast(error.message, { title: `${error.status} Error`});
            setError(error);
            options?.onError?.(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }

  }
  useEffect(() => {
    if (!options.manual)
      revalidate(params);
    else
      setIsLoading(false)
  }, []);

  return { data, error, isLoading, revalidate };
};

export default useStoryblok;
