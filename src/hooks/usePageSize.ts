import { useState, useEffect } from 'react';

const PAGE_SIZE_KEY = 'taskTablePageSize';
const DEFAULT_PAGE_SIZE = '5';

export const usePageSize = () => {
    const [pageSize, setPageSize] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(PAGE_SIZE_KEY) || DEFAULT_PAGE_SIZE;
        }
        return DEFAULT_PAGE_SIZE;
    });

    useEffect(() => {
        localStorage.setItem(PAGE_SIZE_KEY, pageSize);
    }, [pageSize]);

    const updatePageSize = (newSize: string) => {
        setPageSize(newSize);
    };

    return { pageSize, updatePageSize };
};