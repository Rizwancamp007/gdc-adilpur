import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

/**
 * Generic CRUD hook for admin modules.
 * 
 * @param {string} endpoint - API endpoint (e.g. '/hero-slides')
 * @param {object} options - { autoFetch, defaultSort }
 */
const useCrud = (endpoint, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (page) queryParams.set('page', page);
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') queryParams.set(k, v);
      });
      const { data: res } = await api.get(`${endpoint}?${queryParams.toString()}`);
      if (res.success) {
        setData(res.data);
        setPagination({ page: res.page || 1, pages: res.pages || 1, total: res.total || res.data.length });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, search, page]);

  useEffect(() => {
    if (autoFetch) fetchData();
  }, [fetchData, autoFetch]);

  const createItem = async (formData) => {
    const { data: res } = await api.post(endpoint, formData);
    if (res.success) {
      toast.success('Created successfully');
      fetchData();
    }
    return res;
  };

  const updateItem = async (id, formData) => {
    const { data: res } = await api.put(`${endpoint}/${id}`, formData);
    if (res.success) {
      toast.success('Updated successfully');
      fetchData();
    }
    return res;
  };

  const deleteItem = async (id) => {
    const { data: res } = await api.delete(`${endpoint}/${id}`);
    if (res.success) {
      toast.success(res.message || 'Deleted successfully');
      fetchData();
    }
    return res;
  };

  const restoreItem = async (id) => {
    const { data: res } = await api.patch(`${endpoint}/${id}/restore`);
    if (res.success) {
      toast.success('Restored successfully');
      fetchData();
    }
    return res;
  };

  // For singleton endpoints (GET one, PUT update)
  const fetchSingleton = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get(endpoint);
      if (res.success) {
        setData(res.data);
      }
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateSingleton = async (formData) => {
    const { data: res } = await api.put(endpoint, formData);
    if (res.success) {
      toast.success('Updated successfully');
      setData(res.data);
    }
    return res;
  };

  return {
    data, setData, loading, search, setSearch, page, setPage, pagination,
    fetchData, createItem, updateItem, deleteItem, restoreItem,
    fetchSingleton, updateSingleton,
  };
};

export default useCrud;
