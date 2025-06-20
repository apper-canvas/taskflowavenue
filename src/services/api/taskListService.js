import { toast } from 'react-toastify';

export const getAll = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "color" } },
        { field: { Name: "icon" } },
        { field: { Name: "task_count" } },
        { field: { Name: "order" } }
      ],
      orderBy: [
        { fieldName: "order", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords('task_list', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    // Map database fields to UI field names
    return response.data.map(list => ({
      Id: list.Id,
      name: list.Name,
      color: list.color,
      icon: list.icon,
      taskCount: list.task_count || 0,
      order: list.order
    }));
  } catch (error) {
    console.error('Error fetching task lists:', error);
    toast.error('Failed to load task lists');
    return [];
  }
};

export const getById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "color" } },
        { field: { Name: "icon" } },
        { field: { Name: "task_count" } },
        { field: { Name: "order" } }
      ]
    };
    
    const response = await apperClient.getRecordById('task_list', parseInt(id, 10), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error('Task list not found');
    }
    
    // Map database fields to UI field names
    const list = response.data;
    return {
      Id: list.Id,
      name: list.Name,
      color: list.color,
      icon: list.icon,
      taskCount: list.task_count || 0,
      order: list.order
    };
  } catch (error) {
    console.error(`Error fetching task list ${id}:`, error);
    throw error;
  }
};

export const create = async (listData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: listData.name,
        color: listData.color || '#5B47E0',
        icon: listData.icon || 'List',
        task_count: 0,
        order: listData.order || 1
      }]
    };
    
    const response = await apperClient.createRecord('task_list', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error('Failed to create task list');
    }
    
    if (response.results && response.results.length > 0) {
      const result = response.results[0];
      if (!result.success) {
        console.error(`Failed to create task list:${JSON.stringify([result])}`);
        if (result.message) toast.error(result.message);
        throw new Error('Failed to create task list');
      }
      
      // Map database fields to UI field names
      const list = result.data;
      return {
        Id: list.Id,
        name: list.Name,
        color: list.color,
        icon: list.icon,
        taskCount: list.task_count || 0,
        order: list.order
      };
    }
    
    throw new Error('No data returned from create operation');
  } catch (error) {
    console.error('Error creating task list:', error);
    throw error;
  }
};

export const update = async (id, updates) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const updateData = {
      Id: parseInt(id, 10)
    };
    
    if (updates.name !== undefined) updateData.Name = updates.name;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.taskCount !== undefined) updateData.task_count = updates.taskCount;
    if (updates.order !== undefined) updateData.order = updates.order;
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord('task_list', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error('Failed to update task list');
    }
    
    if (response.results && response.results.length > 0) {
      const result = response.results[0];
      if (!result.success) {
        console.error(`Failed to update task list:${JSON.stringify([result])}`);
        if (result.message) toast.error(result.message);
        throw new Error('Failed to update task list');
      }
      
      // Map database fields to UI field names
      const list = result.data;
      return {
        Id: list.Id,
        name: list.Name,
        color: list.color,
        icon: list.icon,
        taskCount: list.task_count || 0,
        order: list.order
      };
    }
    
    throw new Error('No data returned from update operation');
  } catch (error) {
    console.error('Error updating task list:', error);
    throw error;
  }
};

export const deleteList = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id, 10)]
    };
    
    const response = await apperClient.deleteRecord('task_list', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error('Failed to delete task list');
    }
    
    if (response.results && response.results.length > 0) {
      const result = response.results[0];
      if (!result.success) {
        console.error(`Failed to delete task list:${JSON.stringify([result])}`);
        if (result.message) toast.error(result.message);
        throw new Error('Failed to delete task list');
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting task list:', error);
    throw error;
  }
};

export const updateTaskCount = async (listId) => {
  try {
    // Get current task count for the list
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Count active tasks for this list
    const params = {
      fields: [
        { field: { Name: "Id" }, Function: "Count", Alias: "Count" }
      ],
      where: [
        { FieldName: "list_id", Operator: "EqualTo", Values: [parseInt(listId, 10)] },
        { FieldName: "completed", Operator: "EqualTo", Values: ["false"] }
      ]
    };
    
    const response = await apperClient.fetchRecords('task', params);
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }
    
    const taskCount = response.data?.[0]?.Count || 0;
    
    // Update the task list with new count
    const updatedList = await update(listId, { taskCount });
    return updatedList;
  } catch (error) {
    console.error('Error updating task count:', error);
    return null;
  }
};