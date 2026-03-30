import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (loadMore, hasMore, isLoading) => {
  const [element, setElement] = useState(null);
  const observer = useRef();

  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isLoading) {
      loadMore();
    }
  }, [loadMore, hasMore, isLoading]);

  useEffect(() => {
    if (!element) return;

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    observer.current.observe(element);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [element, handleObserver]);

  return { setElement };
};