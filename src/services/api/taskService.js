import { toast } from 'react-toastify';
import { taskListService } from '../index';

export const getAll = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "priority" } },
        { field: { Name: "due_date" } },
        { field: { Name: "completed" } },
        { field: { Name: "completed_at" } },
        { field: { Name: "list_id" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      where: [],
      orderBy: [
        { fieldName: "due_date", sorttype: "ASC" },
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    // Add filters based on parameters
    if (filters.completed !== undefined) {
      params.where.push({
        FieldName: "completed",
        Operator: "EqualTo",
        Values: [filters.completed ? "true" : "false"]
      });
    }
    
    if (filters.listId) {
      params.where.push({
        FieldName: "list_id",
        Operator: "EqualTo",
        Values: [parseInt(filters.listId, 10)]
      });
    }
    
    if (filters.priority) {
      params.where.push({
        FieldName: "priority",
        Operator: "EqualTo",
        Values: [filters.priority]
      });
    }
    
    if (filters.search) {
      params.whereGroups = [{
        operator: "OR",
        subGroups: [
          {
            conditions: [{
              fieldName: "title",
              operator: "Contains",
              values: [filters.search]
            }],
            operator: "OR"
          },
          {
            conditions: [{
              fieldName: "description",
              operator: "Contains",
              values: [filters.search]
            }],
            operator: "OR"
          }
        ]
      }];
    }
    
    const response = await apperClient.fetchRecords('task', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    // Map database fields to UI field names
    return response.data.map(task => ({
      Id: task.Id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.due_date,
      completed: task.completed === "true" || task.completed === true,
      completedAt: task.completed_at,
      listId: task.list_id?.toString(),
      createdAt: task.created_at,
      updatedAt: task.updated_at
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    toast.error('Failed to load tasks');
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
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "priority" } },
        { field: { Name: "due_date" } },
        { field: { Name: "completed" } },
        { field: { Name: "completed_at" } },
        { field: { Name: "list_id" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ]
    };
    
    const response = await apperClient.getRecordById('task', parseInt(id, 10), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error('Task not found');
    }
    
    // Map database fields to UI field names
    const task = response.data;
    return {
      Id: task.Id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.due_date,
      completed: task.completed === "true" || task.completed === true,
      completedAt: task.completed_at,
      listId: task.list_id?.toString(),
      createdAt: task.created_at,
      updatedAt: task.updated_at
    };
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    throw error;
  }
};

export const create = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const params = {
      records: [{
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        due_date: taskData.dueDate || null,
        completed: "false",
        completed_at: null,
        list_id: parseInt(taskData.listId, 10) || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]
    };
    
    const response = await apperClient.createRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error('Failed to create task');
    }
    
    if (response.results && response.results.length > 0) {
      const result = response.results[0];
      if (!result.success) {
        console.error(`Failed to create task:${JSON.stringify([result])}`);
        if (result.message) toast.error(result.message);
        throw new Error('Failed to create task');
      }
      
      // Update task count in list
      await taskListService.updateTaskCount(taskData.listId);
      
      // Map database fields to UI field names
      const task = result.data;
      return {
        Id: task.Id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed === "true" || task.completed === true,
        completedAt: task.completed_at,
        listId: task.list_id?.toString(),
        createdAt: task.created_at,
        updatedAt: task.updated_at
      };
    }
    
    throw new Error('No data returned from create operation');
  } catch (error) {
    console.error('Error creating task:', error);
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
      Id: parseInt(id, 10),
      updated_at: new Date().toISOString()
    };
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
    if (updates.completed !== undefined) {
      updateData.completed = updates.completed ? "true" : "false";
      updateData.completed_at = updates.completed ? new Date().toISOString() : null;
    }
    if (updates.listId !== undefined) updateData.list_id = parseInt(updates.listId, 10);
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error('Failed to update task');
    }
    
    if (response.results && response.results.length > 0) {
      const result = response.results[0];
      if (!result.success) {
        console.error(`Failed to update task:${JSON.stringify([result])}`);
        if (result.message) toast.error(result.message);
        throw new Error('Failed to update task');
      }
      
      // Update task count in list if list changed
      if (updates.listId !== undefined) {
        await taskListService.updateTaskCount(updates.listId);
      }
      
      // Map database fields to UI field names
      const task = result.data;
      return {
        Id: task.Id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed === "true" || task.completed === true,
        completedAt: task.completed_at,
        listId: task.list_id?.toString(),
        createdAt: task.created_at,
        updatedAt: task.updated_at
      };
    }
    
    throw new Error('No data returned from update operation');
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    // Get task info before deletion for list update
    const task = await getById(id);
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id, 10)]
    };
    
    const response = await apperClient.deleteRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error('Failed to delete task');
    }
    
    if (response.results && response.results.length > 0) {
      const result = response.results[0];
      if (!result.success) {
        console.error(`Failed to delete task:${JSON.stringify([result])}`);
        if (result.message) toast.error(result.message);
        throw new Error('Failed to delete task');
      }
    }
    
    // Update task count in list
    await taskListService.updateTaskCount(task.listId);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const toggleComplete = async (id) => {
  try {
    const task = await getById(id);
    const completed = !task.completed;
    
    return await update(id, { completed });
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }
};

export const getTaskStats = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Get total tasks
    const totalParams = {
      fields: [
        { field: { Name: "Id" }, Function: "Count", Alias: "Count" }
      ]
    };
    
    // Get completed tasks
    const completedParams = {
      fields: [
        { field: { Name: "Id" }, Function: "Count", Alias: "Count" }
      ],
      where: [
        { FieldName: "completed", Operator: "EqualTo", Values: ["true"] }
      ]
    };
    
    // Get overdue tasks
    const overdueParams = {
      fields: [
        { field: { Name: "Id" }, Function: "Count", Alias: "Count" }
      ],
      where: [
        { FieldName: "completed", Operator: "EqualTo", Values: ["false"] },
        { FieldName: "due_date", Operator: "LessThan", Values: [new Date().toISOString().split('T')[0]] }
      ]
    };
    
    const [totalResponse, completedResponse, overdueResponse] = await Promise.all([
      apperClient.fetchRecords('task', totalParams),
      apperClient.fetchRecords('task', completedParams),
      apperClient.fetchRecords('task', overdueParams)
    ]);
    
    const totalTasks = totalResponse.success ? (totalResponse.data?.[0]?.Count || 0) : 0;
    const completedTasks = completedResponse.success ? (completedResponse.data?.[0]?.Count || 0) : 0;
    const overdueTasks = overdueResponse.success ? (overdueResponse.data?.[0]?.Count || 0) : 0;
    const activeTasks = totalTasks - completedTasks;
    
    return {
      total: totalTasks,
      completed: completedTasks,
      active: activeTasks,
      overdue: overdueTasks
    };
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return {
      total: 0,
      completed: 0,
      active: 0,
      overdue: 0
    };
  }
};