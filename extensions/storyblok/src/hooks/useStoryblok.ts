import { useState, useEffect } from 'react';
import { Storyblok } from '../constants';
import { ISbError } from 'storyblok-js-client';
import { showFailureToast } from '@raycast/utils';
import { Toast, showToast } from '@raycast/api';

type HookOptions<T> = {
  onData?: (data: T) => void;
}
const useStoryblok = <T>(slug: string, message="...", options?: HookOptions<T>) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    showToast({
      title: "PROCESSING",
      message,
      style: Toast.Style.Animated
    })
    Storyblok
      .get(slug)
      .then((response) => {
        setData(response.data);
        options?.onData?.(response.data); // Call the callback function if provided
      })
      .catch((error: ISbError) => {
        showFailureToast(error.message, { title: `${error.status} Error`});
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { data, error, isLoading };
};

export default useStoryblok;
